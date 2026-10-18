/* v4 canonical store. Legacy keys are read-only; every replacement is recoverable. */
(function (root) {
  const KEY = "originLab.save.v4",
    JOURNAL = KEY + ".commit.",
    BACKUP = KEY + ".backup.";
  const uuid = () => crypto.randomUUID();
  class OriginStorage {
    constructor(storage, decode, encode) {
      this.storage = storage;
      this.decode = decode;
      this.encode = encode;
      this.base = null;
      this.blocked = false;
      this.message = "";
      this.candidates = [];
    }
    read(k) {
      return this.storage.getItem(k);
    }
    write(k, raw) {
      this.storage.setItem(k, raw);
      if (this.read(k) !== raw) throw Error("저장 후 읽기 검증 실패");
    }
    keys(prefix) {
      return Array.from({ length: this.storage.length }, (_, i) =>
        this.storage.key(i),
      ).filter((k) => k?.startsWith(prefix));
    }
    legacyBackups() {
      return [
        ...this.keys("originLab.save.v3.backup."),
        ...this.keys("originLab.save.v3.commit."),
        ...(this.read("originLab.save.v3") === null
          ? []
          : ["originLab.save.v3"]),
        ...this.keys("originLab.save.backup."),
        ...this.keys("originLab.save.v1-backup"),
      ];
    }
    backup(raw, label) {
      if (raw !== null)
        this.write(BACKUP + Date.now() + "." + uuid() + "." + label, raw);
    }
    fail(message, candidates = []) {
      this.blocked = true;
      this.message = message;
      this.candidates = candidates;
      return { status: "rejected", reason: message };
    }
    candidate(raw, label) {
      const decoded = this.decode(raw);
      return { raw, label, ...decoded };
    }
    load() {
      try {
        this.base = this.read(KEY);
        if (this.base !== null) {
          const current = this.candidate(this.base, "v0.3 정본");
          if (current.status !== "ok" || current.fromVersion !== 4)
            return this.fail(
              current.reason || "정본 스키마가 올바르지 않습니다.",
              [current],
            );
          const meta = JSON.parse(this.base);
          if (!meta.commitId || !Array.isArray(meta.ancestors))
            return this.fail(
              "정본 이력 정보가 없습니다. JSON 가져오기로 검토 후 복구하세요.",
            );
          const commits = this.keys(JOURNAL).map((k) =>
            this.candidate(this.read(k), k),
          );
          const other = commits.filter((x) => {
            if (x.status !== "ok") return true;
            const m = JSON.parse(x.raw);
            return (
              m.commitId !== meta.commitId &&
              !meta.ancestors.includes(m.commitId)
            );
          });
          if (other.length) {
            this.fail(
              "서로 다른 저장 이력이 있습니다. 자동 저장을 멈췄습니다. 복구할 기록을 선택하세요.",
              [current, ...other],
            );
            return { ...current, notes: [this.message] };
          }
          this.blocked = false;
          this.message = "v0.3 정본을 불러왔습니다.";
          return current;
        }
        // Once a v3 canonical exists, older v1/v2 writers have no authority.
        // Its whole branch set is read-only input, including unresolved commits.
        const rawV3 = this.read("originLab.save.v3");
        if (rawV3 !== null) {
          const head = this.candidate(rawV3, "v0.2 정본 (읽기 전용)");
          const history = this.keys("originLab.save.v3.commit.").map((k) =>
            this.candidate(this.read(k), k),
          );
          for (const entry of [head, ...history])
            this.backup(entry.raw, "v3-original");
          if (head.status !== "ok" || head.fromVersion !== 3)
            return this.fail(
              "v3 정본을 안전하게 이전할 수 없습니다. 백업에서 복구하세요.",
              [head, ...history],
            );
          const meta = JSON.parse(rawV3);
          if (!meta.commitId || !Array.isArray(meta.ancestors))
            return this.fail(
              "v3 저장 이력을 확인할 수 없습니다. 이전할 기록을 직접 선택하세요.",
              [head, ...history],
            );
          const divergent = history.filter((x) => {
            if (x.status !== "ok") return true;
            const m = JSON.parse(x.raw);
            return (
              m.commitId !== meta.commitId &&
              !meta.ancestors.includes(m.commitId)
            );
          });
          if (divergent.length)
            return this.fail(
              "v3 저장 이력이 충돌합니다. 이전할 기록을 선택하세요.",
              [head, ...divergent],
            );
          if (
            this.keys(JOURNAL).length ||
            this.keys(BACKUP).some((k) => !k.endsWith("v3-original"))
          )
            return this.fail(
              "v4 복구 기록이 남아 있습니다. 이전을 반복하지 않고 복구를 요청합니다.",
              [head, ...this.list()],
            );
          if (!this.save(head.state)) return this.fail(this.message, [head]);
          return {
            ...head,
            notes: [
              "v3 원본과 이력을 백업한 뒤 v4 정본으로 이전했습니다. 구버전 저장은 읽기 전용입니다.",
            ],
          };
        }
        const newerRecovery = [
          ...this.keys(BACKUP),
          ...this.keys("originLab.save.v3.commit."),
          ...this.keys("originLab.save.v3.backup."),
        ];
        if (newerRecovery.length)
          return this.fail(
            "최신 정본은 없지만 복구 기록이 남아 있습니다. 구버전으로 돌아가지 않고 복구를 요청합니다.",
            newerRecovery.map((k) => this.candidate(this.read(k), k)),
          );
        const legacy = ["originLab.save", "originLab.save.v2"]
          .map((k) => ({ key: k, raw: this.read(k) }))
          .filter((x) => x.raw !== null);
        const journal = this.keys(JOURNAL);
        if (journal.length)
          return this.fail(
            "정본 기록이 없지만 복구 가능한 저장 이력이 있습니다.",
            journal.map((k) => this.candidate(this.read(k), k)),
          );
        if (!legacy.length) {
          const backups = [...this.keys(BACKUP), ...this.legacyBackups()];
          if (backups.length)
            return this.fail(
              "정본 없이 백업만 남아 있습니다. 복구할 기록을 선택하세요.",
              backups.map((k) => this.candidate(this.read(k), k)),
            );
          this.message = "새 실험 · 이 브라우저에 자동 저장합니다.";
          return { status: "empty" };
        }
        for (const x of legacy) this.backup(x.raw, "legacy");
        const candidates = legacy.map((x) => this.candidate(x.raw, x.key));
        if (candidates.some((x) => x.status !== "ok"))
          return this.fail(
            "구버전 저장을 읽지 못했습니다. 원본 백업을 확인하세요.",
            candidates,
          );
        if (
          candidates.length > 1 &&
          JSON.stringify(candidates[0].state) !==
            JSON.stringify(candidates[1].state)
        )
          return this.fail(
            "구버전 저장 두 개가 서로 다릅니다. 원본을 모두 백업했습니다. 이전할 기록을 선택하세요.",
            candidates,
          );
        const state = candidates[0].state;
        if (!this.save(state)) return this.fail(this.message, candidates);
        return {
          status: "ok",
          state,
          fromVersion: candidates[0].fromVersion,
          notes: ["구버전 원본을 백업하고 v4 정본으로 이전했습니다."],
        };
      } catch (e) {
        return this.fail("저장 읽기·백업·이전에 실패했습니다: " + e.message);
      }
    }
    save(state) {
      if (this.blocked) return false;
      try {
        const current = this.read(KEY);
        if (current !== this.base) {
          this.backup(this.encode(state), "unsaved-conflict");
          this.fail(
            "다른 창에서 저장이 변경되었습니다. 두 진행을 백업 목록에서 비교하세요.",
            [
              this.candidate(current, "다른 창"),
              this.candidate(this.encode(state), "이 창"),
            ],
          );
          return false;
        }
        let previous = null;
        try {
          previous = current ? JSON.parse(current) : null;
        } catch {}
        if (!previous?.commitId || !Array.isArray(previous.ancestors))
          previous = null;
        const envelope = JSON.parse(this.encode(state));
        Object.assign(envelope, {
          format: "origin-lab",
          schemaVersion: 4,
          commitId: uuid(),
          parent: previous?.commitId ?? null,
          ancestors: previous
            ? [previous.commitId, ...previous.ancestors].slice(0, 24)
            : [],
        });
        const raw = JSON.stringify(envelope);
        this.write(JOURNAL + envelope.commitId, raw);
        if (this.read(KEY) !== current) {
          this.fail(
            "동시에 저장이 변경되었습니다. 양쪽 저장 이력을 보존했습니다.",
          );
          return false;
        }
        this.write(KEY, raw);
        this.base = raw;
        this.message = "자동 저장 완료";
        // Keep the last 12 ancestors; never remove a divergent branch.
        for (const key of this.keys(JOURNAL)) {
          const id = key.slice(JOURNAL.length);
          if (envelope.ancestors.indexOf(id) >= 12)
            this.storage.removeItem(key);
        }
        return true;
      } catch (e) {
        this.fail("저장 공간 또는 쓰기 오류: " + e.message);
        return false;
      }
    }
    replace(state, label = "restore") {
      try {
        const raw = this.read(KEY);
        this.backup(raw, label);
        this.backup(this.encode(state), "selected");
        for (const k of this.keys(JOURNAL)) {
          this.backup(this.read(k), "history");
        }
        // Backups are fully verified before any journal is retired.
        for (const k of this.keys(JOURNAL)) this.storage.removeItem(k);
        this.base = raw;
        this.blocked = false;
        return this.save(state);
      } catch (e) {
        this.fail("복구 전 백업 실패: " + e.message);
        return false;
      }
    }
    list() {
      try {
        return [
          ...this.candidates,
          ...this.keys(BACKUP)
            .reverse()
            .map((k) => this.candidate(this.read(k), k)),
          ...this.keys(JOURNAL).map((k) => this.candidate(this.read(k), k)),
          ...this.legacyBackups().map((k) => this.candidate(this.read(k), k)),
        ];
      } catch (e) {
        this.fail(e.message);
        return [];
      }
    }
  }
  OriginStorage.KEY = KEY;
  root.OriginStorage = OriginStorage;
})(globalThis);

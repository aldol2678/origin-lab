const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs");
const { core, MemoryStorage } = require("./helpers.cjs");
const oldCore = require("./v02-helpers.cjs").core;
const plain = (x) => JSON.parse(JSON.stringify(x)),
  wrap = (s, v = 4) => JSON.stringify({ schemaVersion: v, state: s });
const schedule = () => Promise.resolve();
function ready(c) {
  const s = c.le(202603);
  s.discovered = c.Y.map((x) => x.id);
  s.finalResearchDone = true;
  c.enterChapter(s);
  c.chapterAction(s, "seed");
  return s;
}
for (const id of ["light-effects", "nursery-effects", "recycling-effects"]) {
  test(
    "V03-T03 deterministic identical A/A three repetitions: " + id,
    async () => {
      const c = core(),
        s = ready(c),
        snap = c.researchSnapshot(s),
        before = JSON.stringify(s);
      let reference;
      for (let i = 0; i < 3; i++) {
        const r = await c.runComparison(snap, id, {
          prepared: true,
          conditionB: "A",
          duration: 120,
          schedule,
        });
        for (const p of r.series) assert.deepEqual(plain(p.a), plain(p.b));
        if (reference) assert.equal(JSON.stringify(r), reference);
        reference = JSON.stringify(r);
      }
      assert.equal(JSON.stringify(s), before);
      assert.equal(JSON.stringify(snap.state), before);
    },
  );
  test(
    "V03-T04 measured A/B and actual same-engine series: " + id,
    async () => {
      const c = core(),
        s = ready(c),
        before = JSON.stringify(s),
        snap = c.researchSnapshot(s);
      const r = await c.runComparison(snap, id, {
        prepared: true,
        duration: 120,
        schedule,
      });
      const prep = c.prepareResearch(snap, id, { prepared: true }),
        a = structuredClone(prep.common),
        b = structuredClone(prep.common);
      const ca = c.applyResearchCondition(a, id, "A", prep.habitat),
        cb = c.applyResearchCondition(b, id, "B", prep.habitat);
      if (id === "nursery-effects")
        assert.equal(JSON.stringify(a), JSON.stringify(b));
      if (id === "light-effects") {
        assert.notEqual(a.chapter.light, b.chapter.light);
        b.chapter.light = a.chapter.light;
        assert.equal(JSON.stringify(a), JSON.stringify(b));
        b.chapter.light = "shade";
      }
      if (id === "recycling-effects") {
        assert.equal(b.pops.decomposer.ocean, 0);
        const n = b.pops.decomposer.ocean;
        b.pops.decomposer.ocean = a.pops.decomposer.ocean;
        assert.equal(JSON.stringify(a), JSON.stringify(b));
        b.pops.decomposer.ocean = n;
      }
      const ta = c.researchTotals(),
        tb = c.researchTotals();
      for (let i = 1; i <= 120; i++) {
        c.stepResearch(a, ta, ca);
        c.stepResearch(b, tb, cb);
        if (i % 5 === 0) {
          assert.deepEqual(
            plain(c.researchMetrics(a, ta)),
            plain(r.series[i / 5].a),
          );
          assert.deepEqual(
            plain(c.researchMetrics(b, tb)),
            plain(r.series[i / 5].b),
          );
        }
      }
      const key =
        id === "light-effects"
          ? "oxygen"
          : id === "nursery-effects"
            ? "predation.grazer.tide"
            : "recycling.ocean";
      assert.notEqual(r.summary[key].a.end, r.summary[key].b.end);
      if (id === "recycling-effects") {
        assert(r.summary[key].a.end > 0);
        assert.equal(r.summary[key].b.end, 0);
      }
      assert.equal(JSON.stringify(s), before);
      assert.equal(r.series.length, 25);
      assert.match(r.explanation, /A [\d,.-]+/);
      assert(!/undefined|NaN/.test(r.explanation));
      fs.writeFileSync("qa/ab-" + id + ".json", JSON.stringify(r, null, 2));
    },
  );
}
test("V03-T05 durations, finite zero populations, chart coordinates and bounded work", async () => {
  const c = core(),
    s = ready(c);
  for (const sp of c.I) for (const h of c.C) s.pops[sp][h] = 0;
  for (const duration of [30, 60, 120, 180]) {
    let yields = 0;
    const r = await c.runComparison(
      c.researchSnapshot(s),
      "recycling-effects",
      {
        duration,
        schedule: () => {
          yields++;
          return Promise.resolve();
        },
      },
    );
    assert.equal(yields, duration / 10);
    assert.equal(r.series.length, duration / 5 + 1);
    assert(r.series.length <= 200);
    for (const p of r.series)
      for (const arm of ["a", "b"])
        for (const n of Object.values(p[arm]))
          assert(Number.isFinite(n) && n >= 0);
    const html = c.researchChart(r, "oxygen");
    assert.match(html, /두 조건에 같은 축/);
    assert(!/NaN|Infinity/.test(html));
    const maximum = Math.max(
      1,
      ...r.series.flatMap((p) => [p.a.oxygen, p.b.oxygen]),
    );
    for (const p of r.series) {
      const point =
        (48 + (p.tick / duration) * 264).toFixed(3) +
        "," +
        (170 - (p.a.oxygen / maximum) * 132).toFixed(3);
      assert(html.includes(point));
    }
  }
  await assert.rejects(
    c.runComparison(c.researchSnapshot(s), "recycling-effects", {
      duration: 999,
    }),
    /기간/,
  );
  await assert.rejects(
    c.runComparison(c.researchSnapshot(s), "recycling-effects", {
      cancelled: () => true,
    }),
    /취소/,
  );
});
test("V03-T02 common study sample uses discovered species only; source isolation", async () => {
  const c = core(),
    s = c.le();
  s.discovered.push("decomposer");
  s.env.hab.ocean.organic = 20;
  const before = JSON.stringify(s),
    p = c.prepareResearch(c.researchSnapshot(s), "recycling-effects", {
      prepared: true,
    });
  assert.equal(p.common.pops.decomposer.ocean, 8);
  assert.equal(p.common.pops.grazer.ocean, 0);
  assert.deepEqual(plain(p.common.discovered), plain(s.discovered));
  assert.equal(JSON.stringify(s), before);
  assert.equal(c.researchAvailability(s, "light-effects").ok, false);
  const st = new MemoryStorage();
  c.Pt(st);
  c.Je(st, s);
  const storage = JSON.stringify([...st.data]);
  await c.runComparison(c.researchSnapshot(s), "recycling-effects", {
    prepared: true,
    duration: 30,
    schedule,
  });
  assert.equal(JSON.stringify([...st.data]), storage);
});
test("V03-T08 notes capped, finite, replay no reward, survives reload and rebirth", async () => {
  const c = core(),
    s = ready(c),
    r = await c.runComparison(c.researchSnapshot(s), "nursery-effects", {
      prepared: true,
      duration: 30,
      schedule,
    });
  const origin = s.originData,
    discoveries = JSON.stringify(s.discovered),
    energy = s.energy;
  for (let i = 0; i < 20; i++) s.researchNotes.push(c.makeResearchNote(r));
  assert.equal(c.normalizeResearchNotes(s.researchNotes).length, 20);
  assert.equal(s.originData, origin);
  assert.equal(s.energy, energy);
  assert.equal(JSON.stringify(s.discovered), discoveries);
  assert.throws(() =>
    c.normalizeResearchNotes([...s.researchNotes, c.makeResearchNote(r)]),
  );
  const invalid = structuredClone(s.researchNotes);
  invalid[0].summary.oxygen.a.end = Infinity;
  assert.throws(() => c.normalizeResearchNotes(invalid));
  const st = new MemoryStorage();
  c.Pt(st);
  assert(c.Je(st, s));
  const loaded = core().Pt(st);
  assert.equal(loaded.state.researchNotes.length, 20);
  c.Ut(s, true);
  assert.equal(s.researchNotes.length, 20);
  const once = s.originData;
  c.Ut(s, true);
  assert.equal(s.originData, once);
  s.researchNotes.splice(0, 1);
  assert.equal(c.Re(wrap(s)).state.researchNotes.length, 19);
});
test("V03-T10 actual v3 canonical -> v4 preserves all prior fields and remains read-only", () => {
  const old = oldCore(),
    v3 = ready(old),
    st = new MemoryStorage();
  v3.originData = 37;
  v3.rebirths = 4;
  v3.milestones = ["chapter_one"];
  v3.perms = { click: 2 };
  old.Pt(st);
  assert(old.Je(st, v3));
  const original = st.getItem("originLab.save.v3"),
    before = new Map(st.data);
  const c = core(),
    r = c.Pt(st);
  assert.equal(r.status, "ok");
  for (const [key, value] of Object.entries(v3).filter(
    ([key]) => key !== "schemaVersion",
  ))
    assert.deepEqual(plain(r.state[key]), plain(value), key);
  assert.equal(r.state.researchNotes.length, 0);
  assert.equal(JSON.parse(st.getItem("originLab.save.v4")).schemaVersion, 4);
  for (const [key, value] of before) assert.equal(st.getItem(key), value);
  assert([...st.data.values()].includes(original));
  const head = st.getItem("originLab.save.v4");
  v3.originData = 0;
  v3.totalTicks = 999999;
  assert(old.Je(st, v3));
  assert.equal(st.getItem("originLab.save.v4"), head);
  assert.equal(core().Pt(st).state.originData, 37);
});
test("V03-T10 ambiguous/corrupt v3 blocks migration without older fallback", () => {
  for (const corrupt of [false, true]) {
    const old = oldCore(),
      s = ready(old),
      st = new MemoryStorage();
    old.Pt(st);
    old.Je(st, s);
    st.setItem("originLab.save.v2", wrap(old.le(), 2));
    if (corrupt) st.setItem("originLab.save.v3", "{bad");
    else {
      const branch = JSON.parse(st.getItem("originLab.save.v3"));
      branch.commitId = "divergent";
      branch.state.energy = 999;
      st.setItem("originLab.save.v3.commit.divergent", JSON.stringify(branch));
    }
    const before = st.getItem("originLab.save.v3"),
      c = core();
    assert.equal(c.Pt(st).status, "rejected");
    assert.equal(st.getItem("originLab.save.v4"), null);
    assert.equal(st.getItem("originLab.save.v3"), before);
    assert.equal(c.Je(st, c.le()), false);
    const manager = c.storageManager(st);
    assert(manager.list().length);
    assert(manager.replace(c.Re(wrap(s, 3)).state));
    assert.equal(core().Pt(st).status, "ok");
  }
});
test("V03-T07 automation unlock, zero producers, toggle, no click events", () => {
  const c = core(),
    s = c.le();
  assert.equal(c.automationRate(s), 0);
  s.discovered.push("chemosynth_microbe");
  s.energy = 100;
  assert(c.Ze(s, "chemosynth_microbe", "ocean").ok);
  const clicks = s.runClicks;
  c.Kt(s);
  assert(s.automation.unlocked);
  assert(c.automationRate(s) > 0);
  assert.equal(s.runClicks, clicks);
  s.automation.enabled = false;
  assert.equal(c.automationRate(s), 0);
  s.automation.enabled = true;
  s.pops.chemosynth_microbe.ocean = 0;
  assert.equal(c.automationRate(s), 0);
});
test("V03-T10 damaged v4 required fields are rejected; v3 upgrade remains explicit", () => {
  const c = core();
  for (const key of ["researchNotes", "automation"]) {
    const s = c.le();
    delete s[key];
    assert.equal(c.Re(wrap(s)).status, "rejected");
    assert.equal(c.Re(wrap(s, 3)).status, "ok");
  }
});
test("V03-T10 missing newer head never falls back to an older legacy save", () => {
  for (const key of [
    "originLab.save.v3.commit.branch",
    "originLab.save.v3.backup.original",
    "originLab.save.v4.backup.original",
  ]) {
    const c = core(),
      st = new MemoryStorage(),
      state = ready(c);
    state.originData = 99;
    st.setItem(key, wrap(state, key.includes(".v3.") ? 3 : 4));
    st.setItem("originLab.save.v2", wrap(c.le(), 2));
    assert.equal(c.Pt(st).status, "rejected");
    assert.equal(st.getItem("originLab.save.v4"), null);
    assert.equal(c.Je(st, c.le()), false);
    assert(
      c
        .storageManager(st)
        .list()
        .some((x) => x.state?.originData === 99),
    );
  }
});

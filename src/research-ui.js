/* UI adapter. Comparison copies never become app.state. */
function researchNumber(n) {
  return Number(n.toFixed(2)).toLocaleString("ko-KR");
}
function researchChart(result, key) {
  const def =
      RESEARCH_METRICS.find((d) => d.key === key) || RESEARCH_METRICS[0],
    series = result.series;
  const maximum = Math.max(
    1,
    ...series.flatMap((p) => [p.a[def.key], p.b[def.key]]),
  );
  const x = (t) => 48 + (t / result.duration) * 264,
    y = (n) => 170 - (n / maximum) * 132;
  const line = (arm) =>
    series
      .map(
        (p, i) =>
          `${i ? "L" : "M"}${x(p.tick).toFixed(3)},${y(p[arm][def.key]).toFixed(3)}`,
      )
      .join(" ");
  const tickLabels = [0, result.duration / 2, result.duration];
  return `<figure class="research-figure"><figcaption id="research-chart-title"><strong>${R(def.name)}</strong><span>${R(def.unit)} · 두 조건에 같은 축 적용</span></figcaption><div class="research-legend"><span class="arm-a">A · ${R(RESEARCH_PRESETS[result.id][result.conditionA.toLowerCase()])} (실선)</span><span class="arm-b">B · ${R(RESEARCH_PRESETS[result.id][result.conditionB.toLowerCase()])} (점선)</span></div><svg viewBox="0 0 340 214" role="img" aria-labelledby="research-chart-title" data-metric="${def.key}" data-ymax="${maximum}" data-duration="${result.duration}"><title>${R(def.name)}의 실제 시계열</title><path class="chart-axis" d="M48,38 V170 H312"/>${[0, 0.5, 1].map((f) => `<path class="chart-grid" d="M48,${y(maximum * f)} H312"/><text x="43" y="${y(maximum * f) + 5}" text-anchor="end">${researchNumber(maximum * f)}</text>`).join("")}${tickLabels.map((t) => `<text x="${x(t)}" y="192" text-anchor="middle">${t}</text>`).join("")}<path class="chart-a" data-arm="a" d="${line("a")}"/><path class="chart-b" data-arm="b" d="${line("b")}"/></svg><p class="note">가로축: 시뮬레이션 시간(초) · 시뮬레이션 5초마다 기록. 아래 표는 측정값을 소수 둘째 자리까지 표시합니다.</p>${researchSummaryTable(result.summary, def.key)}</figure>`;
}
function researchSummaryTable(summary, key) {
  const m = summary[key];
  return `<table class="research-table"><caption>${R(RESEARCH_METRICS.find((d) => d.key === key)?.name || key)} 측정값</caption><thead><tr><th scope="col">조건</th><th scope="col">시작</th><th scope="col">끝</th><th scope="col">증감</th></tr></thead><tbody>${["a", "b"].map((arm) => `<tr><th scope="row">${arm.toUpperCase()}</th><td>${researchNumber(m[arm].start)}</td><td>${researchNumber(m[arm].end)}</td><td>${m[arm].change > 0 ? "+" : ""}${researchNumber(m[arm].change)}</td></tr>`).join("")}</tbody></table>`;
}
function comparisonDefaults() {
  return {
    sessionOpen: false,
    snapshot: null,
    preset: "recycling-effects",
    habitat: "ocean",
    prepared: false,
    duration: 120,
    metric: "oxygen",
    running: false,
    progress: 0,
    generation: 0,
    result: null,
    error: "",
    recorded: false,
  };
}
const originalRenderAll = Ge.prototype.renderAll;
Ge.prototype.renderAll = function () {
  originalRenderAll.call(this);
  this.comparison ??= comparisonDefaults();
  this.renderAutomation();
  this.renderResearch();
  this.renderResearchNotes();
  this.applyAssets?.();
};
Ge.prototype.renderAutomation = function () {
  const s = this.state,
    auto = s.automation,
    host = document.getElementById("automation-card");
  if (!host) return;
  w(
    host,
    `<h3>초기 배양 보조기 <span class="status-pill ${auto.unlocked ? "done" : ""}">${auto.unlocked ? "무료 해금" : "첫 생산 생물 필요"}</span></h3><p class="small">살아 있는 생산 생물에서 에너지를 자동으로 거둡니다. 반복해서 탐침을 누르지 않고 조합과 배치에 집중하세요.</p><p class="small">자동 수확 <strong>+${researchNumber(automationRate(s))}/초</strong> · 생태계 자체 생산 +${researchNumber(s.energyPerSec)}/초</p><button type="button" class="btn wide" data-research="automation" data-fk="research-automation" aria-pressed="${auto.enabled}" ${auto.unlocked ? "" : "disabled"}>${auto.enabled ? "자동 수확 켜짐 · 끄기" : "자동 수확 꺼짐 · 켜기"}</button><p class="note">화학합성 또는 광합성 미생물을 처음 배치하면 열립니다. 생산 생물이 6 이상이면 최대 +8/초이며 사라지면 수확도 멈춥니다. 수동 탐침은 언제든 쓸 수 있습니다.</p>`,
  );
};
Ge.prototype.renderResearch = function () {
  const c = (this.comparison ??= comparisonDefaults()),
    s = this.state,
    host = document.getElementById("research-card");
  if (!host) return;
  const source = c.snapshot?.state || s,
    availability = researchAvailability(source, c.preset, c.habitat),
    preset = RESEARCH_PRESETS[c.preset];
  const metricOptions = RESEARCH_METRICS.map(
    (d) =>
      `<option value="${d.key}" ${d.key === c.metric ? "selected" : ""}>${R(d.name)} · ${R(d.unit)}</option>`,
  ).join("");
  const result = c.result;
  w(
    host,
    `<div class="chapter-heading"><span class="eyebrow">살아 있는 실험실</span><span class="status-pill ${c.sessionOpen ? "done" : ""}">${c.sessionOpen ? "본 세계 일시 정지" : "비교 실험"}</span></div><h3>같은 시작, 다른 조건</h3><p class="small">현재 생태계의 복사본 두 개로 한 조건만 바꿔 봅니다. 본 세계의 시간·생물·재화·보상은 실험으로 변하지 않습니다.</p><label class="research-label" for="research-preset">비교할 질문</label><select id="research-preset" data-fk="research-preset" ${c.running ? "disabled" : ""}>${Object.entries(
      RESEARCH_PRESETS,
    )
      .map(
        ([id, p]) =>
          `<option value="${id}" ${id === c.preset ? "selected" : ""}>${p.name}</option>`,
      )
      .join(
        "",
      )}</select><p class="small"><strong>${preset.plain}</strong></p><details class="research-help"><summary>게임 속 역할과 과학 설명</summary><p class="small">A: ${preset.a} / B: ${preset.b}. 같은 초기 상태와 난수로 생태계 엔진을 실행해 실제 차이를 측정합니다.</p><p class="small">${preset.detail}</p></details>${
      c.preset === "recycling-effects"
        ? `<label class="research-label" for="research-habitat">살펴볼 서식지</label><select id="research-habitat" data-fk="research-habitat" ${c.running ? "disabled" : ""}>${C.filter(
            (h) => V(source, h),
          )
            .map(
              (h) =>
                `<option value="${h}" ${c.habitat === h ? "selected" : ""}>${D[h]}</option>`,
            )
            .join("")}</select>`
        : '<p class="small muted">관찰 서식지: 조간대</p>'
    }<label class="research-label" for="research-duration">시뮬레이션 기간</label><select id="research-duration" data-fk="research-duration" ${c.running ? "disabled" : ""}>${RESEARCH_DURATIONS.map((n) => `<option value="${n}" ${c.duration === n ? "selected" : ""}>${n}초 (${n} tick)</option>`).join("")}</select><label class="research-check"><input id="research-prepared" data-fk="research-prepared" type="checkbox" ${c.prepared ? "checked" : ""} ${c.running ? "disabled" : ""}><span>연구용 표본 준비 · 두 군에 같은 개체 수·영양분·유기물·산소 공급 (무료, 복사본에만 적용)</span></label><p class="note">생물이 적거나 먹이가 부족해 차이를 측정하기 어렵다면 표본 준비를 선택하세요. 발견하지 않은 생물은 넣지 않습니다. 분해자 실험의 B군은 공통 준비를 끝낸 다음 분해자만 제거합니다.</p>${!availability.ok ? `<p class="cause" role="status">${R(availability.reason)}</p>` : ""}<div class="research-actions"><button class="btn" data-research="snapshot" data-fk="research-snapshot" ${c.running || !availability.ok ? "disabled" : ""}>현재 세계 스냅샷</button><button class="btn primary" data-research="run" data-fk="research-run" ${c.running || !availability.ok ? "disabled" : ""}>${c.result ? "같은 시작에서 재실험" : "A/B 비교 실행"}</button>${c.sessionOpen ? '<button class="btn" data-research="close" data-fk="research-close">본 세계로 돌아가기</button>' : ""}<button class="btn" data-research="clear" data-fk="research-clear">실험 초기화</button></div><p id="research-progress" class="small" role="status">${c.running ? `계산 중 · ${c.progress}/${c.duration} tick` : c.snapshot ? `스냅샷: seed ${c.snapshot.seed}, 원래 세계 ${c.snapshot.sourceTick}초 · ${c.prepared ? "인위적 표본 준비" : "자연 상태 그대로"}` : "실행하면 먼저 현재 세계를 깊게 복사합니다. 실제 시간만큼 기다릴 필요는 없습니다."}</p>${c.error ? `<p class="cause" role="alert">${R(c.error)}</p>` : ""}${
      result
        ? `<div class="research-result"><h4>측정 결과 · ${result.duration}초</h4><p class="small">A: ${preset[result.conditionA.toLowerCase()]} / B: ${preset[result.conditionB.toLowerCase()]} · ${result.prepared ? "연구용 표본" : "자연 상태"} · 저장 시계열 ${result.series.length}점</p><label class="research-label" for="research-metric">그래프 지표</label><select id="research-metric" data-fk="research-metric">${metricOptions}</select>${researchChart(result, c.metric)}<p class="cause">${R(result.explanation)}</p><details class="research-populations"><summary>두 생태계의 마지막 개체 수 비교</summary><table class="research-table"><thead><tr><th scope="col">생물 · 서식지</th><th scope="col">A</th><th scope="col">B</th></tr></thead><tbody>${RESEARCH_METRICS.filter(
            (d) => d.key.startsWith("population."),
          )
            .map(
              (d) =>
                `<tr><th scope="row">${d.name}</th><td>${researchNumber(result.summary[d.key].a.end)}</td><td>${researchNumber(result.summary[d.key].b.end)}</td></tr>`,
            )
            .join(
              "",
            )}</tbody></table></details><div class="research-actions"><button class="btn primary" data-research="record" data-fk="research-record" ${c.recorded || s.researchNotes.length >= 20 ? "disabled" : ""}>${c.recorded ? "연구 노트에 기록함" : "연구 노트에 기록"}</button><button class="btn" data-research="export" data-fk="research-export">실측 시계열 JSON</button></div><p class="note">노트는 최대 20건입니다. 도감이나 재화 보상은 없으며, 기록 탭에서 다시 보거나 삭제할 수 있습니다.</p></div>`
        : ""
    }`,
  );
};
Ge.prototype.renderResearchNotes = function () {
  const host = document.getElementById("research-notes");
  if (!host) return;
  const notes = this.state.researchNotes;
  w(
    host,
    `<h3>연구 노트 <span class="muted small">${notes.length}/20</span></h3><p class="small muted">실제로 실행한 비교 실험의 요약입니다. 성과를 반복 기록해도 재화나 발견을 얻지 않습니다.</p>${
      notes.length
        ? notes
            .slice()
            .reverse()
            .map(
              (note) =>
                `<details class="research-note"><summary>${R(RESEARCH_PRESETS[note.experimentId].name)} · ${note.duration}초 · ${note.prepared ? "연구용 표본" : "자연 상태"}</summary><p class="small">A: ${R(RESEARCH_PRESETS[note.experimentId][note.conditionA.toLowerCase()])} / B: ${R(RESEARCH_PRESETS[note.experimentId][note.conditionB.toLowerCase()])}</p><p class="note">${R(note.createdAt)} · v${R(note.gameVersion)} · seed ${note.seed} / RNG ${note.rng} / 원래 세계 ${note.sourceTick}초 · ${D[note.habitat]}</p><p class="small">${R(note.explanation)}</p><p class="note">공통 표본 준비: ${note.prepared ? R(note.interventions.join(", ")) : "없음"}</p>${["oxygen", "energyPerSec", "nutrients." + note.habitat, "recycling." + note.habitat].map((key) => researchSummaryTable(note.summary, key)).join("")}<button class="btn danger wide" data-note-delete="${R(note.id)}" data-fk="note-${R(note.id)}">이 연구 노트 삭제</button></details>`,
            )
            .join("")
        : '<p class="empty">아직 노트가 없습니다. 진화 탭에서 비교 실험을 마친 뒤 기록해 보세요.</p>'
    }`,
  );
};
Ge.prototype.closeComparison = function () {
  const c = this.comparison;
  if (!c) return;
  c.generation++;
  c.running = false;
  c.sessionOpen = false;
  this.renderResearch();
};
Ge.prototype.startComparison = async function () {
  const c = (this.comparison ??= comparisonDefaults());
  if (c.running) return;
  c.snapshot ??= researchSnapshot(this.state);
  c.sessionOpen = true;
  c.running = true;
  c.progress = 0;
  c.error = "";
  c.result = null;
  c.recorded = false;
  const generation = ++c.generation;
  this.renderResearch();
  try {
    const result = await runComparison(c.snapshot, c.preset, {
      duration: c.duration,
      prepared: c.prepared,
      habitat: c.habitat,
      cancelled: () => generation !== c.generation,
      schedule: () => new Promise((resolve) => requestAnimationFrame(resolve)),
      onProgress: (n) => {
        c.progress = n;
        const progress = document.getElementById("research-progress");
        if (progress)
          progress.textContent = `계산 중 · ${n}/${c.duration} tick`;
      },
    });
    if (c.generation === generation) c.result = result;
  } catch (error) {
    if (c.generation === generation) c.error = error.message;
  } finally {
    if (c.generation === generation) {
      c.running = false;
      this.renderResearch();
    }
  }
};
const researchWire = Ge.prototype.wire;
Ge.prototype.wire = function () {
  researchWire.call(this);
  document.addEventListener("change", (ev) => {
    if (!ev.target.id.startsWith("research-")) return;
    const c = (this.comparison ??= comparisonDefaults());
    const fields = {
      "research-preset": "preset",
      "research-duration": "duration",
      "research-prepared": "prepared",
      "research-habitat": "habitat",
      "research-metric": "metric",
    };
    const field = fields[ev.target.id];
    if (!field) return;
    if (field === "metric") {
      c.metric = ev.target.value;
      this.renderResearch();
      return;
    }
    c.generation++;
    c.running = false;
    c.result = null;
    c.recorded = false;
    c.error = "";
    c[field] =
      field === "prepared"
        ? ev.target.checked
        : field === "duration"
          ? Number(ev.target.value)
          : ev.target.value;
    this.renderResearch();
  });
  document.addEventListener("click", (ev) => {
    const action = ev.target.closest("[data-research]")?.dataset.research;
    if (action) {
      const c = (this.comparison ??= comparisonDefaults());
      if (action === "automation") {
        this.state.automation.enabled = !this.state.automation.enabled;
        this.save();
        this.renderAll();
      }
      if (action === "snapshot") {
        c.generation++;
        c.snapshot = researchSnapshot(this.state);
        c.sessionOpen = true;
        c.result = null;
        c.recorded = false;
        c.error = "";
        this.renderResearch();
      }
      if (action === "run") this.startComparison();
      if (action === "close") this.closeComparison();
      if (action === "clear") {
        this.closeComparison();
        this.comparison = { ...comparisonDefaults(), generation: c.generation };
        this.renderResearch();
      }
      if (action === "record" && c.result && !c.recorded) {
        if (this.state.researchNotes.length >= 20) {
          this.toast(
            "노트가 20건입니다. 기록 탭에서 필요 없는 노트를 삭제하세요.",
          );
          return;
        }
        this.state.researchNotes.push(makeResearchNote(c.result));
        c.recorded = true;
        if (this.save())
          this.toast(
            "연구 노트를 저장했습니다. 기록 탭에서 다시 볼 수 있습니다.",
          );
        this.renderAll();
      }
      if (action === "export" && c.result)
        downloadRaw(
          JSON.stringify(c.result, null, 2),
          "origin-lab-comparison.json",
        );
    }
    const noteId = ev.target.closest("[data-note-delete]")?.dataset.noteDelete;
    if (noteId)
      this.confirm(
        "연구 노트를 삭제할까요?",
        "<p>선택한 실험 요약만 삭제합니다. 본 세계의 진행과 재화는 바뀌지 않습니다.</p>",
        "삭제",
        () => {
          this.state.researchNotes = this.state.researchNotes.filter(
            (n) => n.id !== noteId,
          );
          this.save();
          this.renderResearchNotes();
        },
      );
  });
};
const researchReplaceState = Ge.prototype.replaceState;
Ge.prototype.replaceState = function (...args) {
  this.closeComparison();
  return researchReplaceState.apply(this, args);
};

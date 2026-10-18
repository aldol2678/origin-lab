/* Pure comparison orchestration: no DOM, storage or main-state references. */
const RESEARCH_VERSION = "0.3";
const RESEARCH_DURATIONS = [30, 60, 120, 180];
const RESEARCH_MAX_POINTS = 200;
const RESEARCH_PRESETS = {
  "light-effects": {
    name: "빛과 생산",
    variable: "조간대의 빛",
    a: "밝음",
    b: "그늘",
    plain: "빛이 달라지면 생물의 생산도 달라질까요?",
    detail:
      "조간대의 광합성 공급 계수만 밝음 1, 그늘 0.3으로 바꿉니다. 개체 수와 영양분도 함께 변하므로 마지막 산소량만으로 모든 원인을 단정할 수 없습니다.",
  },
  "nursery-effects": {
    name: "은신처의 생존 효과",
    variable: "조류 은신처의 효력",
    a: "은신처 작동",
    b: "은신처 해제",
    plain: "같은 먹이망에 숨을 곳이 생기면 누가 살아남을까요?",
    detail:
      "조간대 조류가 5 이상일 때 초식 원생생물에 대한 포식 요구량을 40% 줄이는 모형입니다. 실제 서식 공간의 효과는 종과 환경마다 다릅니다.",
  },
  "recycling-effects": {
    name: "분해자의 자원 순환",
    variable: "선택한 서식지의 분해자 개체군",
    a: "분해자 포함",
    b: "분해자 제거",
    plain: "죽은 생물의 유기물은 다시 영양분이 될 수 있을까요?",
    detail:
      "선택한 서식지의 분해 미생물만 제거합니다. 다른 종과 환경, 난수는 같은 상태에서 출발합니다. 무생물적 분해도 별도로 남아 있어 분해자가 없어도 변화가 0은 아닙니다.",
  },
};
function normalizeAutomation(raw, state) {
  if (
    raw !== undefined &&
    (!raw ||
      typeof raw !== "object" ||
      typeof raw.enabled !== "boolean" ||
      typeof raw.unlocked !== "boolean")
  )
    throw Error("자동화 상태 오류");
  const introduced = ["chemosynth_microbe", "photo_microbe"].some(
    (id) =>
      state.claimed?.includes("place:" + id) ||
      Object.values(state.pops?.[id] || {}).some((n) => n > 0),
  );
  return {
    unlocked: raw?.unlocked === true || introduced,
    enabled: raw?.enabled !== false,
  };
}
function automationRate(s) {
  if (!s.automation?.unlocked || !s.automation.enabled) return 0;
  const producers = ["chemosynth_microbe", "photo_microbe"].reduce(
    (n, id) => n + ie(s, id),
    0,
  );
  return 8 * Math.min(1, producers / 6);
}
function automationTick(s) {
  if (
    !s.automation.unlocked &&
    ["chemosynth_microbe", "photo_microbe"].some((id) => ie(s, id) > 0)
  ) {
    s.automation.unlocked = true;
    O(
      s,
      "첫 생산 생물을 배치해 무료 배양 보조기가 열렸습니다. 살아 있는 생산 생물에서 최대 에너지 8/초를 자동 수확합니다. 진화 탭에서 끌 수 있습니다.",
    );
  }
  s.energy += automationRate(s);
}
function researchAvailability(s, id, habitat = "ocean") {
  if (!Object.hasOwn(RESEARCH_PRESETS, id))
    return E("알 수 없는 비교 실험입니다.");
  if (id !== "recycling-effects") {
    if (!V(s, "tide"))
      return E(
        "두 번째 장에서 조간대를 발견하면 이 실험이 열립니다. 분해자 실험은 첫 장에서도 할 수 있어요.",
      );
    const required =
      id === "light-effects"
        ? ["macroalgae", "photo_microbe"]
        : ["nursery", "macroalgae", "grazer", "cnidarian"];
    const missing = required.filter((x) => !b(s, x));
    if (missing.length)
      return E(missing.map(T).join(", ") + " 발견이 필요합니다.");
  } else {
    if (!V(s, habitat)) return E("선택한 서식지를 먼저 발견하세요.");
    if (!b(s, "decomposer"))
      return E(
        "분해 미생물을 먼저 발견하세요. 화학합성 미생물과 퇴적물을 조합해 보세요.",
      );
  }
  return { ok: true };
}
function researchSnapshot(state) {
  return {
    state: structuredClone(state),
    seed: state.seed,
    rng: state.rng,
    sourceTick: state.totalTicks,
  };
}
function prepareResearch(
  snapshot,
  id,
  { prepared = false, habitat = "ocean" } = {},
) {
  const common = structuredClone(snapshot.state),
    h = id === "recycling-effects" ? habitat : "tide";
  const available = researchAvailability(common, id, h);
  if (!available.ok) throw Error(available.reason);
  const interventions = [];
  if (prepared) {
    for (const [sp, n] of Object.entries({
      chemosynth_microbe: 12,
      photo_microbe: 28,
      grazer: 12,
      predator: 4,
      decomposer: 8,
      coastal_colony: 5,
      macroalgae: 12,
      sponge: 8,
      cnidarian: 5,
    })) {
      if (b(common, sp) && g[sp].habitats.includes(h)) {
        common.pops[sp][h] = n;
        interventions.push(T(sp) + " " + n);
      }
    }
    common.env.oxygen = 45;
    common.env.hab[h].nutrients = 65;
    common.env.hab[h].organic = 40;
    interventions.push("산소 45", "영양분 65", "유기물 40");
  }
  return { common, habitat: h, prepared, interventions };
}
function researchMetricDefinitions() {
  const defs = [
    { key: "oxygen", name: "전체 산소", unit: "모형 상대량" },
    { key: "energyPerSec", name: "생태계 에너지 생산", unit: "에너지/초" },
    { key: "energyProduced", name: "누적 생태계 생산", unit: "에너지" },
  ];
  for (const h of C) {
    for (const [key, label, unit] of [
      ["nutrients", "영양분", "모형 상대량"],
      ["organic", "유기물", "모형 상대량"],
      ["predation", "누적 포식 손실", "모형 개체 수"],
      ["recycling", "누적 분해 환원", "모형 상대량"],
    ])
      defs.push({ key: key + "." + h, name: D[h] + " · " + label, unit });
    for (const sp of I)
      if (g[sp].habitats.includes(h))
        defs.push({
          key: "population." + sp + "." + h,
          name: D[h] + " · " + T(sp),
          unit: "모형 개체 수",
        });
    for (const sp of I)
      if (g[sp].habitats.includes(h))
        defs.push({
          key: "predation." + sp + "." + h,
          name: D[h] + " · " + T(sp) + " 누적 포식 손실",
          unit: "모형 개체 수",
        });
  }
  return defs;
}
const RESEARCH_METRICS = researchMetricDefinitions();
function researchTotals() {
  return {
    predation: Object.fromEntries(C.map((h) => [h, 0])),
    recycling: Object.fromEntries(C.map((h) => [h, 0])),
    speciesPredation: Object.fromEntries(
      I.flatMap((sp) => C.map((h) => [sp + "." + h, 0])),
    ),
    energyProduced: 0,
  };
}
function researchMetrics(s, totals = researchTotals()) {
  const result = {
    oxygen: s.env.oxygen,
    energyPerSec: s.energyPerSec,
    energyProduced: totals.energyProduced,
  };
  for (const h of C) {
    result["nutrients." + h] = s.env.hab[h].nutrients;
    result["organic." + h] = s.env.hab[h].organic;
    result["predation." + h] = totals.predation[h];
    result["recycling." + h] = totals.recycling[h];
    for (const sp of I)
      if (g[sp].habitats.includes(h)) {
        result["population." + sp + "." + h] = s.pops[sp][h];
        result["predation." + sp + "." + h] =
          totals.speciesPredation[sp + "." + h];
      }
  }
  for (const [key, n] of Object.entries(result))
    if (!Number.isFinite(n) || n < 0) throw Error("실험 지표 오류: " + key);
  return result;
}
function stepResearch(s, totals, controls) {
  Kt(s, { ...controls, research: true });
  for (const h of C) {
    for (const sp of I)
      totals.speciesPredation[sp + "." + h] += s.loss[P(sp, h)]?.predation || 0;
    totals.predation[h] += I.reduce(
      (n, sp) => n + (s.loss[P(sp, h)]?.predation || 0),
      0,
    );
    totals.recycling[h] +=
      (s.loss[P("decomposer", h)]?.consumed || 0) * S.decompToNutrient * gt(s);
  }
  totals.energyProduced += s.energyPerSec;
}
function applyResearchCondition(state, id, condition, habitat) {
  const controls = {};
  if (id === "light-effects")
    state.chapter.light = condition === "A" ? "bright" : "shade";
  if (id === "nursery-effects") controls.nursery = condition === "A";
  if (id === "recycling-effects" && condition === "B")
    state.pops.decomposer[habitat] = 0;
  return controls;
}
function summarizeResearch(result) {
  const summary = {};
  const first = result.series[0],
    last = result.series.at(-1);
  for (const def of RESEARCH_METRICS) {
    summary[def.key] = {};
    for (const arm of ["a", "b"])
      summary[def.key][arm] = {
        start: first[arm][def.key],
        end: last[arm][def.key],
        change: last[arm][def.key] - first[arm][def.key],
      };
  }
  return summary;
}
function explainResearch(result) {
  const s = result.summary,
    h = result.habitat,
    f = (n) => Number(n.toFixed(2)).toLocaleString("ko-KR");
  const id = result.id;
  let sentence =
    id === "light-effects"
      ? `산소 변화는 A ${f(s.oxygen.a.change)}, B ${f(s.oxygen.b.change)}입니다. 마지막 생태계 생산은 A ${f(s.energyPerSec.a.end)}, B ${f(s.energyPerSec.b.end)} 에너지/초입니다.`
      : id === "nursery-effects"
        ? `초식 원생생물은 A ${f(s["population.grazer.tide"].a.start)} → ${f(s["population.grazer.tide"].a.end)}, B ${f(s["population.grazer.tide"].b.start)} → ${f(s["population.grazer.tide"].b.end)}입니다. 초식 원생생물 누적 포식 손실은 A ${f(s["predation.grazer.tide"].a.end)}, B ${f(s["predation.grazer.tide"].b.end)}입니다.`
        : `분해자가 되돌린 영양분은 A ${f(s["recycling." + h].a.end)}, B ${f(s["recycling." + h].b.end)}입니다. 마지막 영양분은 A ${f(s["nutrients." + h].a.end)}, B ${f(s["nutrients." + h].b.end)}입니다.`;
  return `시뮬레이션 ${result.duration}초 동안 ${sentence} 바꾼 변인은 ‘${RESEARCH_PRESETS[id].variable}’ 하나입니다. 짧은 모형 실험이며 실제 생태계의 장기 인과를 확정하지 않습니다.`;
}
async function runComparison(snapshot, id, options = {}) {
  const duration = options.duration ?? 120;
  if (!RESEARCH_DURATIONS.includes(duration))
    throw Error("지원하지 않는 실험 기간입니다.");
  const prep = prepareResearch(snapshot, id, options),
    a = structuredClone(prep.common),
    bb = structuredClone(prep.common);
  const conditionA = options.conditionA ?? "A",
    conditionB = options.conditionB ?? "B";
  if (!["A", "B"].includes(conditionA) || !["A", "B"].includes(conditionB))
    throw Error("실험 조건 오류");
  const ca = applyResearchCondition(a, id, conditionA, prep.habitat),
    cb = applyResearchCondition(bb, id, conditionB, prep.habitat);
  const ta = researchTotals(),
    tb = researchTotals();
  const series = [];
  const capture = (tick) => {
    if (series.length >= RESEARCH_MAX_POINTS) throw Error("시계열 상한");
    series.push({
      tick,
      a: researchMetrics(a, ta),
      b: researchMetrics(bb, tb),
    });
  };
  capture(0);
  const schedule =
    options.schedule ??
    (() => new Promise((resolve) => setTimeout(resolve, 0)));
  for (let tick = 1; tick <= duration; tick++) {
    if (options.cancelled?.()) throw Error("실험을 취소했습니다.");
    stepResearch(a, ta, ca);
    stepResearch(bb, tb, cb);
    if (tick % 5 === 0 || tick === duration) capture(tick);
    if (tick % 10 === 0) {
      options.onProgress?.(tick, duration);
      await schedule();
    }
  }
  if (options.cancelled?.()) throw Error("실험을 취소했습니다.");
  const result = {
    id,
    habitat: prep.habitat,
    prepared: prep.prepared,
    interventions: prep.interventions,
    duration,
    seed: snapshot.seed,
    rng: snapshot.rng,
    sourceTick: snapshot.sourceTick,
    conditionA,
    conditionB,
    series,
    gameVersion: RESEARCH_VERSION,
  };
  result.summary = summarizeResearch(result);
  result.explanation = explainResearch(result);
  return result;
}
function normalizeResearchNotes(raw) {
  if (raw === undefined) return [];
  if (!Array.isArray(raw) || raw.length > 20)
    throw Error("연구 노트는 최대 20건입니다.");
  const ids = new Set();
  return raw.map((note) => {
    if (
      !note ||
      typeof note !== "object" ||
      !Object.hasOwn(RESEARCH_PRESETS, note.experimentId) ||
      typeof note.id !== "string" ||
      !note.id.length ||
      note.id.length > 80 ||
      ids.has(note.id)
    )
      throw Error("연구 노트 식별자 오류");
    ids.add(note.id);
    if (
      !RESEARCH_DURATIONS.includes(note.duration) ||
      !C.includes(note.habitat) ||
      typeof note.prepared !== "boolean" ||
      !["A", "B"].includes(note.conditionA) ||
      !["A", "B"].includes(note.conditionB)
    )
      throw Error("연구 노트 조건 오류");
    for (const key of ["seed", "rng", "sourceTick"])
      if (!Number.isFinite(note[key])) throw Error("연구 노트 시드 오류");
    if (
      typeof note.createdAt !== "string" ||
      note.createdAt.length > 40 ||
      !Number.isFinite(Date.parse(note.createdAt))
    )
      throw Error("연구 노트 시각 오류");
    if (
      note.gameVersion !== RESEARCH_VERSION ||
      typeof note.explanation !== "string" ||
      note.explanation.length > 1800
    )
      throw Error("연구 노트 설명 오류");
    if (
      !Array.isArray(note.interventions) ||
      note.interventions.length > 16 ||
      note.interventions.some((x) => typeof x !== "string" || x.length > 120)
    )
      throw Error("표본 기록 오류");
    const summary = {};
    if (
      !note.summary ||
      Object.keys(note.summary).length !== RESEARCH_METRICS.length
    )
      throw Error("연구 노트 지표 오류");
    for (const def of RESEARCH_METRICS) {
      summary[def.key] = {};
      for (const arm of ["a", "b"]) {
        const m = note.summary[def.key]?.[arm];
        if (
          !m ||
          !["start", "end", "change"].every(
            (k) => Number.isFinite(m[k]) && Math.abs(m[k]) < 1e12,
          ) ||
          m.start < 0 ||
          m.end < 0 ||
          Math.abs(m.end - m.start - m.change) > 1e-6
        )
          throw Error("연구 노트 수치 오류");
        summary[def.key][arm] = {
          start: m.start,
          end: m.end,
          change: m.change,
        };
      }
    }
    return {
      id: note.id,
      experimentId: note.experimentId,
      habitat: note.habitat,
      prepared: note.prepared,
      interventions: [...note.interventions],
      duration: note.duration,
      seed: note.seed,
      rng: note.rng,
      sourceTick: note.sourceTick,
      conditionA: note.conditionA,
      conditionB: note.conditionB,
      createdAt: note.createdAt,
      gameVersion: note.gameVersion,
      summary,
      explanation: note.explanation,
    };
  });
}
function makeResearchNote(result, createdAt = new Date().toISOString()) {
  if (!result?.summary) throw Error("먼저 비교 실험을 마치세요.");
  const note = {
    id: crypto.randomUUID(),
    experimentId: result.id,
    habitat: result.habitat,
    prepared: result.prepared,
    interventions: result.interventions,
    duration: result.duration,
    seed: result.seed,
    rng: result.rng,
    sourceTick: result.sourceTick,
    conditionA: result.conditionA,
    conditionB: result.conditionB,
    createdAt,
    gameVersion: RESEARCH_VERSION,
    summary: result.summary,
    explanation: result.explanation,
  };
  return normalizeResearchNotes([note])[0];
}

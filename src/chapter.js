/* Chapter 2: explicit data and small integration hooks into the recovered engine. */
const chapterItems = [
  [
    "tidal_habitat",
    "조간대",
    "environment",
    "밀물 때 잠기고 썰물 때 드러나는 바닷가예요.",
    "세 번째 서식지가 열려요. 물 교환과 빛을 조절할 수 있어요.",
    "조간대에서는 조석에 따라 침수 시간, 온도와 염분 등이 달라집니다. 이 모형은 물 교환과 빛의 효과만 다룹니다.",
  ],
  [
    "cell_adhesion",
    "세포 부착",
    "concept",
    "세포가 서로 붙어서 모여 있을 수 있는 성질이에요.",
    "세포의 역할 분화로 이어지는 조합 재료예요.",
    "세포 접착에는 세포 표면 단백질과 세포 밖 물질 등이 관여합니다. 붙어 있는 군체가 모두 복잡한 다세포 생물인 것은 아닙니다.",
  ],
  [
    "division_of_labor",
    "세포의 역할 분화",
    "concept",
    "한 몸 안의 세포가 서로 다른 일을 맡는 거예요.",
    "다세포 조류와 해면형 여과자를 탐색하는 재료예요.",
    "다세포성은 여러 생물 계통에서 독립적으로 진화했습니다. 세포 간 협력과 분화의 정도도 계통마다 다릅니다.",
  ],
  [
    "macroalgae",
    "다세포 조류",
    "species",
    "여러 세포가 몸을 이루며 빛으로 양분을 만드는 생물이에요.",
    "조간대의 영양분을 쓰고 산소를 공급해요. 그늘에서는 생산이 줄어요.",
    "많은 다세포 조류는 광합성으로 유기물을 만듭니다. 큰 조류의 몸은 다른 생물의 서식 공간이 될 수 있습니다. 조류는 하나의 단일한 진화 계통을 뜻하지 않습니다.",
  ],
  [
    "filter_flow",
    "여과 섭식",
    "concept",
    "물속의 작은 먹이를 걸러 먹는 방법이에요.",
    "해면형 여과자를 발견하는 조합 재료예요.",
    "여과 섭식자는 물의 흐름과 포획 구조를 이용합니다. 여과 대상과 입자 크기는 종에 따라 다릅니다.",
  ],
  [
    "sponge",
    "해면형 여과자",
    "species",
    "몸속으로 물을 흘려 작은 먹이를 걸러 먹는 동물 모형이에요.",
    "기존 광합성 미생물을 먹어요. 먹이가 줄면 번식도 줄어요.",
    "실제 해면동물은 편모가 있는 세포로 물의 흐름을 만들고 세균 등 작은 입자를 포획합니다. 일부 종은 광합성 공생 미생물을 품습니다.",
  ],
  [
    "nerve_net",
    "신경망",
    "concept",
    "신호를 주고받는 신경세포가 그물처럼 이어진 구조예요.",
    "자포동물형 포식자를 탐색하는 재료예요.",
    "자포동물의 신경계는 감각과 운동을 조절합니다. 분산된 신경망과 더 집중된 구조가 함께 나타나기도 합니다. 이것을 모든 동물 신경계의 직접 조상으로 단정할 수는 없습니다.",
  ],
  [
    "cnidarian",
    "자포동물형 포식자",
    "species",
    "촉수로 작은 먹이를 잡는 동물 모형이에요.",
    "기존 초식 원생생물을 먹어요. 먹이가 많을 때 성장하고 산소가 부족하면 줄어요.",
    "자포동물은 자포세포로 먹이를 포획하거나 방어합니다. 실제 먹이는 종과 크기에 따라 달라집니다. 여기서는 작은 원생생물을 먹는 하나의 기능형으로 표현했습니다.",
  ],
  [
    "nursery",
    "조류의 은신처",
    "concept",
    "조류 사이의 작은 틈이 먹잇감의 숨을 곳이 돼요.",
    "조간대 조류가 5 이상이면 초식 원생생물의 포식 손실이 40% 줄어요.",
    "서식 공간의 복잡성은 포식자의 접근과 먹이의 피난 가능성을 바꿉니다. 조류가 언제나 모든 먹이 생물을 보호하는 것은 아닙니다.",
  ],
  [
    "resilient_web",
    "연결된 얕은 바다",
    "concept",
    "생산과 섭식, 분해가 함께 이어진 생태계예요.",
    "두 관찰을 조합하면 두 번째 장을 마쳐요. 조건을 바꾸며 계속 실험할 수 있어요.",
    "먹이망은 물질과 에너지의 이동을 연결합니다. 에너지는 흐르며 일부가 열로 빠져나가고, 영양 물질은 여러 경로로 순환합니다. 짧은 공존은 장기 안정성을 보장하지 않습니다.",
  ],
  [
    "light_comparison",
    "빛과 생산의 차이",
    "observation",
    "빛을 바꾸자 같은 생태계의 생산량이 달라졌어요.",
    "밝음과 그늘에서 각각 측정해 발견해요. 기원 데이터 2를 한 번 받아요.",
    "광합성은 빛뿐 아니라 영양분, 온도 등 여러 요인의 영향을 받습니다. 같은 개체군의 조건을 비교해야 빛의 효과를 더 잘 구분할 수 있습니다.",
  ],
  [
    "living_web",
    "이어지는 먹이망",
    "observation",
    "오래전 발견한 미생물과 새 동물이 서로 영향을 줬어요.",
    "실제 여과·포식·분해가 일어난 조간대를 기록해요. 기원 데이터 2를 한 번 받아요.",
    "생산자가 만든 유기물은 섭식과 사망을 거쳐 이동합니다. 분해자는 유기물에서 영양분을 되돌려 놓습니다. 이 모형은 각 기능을 소수의 개체군으로 대표합니다.",
  ],
].map(([id, name, kind, plainSummary, inGameEffect, scienceDetail]) => ({
  id,
  name,
  kind,
  plainSummary,
  inGameEffect,
  scienceDetail,
  scienceCaveat:
    "조합은 진화의 실제 순서나 직접 조상 관계를 뜻하지 않는 탐색 모형입니다. 수치와 시간, 종 사이의 관계를 교육용으로 단순화했습니다.",
}));
Y.push(...chapterItems);
for (const item of chapterItems) B[item.id] = item;
const chapterRecipes = [
  ["coastal_habitat", "water", "tidal_habitat"],
  ["membrane", "coastal_colony", "cell_adhesion"],
  ["cell_adhesion", "metabolic_cycle", "division_of_labor"],
  ["division_of_labor", "photosynthesis", "macroalgae"],
  ["tidal_habitat", "membrane", "filter_flow"],
  ["division_of_labor", "filter_flow", "sponge"],
  ["sensory_response", "division_of_labor", "nerve_net"],
  ["nerve_net", "grazer", "cnidarian"],
  ["macroalgae", "symbiosis", "nursery"],
  ["light_comparison", "living_web", "resilient_web"],
].map(([a, b, out], i) => ({ no: 25 + i, a, b, out }));
Se.push(...chapterRecipes);
for (const recipe of chapterRecipes) Jt.set(Ke(recipe.a, recipe.b), recipe);
C.push("tide");
D.tide = "조간대";
S.nutrientRegen.tide = 0.35;
S.initNutrients.tide = 45;
S.initOrganic.tide = 15;
for (const id of ["photo_microbe", "grazer", "decomposer"]) {
  g[id].habitats.push("tide");
  g[id].K.tide = id === "photo_microbe" ? 90 : 50;
}
const newSpecies = {
  macroalgae: {
    trophic: "producer",
    photosynthetic: true,
    r: 0.12,
    d: 0.018,
    starve: 0.04,
    demand: 0.012,
    o2Min: -100,
    o2: 0.025,
    yield: 0.05,
    color: "#4f9d7a",
  },
  sponge: {
    trophic: "grazer",
    photosynthetic: false,
    r: 0.1,
    d: 0.018,
    starve: 0.05,
    demand: 0.045,
    o2Min: 8,
    o2: -0.004,
    yield: 0.06,
    color: "#d5ad62",
  },
  cnidarian: {
    trophic: "predator",
    photosynthetic: false,
    r: 0.09,
    d: 0.02,
    starve: 0.055,
    demand: 0.05,
    o2Min: 12,
    o2: -0.005,
    yield: 0.08,
    color: "#c77d86",
  },
};
for (const [id, def] of Object.entries(newSpecies)) {
  I.push(id);
  g[id] = {
    id,
    name: T(id),
    habitats: ["tide"],
    cost: 40,
    seedPop: 6,
    K: { tide: 65 },
    ...def,
  };
}
B.macroalgae.species = {
  diet: "빛과 영양분으로 유기물을 만듭니다.",
  energySource: "광합성",
  impact: "산소 공급, 영양분 소비, 은신처 제공",
};
B.sponge.species = {
  diet: "광합성 미생물",
  energySource: "여과 섭식",
  impact: "미생물 수 감소, 사망 후 유기물 공급",
};
B.cnidarian.species = {
  diet: "초식 원생생물",
  energySource: "포식",
  impact: "먹이 개체 수 감소, 산소 소비",
};
ce.sponge = "photo_microbe";
ce.cnidarian = "grazer";
function chapterDefaults() {
  return {
    unlocked: false,
    entered: false,
    kitClaimed: false,
    light: "bright",
    flow: "gentle",
    settled: 0,
    samples: {},
    flux: { filter: 0, predation: 0, recycle: 0, oxygen: 0 },
    completed: false,
  };
}
function normalizeChapter(raw, legacy) {
  const c = chapterDefaults(),
    r = raw || {};
  c.unlocked =
    r.unlocked === true ||
    legacy.finalResearchDone === true ||
    legacy.rebirths > 0;
  c.entered = c.unlocked && r.entered === true;
  c.kitClaimed = r.kitClaimed === true;
  c.completed = r.completed === true;
  c.light = r.light === "shade" ? "shade" : "bright";
  c.flow = r.flow === "flush" ? "flush" : "gentle";
  c.settled = k(r.settled, 0, 0, 1e6);
  for (const mode of ["bright", "shade"])
    if (r.samples?.[mode]) {
      let sample = r.samples[mode];
      c.samples[mode] = {
        oxygen: k(sample.oxygen, 0, 0, 100),
        filter: k(sample.filter, 0, 0, 100),
        tick: k(sample.tick, 0, 0),
      };
    }
  for (const key of Object.keys(c.flux))
    c.flux[key] = k(r.flux?.[key], 0, 0, 100);
  return c;
}
function enterChapter(s) {
  if (!s.chapter.unlocked && !s.finalResearchDone && !s.rebirths)
    return E("첫 번째 장의 최종 실험을 먼저 마치세요.");
  s.chapter.unlocked = true;
  s.chapter.entered = true;
  if (!s.chapter.kitClaimed) {
    s.energy += 240;
    s.chapter.kitClaimed = true;
    O(
      s,
      "두 번째 장을 열었습니다. 탐험 준비 에너지 +240. 연안 환경과 물을 조합해 조간대를 찾아보세요.",
    );
  }
  return { ok: true };
}
function rewardChapter(s, id) {
  if (s.milestones.includes(id)) return;
  s.milestones.push(id);
  s.originData += 2;
  O(
    s,
    "새 실험 성취: 기원 데이터 +2. 이 보상은 한 번만 받습니다.",
    "discovery",
  );
}
function chapterAction(s, action) {
  if (!s.chapter.entered) return E("두 번째 장에 먼저 들어가세요.");
  if (
    action === "bright" ||
    action === "shade" ||
    action === "gentle" ||
    action === "flush"
  ) {
    const key = ["bright", "shade"].includes(action) ? "light" : "flow";
    if (s.chapter[key] !== action) {
      s.chapter[key] = action;
      s.chapter.settled = 0;
    }
    return { ok: true };
  }
  if (action === "seed") {
    if (!b(s, "tidal_habitat")) return E("조간대를 먼저 발견하세요.");
    for (const [id, pop] of Object.entries({
      photo_microbe: 28,
      grazer: 12,
      decomposer: 8,
      macroalgae: 12,
      sponge: 8,
      cnidarian: 5,
    }))
      if (b(s, id)) s.pops[id].tide = Math.max(s.pops[id].tide, pop);
    s.env.hab.tide.nutrients = Math.max(s.env.hab.tide.nutrients, 35);
    s.env.hab.tide.organic = Math.max(s.env.hab.tide.organic, 15);
    // Aeration is an explicit experimental intervention, not a reward or passive buff.
    s.env.oxygen = Math.max(s.env.oxygen, 32);
    s.chapter.settled = 0;
    O(
      s,
      "조간대에 발견한 생물을 보충하고 산소를 공급했습니다. 다른 서식지의 개체 수는 유지됩니다.",
    );
    return { ok: true };
  }
  return E("알 수 없는 조작입니다.");
}
function chapterTick(s, result) {
  if (!s.chapter.entered || !b(s, "tidal_habitat")) return;
  s.chapter.settled++;
  const flux = s.chapter.flux;
  flux.filter = s.loss["sponge@tide"]?.consumed || 0;
  flux.predation = s.loss["cnidarian@tide"]?.consumed || 0;
  flux.recycle =
    (s.loss["decomposer@tide"]?.consumed || 0) * S.decompToNutrient * gt(s);
  flux.oxygen =
    (s.loss["macroalgae@tide"]?.fed || 0) *
    s.pops.macroalgae.tide *
    g.macroalgae.o2;
  if (s.chapter.flow === "flush") {
    s.env.hab.tide.nutrients = Z(s.env.hab.tide.nutrients + 1, 0, 100);
    s.env.hab.tide.organic *= 0.94;
  }
  if (b(s, "resilient_web")) s.chapter.completed = true;
}
function observeChapter(s) {
  if (!s.chapter.entered || s.chapter.settled < 5)
    return E("조건을 바꾼 뒤 5초 동안 생태계의 반응을 살펴보세요.");
  if (s.pops.macroalgae.tide < 1 || s.pops.sponge.tide < 1)
    return E("조간대에 다세포 조류와 해면형 여과자를 배치하세요.");
  const c = s.chapter,
    result = { observed: [] };
  // Paired assay uses the SAME measured algae biomass and nutrient supply.
  const biomass = s.pops.macroalgae.tide,
    food = s.env.hab.tide.nutrients;
  const totalDemand = I.filter((id) => g[id].trophic === "producer").reduce(
    (n, id) => n + s.pops[id].tide * g[id].demand,
    0,
  );
  const potential =
    biomass * g.macroalgae.o2 * Math.min(1, food / Math.max(0.01, totalDemand));
  if (potential < 0.01)
    return E(
      "영양분이 부족해 비교하기 어렵습니다. 영양분을 공급하거나 물 교환을 활발하게 바꾸세요.",
    );
  c.samples[c.light] = {
    oxygen: potential * (c.light === "bright" ? 1 : 0.3),
    filter: c.flux.filter,
    tick: s.totalTicks,
  };
  if (c.samples.bright && c.samples.shade) {
    kt(s, "light_comparison", result);
    rewardChapter(s, "tide_compare");
  }
  if (
    c.flux.filter > 0.01 &&
    c.flux.predation > 0.01 &&
    c.flux.recycle > 0.01 &&
    s.pops.macroalgae.tide > 1
  ) {
    kt(s, "living_web", result);
    rewardChapter(s, "food_web");
  }
  O(
    s,
    `${c.light === "bright" ? "밝음" : "그늘"} 조건 기록: 조류 산소 생산 추정 ${c.samples[c.light].oxygen.toFixed(2)}/초. 같은 시점의 조류량으로 계산하면 밝음 ${potential.toFixed(2)}, 그늘 ${(potential * 0.3).toFixed(2)}입니다.`,
    "eco",
  );
  return { ok: true, observed: result.observed };
}
// The same light response governs live production and the paired assay.

// Hooks in the engine itself handle food supply, predation and decomposition.

Ge.prototype.renderChapter = function () {
  const s = this.state,
    c = s.chapter,
    host = document.getElementById("chapter-card");
  if (!host) return;
  const unlocked = c.unlocked || s.finalResearchDone || s.rebirths > 0;
  if (!unlocked) {
    w(
      host,
      '<h3>다음 탐험 · 다세포와 얕은 바다</h3><p class="small muted">첫 번째 장의 최종 실험을 마치면 열립니다. 지금의 발견과 연구는 다음 장에서도 이어집니다.</p>',
    );
    return;
  }
  if (!c.entered) {
    w(
      host,
      `<span class="status-pill done">첫 번째 장 완료</span><h3>다세포와 얕은 바다</h3><p>함께 사는 세포에서 먹고 먹히는 얕은 바다까지. 기존 생명과 새 동물의 관계를 탐험하세요.</p><p class="small muted">재시작 없이 이어집니다. 첫 진입 때 탐험 에너지 240을 받습니다. 여기서 마쳐도 완료 기록은 남습니다.</p><button class="btn primary wide" data-chapter="enter" data-fk="ch-enter">두 번째 장 탐험하기</button>`,
    );
    return;
  }
  const found = chapterItems.filter((x) => b(s, x.id)).length;
  w(
    host,
    `<div class="chapter-heading"><span class="eyebrow">CHAPTER 02</span><span class="status-pill ${c.completed ? "done" : ""}">${found}/12 발견</span></div><h3>다세포와 얕은 바다</h3><p class="small">${c.completed ? "두 번째 장을 마쳤습니다. 물 교환과 은신처가 먹이망을 어떻게 바꾸는지 계속 살펴보세요." : "세포가 모이면 어떤 삶이 가능할까요? 조간대에서 빛과 먹이의 연결을 비교하세요."}</p><ol class="chapter-guide"><li>실험실에서 <strong>연안 환경 + 물</strong>을 조합하세요.</li><li><strong>세포막 + 연안 군체</strong>에서 세포의 협력을 탐색하세요.</li><li>발견한 생물을 보충하고 밝음·그늘에서 각각 기록하세요.</li></ol><p class="small muted">다세포 조류: 역할 분화 + 광합성 · 여과자: 역할 분화 + 여과 섭식 · 신경망: 감각 반응 + 역할 분화</p><button class="btn wide" data-chapter="seed" data-fk="ch-seed" ${b(s, "tidal_habitat") ? "" : "disabled"}>관찰용 생물 보충 · 산소 공급 (무료)</button><p class="note">발견한 생물만 조간대에 보충합니다. 재화 보상은 없습니다.</p><div class="chapter-controls"><span>빛</span>${["bright", "shade"].map((x) => `<button class="btn" data-chapter="${x}" data-fk="ch-${x}" aria-pressed="${c.light === x}">${x === "bright" ? "밝음" : "그늘"}</button>`).join("")}<span>물 교환</span>${["gentle", "flush"].map((x) => `<button class="btn" data-chapter="${x}" data-fk="ch-${x}" aria-pressed="${c.flow === x}">${x === "gentle" ? "잔잔함" : "활발함"}</button>`).join("")}</div><div class="flux-grid"><div><span>조류 산소</span><strong>${c.flux.oxygen.toFixed(2)}<small>/초</small></strong></div><div><span>여과 섭식</span><strong>${c.flux.filter.toFixed(2)}<small>/초</small></strong></div><div><span>새 동물 포식</span><strong>${c.flux.predation.toFixed(2)}<small>/초</small></strong></div><div><span>분해·영양분</span><strong>${c.flux.recycle.toFixed(2)}<small>/초</small></strong></div></div><p class="note">모형의 상대량입니다. 활발한 물 교환은 영양분을 공급하고 유기물을 씻어 냅니다. 빛은 조류와 광합성 미생물의 생산을 바꿉니다.</p><button class="btn primary wide" data-chapter="observe" data-fk="ch-observe" ${c.settled < 5 ? "disabled" : ""}>현재 조건 기록${c.settled < 5 ? ` · ${5 - Math.floor(c.settled)}초 뒤` : ""}</button><p class="small">밝음 ${c.samples.bright ? "기록함" : "미기록"} · 그늘 ${c.samples.shade ? "기록함" : "미기록"} · 먹이망 ${b(s, "living_web") ? "관찰 완료" : "여과·포식·분해가 모두 일어날 때 기록"}</p><p class="caveat">각 기록의 개체 수는 달라질 수 있습니다. 기록 탭의 로그에 같은 조류량으로 비교한 생산 추정치도 남깁니다. 실제 진화 순서를 재현한 모형은 아닙니다.</p>${c.completed ? '<button class="btn wide" data-chapter="finish" data-fk="ch-finish">여기서 마치기</button>' : ""}`,
  );
};
Ge.prototype.renderStorageStatus = function () {
  const host = document.getElementById("storage-status");
  if (!host) return;
  const manager = this.storage ? storageManager(this.storage) : null;
  const blocked = !manager || manager.blocked;
  host.dataset.error = String(blocked);
  w(
    host,
    `<span>${R(manager?.message || "브라우저 저장 불가 · JSON으로 진행을 보관하세요.")}</span><button class="btn" data-storage="recover" data-fk="store-recover">백업·복구</button><button class="btn" data-storage="export" data-fk="store-export">JSON 내보내기</button>`,
  );
  document.querySelector("main").inert = !!manager?.blocked;
  document.getElementById("probe").disabled = !!manager?.blocked;
};
Ge.prototype.showRecovery = function () {
  const manager = this.storage ? storageManager(this.storage) : null;
  if (!manager) {
    this.toast(
      "브라우저 저장을 사용할 수 없습니다. JSON 내보내기를 이용하세요.",
    );
    return;
  }
  const entries = manager.list();
  this.recoveryEntries = entries;
  this.confirm(
    "저장 백업·복구",
    `<p>서로 다른 저장은 자동으로 합치지 않습니다. 선택한 기록으로 교체하며 현재 기록도 백업합니다.</p><div class="recovery-list">${entries.map((x, i) => `<div class="row"><div class="row-main"><strong>${R(x.label)}</strong><span>${x.status === "ok" ? `도감 ${x.state.discovered.length} · 기원 ${x.state.originData} · 환생 ${x.state.rebirths} · 1장 ${x.state.finalResearchDone ? "완료" : "미완료"} · 2장 ${x.state.chapter.completed ? "완료" : x.state.chapter.entered ? "진행 중" : "미진입"}` : R(x.reason || "읽을 수 없음")}</span></div><button type="button" class="btn" data-restore="${i}" ${x.status === "ok" ? "" : "disabled"}>이 기록 선택</button><button type="button" class="btn" data-raw="${i}">원본 JSON</button></div>`).join("") || "<p>저장된 백업이 없습니다.</p>"}</div>`,
    "닫기",
    () => {},
  );
};
Ge.prototype.replaceState = function (state, label) {
  if (!this.storage) {
    this.toast("저장 공간을 사용할 수 없어 교체하지 않았습니다.");
    return false;
  }
  const m = storageManager(this.storage);
  // Includes in-memory progress since the last autosave.
  try {
    m.backup(Ye(this.state), "in-memory");
  } catch (e) {
    m.fail("현재 진행 백업 실패: " + e.message);
    this.renderStorageStatus();
    return false;
  }
  if (!m.replace(state, label)) {
    this.toast(m.message, 6000);
    this.renderStorageStatus();
    return false;
  }
  this.state = state;
  this.slots = [null, null];
  this.selectedSpecies = null;
  this.exp.endingDismissed = false;
  this.renderAll();
  this.draw(true);
  return true;
};
Ge.prototype.importSaveText = function (raw) {
  const decoded = Re(raw);
  if (decoded.status !== "ok") {
    this.toast(decoded.reason || "빈 파일입니다.", 5000);
    return;
  }
  const s = decoded.state;
  this.confirm(
    "이 저장을 불러올까요?",
    `<p>도감 ${s.discovered.length} · 기원 데이터 ${s.originData} · ${s.rebirths + 1}회차</p><p>현재 진행과 원본 저장을 백업한 뒤 교체합니다. 선택한 기록에 없는 진행은 이 화면에서 사라지지만 백업에서 복구할 수 있습니다.</p>`,
    "불러오기",
    () => {
      if (this.replaceState(s, "import")) this.toast("저장을 불러왔습니다.");
    },
  );
};
Ge.prototype.confirmReset = function () {
  this.confirm(
    "새 실험으로 초기화할까요?",
    "<p>현재 진행을 백업한 뒤 새 실험을 시작합니다. 구버전 저장과 백업은 지우지 않습니다.</p>",
    "초기화",
    () => {
      this.replaceState(le(this.state.seed), "reset");
    },
  );
};
const oldWire = Ge.prototype.wire;
Ge.prototype.wire = function () {
  oldWire.call(this);
  document.addEventListener("click", (ev) => {
    const cmd = ev.target.closest("[data-chapter]")?.dataset.chapter;
    if (cmd) {
      let result;
      if (cmd === "enter") result = enterChapter(this.state);
      else if (cmd === "observe") {
        result = observeChapter(this.state);
        for (const id of result.observed || []) this.onNewDiscovery(id);
      } else if (cmd === "finish") {
        this.save();
        this.toast(
          "두 번째 장의 완료 기록을 저장했습니다. 언제든 이어서 관찰할 수 있습니다.",
        );
        return;
      } else result = chapterAction(this.state, cmd);
      this.act(result);
      this.save();
      this.renderAll();
      this.draw(true);
    }
    const action = ev.target.closest("[data-storage]")?.dataset.storage;
    if (action === "recover") this.showRecovery();
    if (action === "export") this.exportSave();
    const restore = ev.target.closest("[data-restore]");
    if (restore) {
      const x = this.recoveryEntries[Number(restore.dataset.restore)];
      document.getElementById("confirm").close();
      setTimeout(() => this.importSaveText(x.raw), 0);
    }
    const raw = ev.target.closest("[data-raw]");
    if (raw) {
      const x = this.recoveryEntries[Number(raw.dataset.raw)];
      downloadRaw(x.raw, "origin-lab-backup.json");
    }
  });
  window.addEventListener("storage", (ev) => {
    if (ev.key === OriginStorage.KEY && this.storage) {
      const m = storageManager(this.storage);
      if (ev.newValue !== m.base) {
        this.save();
        this.renderAll();
      }
    }
  });
};
function downloadRaw(raw, name) {
  const a = document.createElement("a"),
    url = URL.createObjectURL(new Blob([raw], { type: "application/json" }));
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

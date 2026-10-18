// Two explicit known-recipe policies, using the same chapter completion condition.
const fs = require("node:fs"),
  assert = require("node:assert/strict");
function play(core, automatic) {
  const c = core(),
    s = c.le(202603),
    trace = [];
  let failedActions = 0,
    extinctions = 0,
    peakIdle = 0,
    idle = 0,
    placements = 0;
  const discover = () => {
    let changed;
    do {
      changed = false;
      for (const r of c.Se.slice(0, 24))
        if (
          s.discovered.includes(r.a) &&
          s.discovered.includes(r.b) &&
          !s.discovered.includes(r.out)
        ) {
          const result = c.yt(s, r.a, r.b);
          if (result.kind === "new") {
            trace.push({ tick: s.tick, action: "discover", id: r.out });
            changed = true;
            idle = 0;
          } else failedActions++;
        }
    } while (changed);
  };
  function tick() {
    const before = structuredClone(s.pops);
    c.Kt(s);
    idle++;
    peakIdle = Math.max(peakIdle, idle);
    for (const sp of c.I)
      for (const h of c.C)
        if (before[sp][h] > 0 && s.pops[sp][h] === 0) extinctions++;
  }
  function place(id, h) {
    let guard = 0;
    while (s.energy < c.g[id].cost) {
      if (automatic && s.automation.unlocked) {
        tick();
        discover();
      } else c._t(s);
      assert(++guard < 3000, "bounded affordability");
    }
    const r = c.Ze(s, id, h);
    if (!r.ok) failedActions++;
    else {
      placements++;
      trace.push({ tick: s.tick, action: "place", id, habitat: h });
      idle = 0;
    }
  }
  discover();
  for (const [id, h] of [
    ["photo_microbe", "ocean"],
    ["photo_microbe", "coast"],
    ["chemosynth_microbe", "ocean"],
    ["decomposer", "ocean"],
    ["coastal_colony", "coast"],
  ]) {
    place(id, h);
    if (automatic && !s.automation.unlocked) tick();
  }
  // Both policies introduce consumers only once the common observation window is met.
  while (s.tick < 160) {
    tick();
    if (automatic) discover();
  }
  discover();
  for (const id of ["grazer", "predator"]) place(id, "ocean");
  for (let n = 0; n < 1200 && !s.discovered.includes("trophic_balance"); n++) {
    tick();
    if (automatic) discover();
    if (n % 60 === 0)
      for (const id of ["photo_microbe", "grazer", "predator"])
        if (s.pops[id].ocean < 3) place(id, "ocean");
  }
  discover();
  assert.equal(s.discovered.length, 30);
  for (const cond of c.U) {
    const sim = c.Ft(s, cond);
    for (let n = 0; n < 60; n++) c.ze(sim);
    assert(c.jt(s, sim).ok);
  }
  assert(c.Bt(s).ok);
  return {
    policy: automatic
      ? "v0.3 free cultivation + immediate affordable introductions"
      : "v0.2 reference upfront probes + fixed 160-tick window",
    manualProbeActions: s.runClicks,
    ecosystemTicks: s.tick,
    finalExperimentSteps: 180,
    finalExperimentNominalSeconds: 18,
    totalDiscoveries: s.discovered.length,
    failedActions,
    populationExtinctionTransitions: extinctions,
    placements,
    longestTicksWithoutDiscoveryOrPlacement: peakIdle,
    completed: s.finalResearchDone,
    trace,
  };
}
const result = {
  method:
    "Automated known-recipe engine policy. Simulated time, not human play. Common fixed 160-tick baseline window retained for comparability; discovery search time excluded.",
  v02: play(require("./v02-helpers.cjs").core, false),
  v03: play(require("./helpers.cjs").core, true),
};
assert.equal(result.v02.manualProbeActions, 835);
assert(result.v03.manualProbeActions <= 100);
assert(result.v03.ecosystemTicks <= result.v02.ecosystemTicks + 30);
fs.writeFileSync("qa/balance-v03.json", JSON.stringify(result, null, 2));
console.log(
  JSON.stringify(
    Object.fromEntries(
      Object.entries(result).map(([key, value]) => [
        key,
        typeof value === "object"
          ? Object.fromEntries(
              Object.entries(value).filter(([k]) => k !== "trace"),
            )
          : value,
      ]),
    ),
    null,
    2,
  ),
);

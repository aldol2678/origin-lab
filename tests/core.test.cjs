const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs");
const { core, MemoryStorage } = require("./helpers.cjs");
const plain = (x) => JSON.parse(JSON.stringify(x));
const wrap = (state, v = 2) =>
  JSON.stringify({ schemaVersion: v, savedAt: 123, state });
function completed(c) {
  const s = c.le();
  s.discovered = c.Y.slice(0, 30).map((x) => x.id);
  s.finalResearchDone = true;
  return s;
}
function chapter(c) {
  const s = completed(c);
  c.enterChapter(s);
  for (const r of c.Se.slice(24, 33))
    assert.equal(c.yt(s, r.a, r.b).kind, "new");
  c.chapterAction(s, "seed");
  return s;
}
function ticks(c, s, n) {
  for (let i = 0; i < n; i++) c.Kt(s);
}
test("R01 original 24 recipes and 30 explanations unchanged", () => {
  const old = core(true),
    c = core();
  assert.deepEqual(plain(c.Se.slice(0, 24)), plain(old.Se));
  assert.deepEqual(plain(c.Y.slice(0, 30)), plain(old.Y));
  assert.deepEqual(plain(c.I.slice(0, 6)), plain(old.I));
});
for (const version of [1, 2])
  test(`S03/S04 schema ${version} migration preserves all meaningful fields and raw`, () => {
    const c = core(),
      old = core(true),
      s = completed(old),
      storage = new MemoryStorage();
    Object.assign(s, {
      energy: 1234.5,
      insight: 41,
      originData: 19,
      rebirths: 3,
      totalTicks: 345,
      claimed: ["disc:protocell", "obs:oxygen_accumulation", "place:grazer"],
      theories: ["growth"],
      perms: { click: 2, fertile: 1 },
      runUpgrades: { pump: 2 },
    });
    s.pops.photo_microbe.coast = 36.4;
    s.env.oxygen = 74;
    s.env.hab.coast.organic = 22;
    for (const cond of old.U)
      s.experiment.records[cond] = {
        cond,
        step: 60,
        lightSide: "left",
        lightHalf: 0.7,
        alignment: 0.5,
        nearFood: 0.3,
        meanFoodDist: 0.2,
      };
    const raw = wrap(s, version),
      key = version === 1 ? "originLab.save" : "originLab.save.v2";
    storage.setItem(key, raw);
    const migrated = c.Pt(storage);
    assert.equal(migrated.status, "ok");
    for (const field of [
      "discovered",
      "claimed",
      "insight",
      "energy",
      "originData",
      "perms",
      "theories",
      "rebirths",
      "finalResearchDone",
      "runUpgrades",
      "experiment",
    ])
      assert.deepEqual(plain(migrated.state[field]), plain(s[field]), field);
    for (const h of ["ocean", "coast"]) {
      assert.deepEqual(plain(migrated.state.env.hab[h]), plain(s.env.hab[h]));
      for (const id of old.I)
        assert.equal(migrated.state.pops[id][h], s.pops[id][h]);
    }
    assert.equal(storage.getItem(key), raw);
    assert([...storage.data.values()].includes(raw));
    assert(migrated.state.chapter.unlocked);
    const canonical = storage.getItem("originLab.save.v3");
    const fresh = core();
    assert.equal(fresh.Pt(storage).status, "ok");
    assert.equal(storage.getItem("originLab.save.v3"), canonical);
  });
test("S01/S02 legacy re-execution write protocol cannot change canonical completed state", () => {
  const c = core(),
    old = core(true),
    storage = new MemoryStorage(),
    s = completed(old);
  s.originData = 17;
  s.rebirths = 2;
  s.perms = { click: 2 };
  storage.setItem("originLab.save.v2", wrap(s));
  assert.equal(c.Pt(storage).status, "ok");
  const before = storage.getItem("originLab.save.v3");
  const stale = old.le();
  stale.totalTicks = 9999999;
  stale.rebirths = 9;
  storage.setItem("originLab.save", wrap(stale, 1));
  old.Je(storage, old.Pt(storage).state);
  assert.equal(storage.getItem("originLab.save.v3"), before);
  const after = core().Pt(storage).state;
  assert.equal(after.finalResearchDone, true);
  assert.equal(after.originData, 17);
  assert.equal(after.perms.click, 2);
});
test("S03 differing legacy saves require explicit selection, never score merge", () => {
  const c = core(),
    st = new MemoryStorage(),
    a = c.le(),
    b = completed(c);
  a.totalTicks = 9999999;
  st.setItem("originLab.save", wrap(a, 1));
  st.setItem("originLab.save.v2", wrap(b));
  assert.equal(c.Pt(st).status, "rejected");
  assert.equal(st.getItem("originLab.save.v3"), null);
  assert(c.storageManager(st).replace(b));
  assert.equal(core().Pt(st).state.finalResearchDone, true);
});
test("S03 corrupt and future canonical data blocks writes; explicit restore works", () => {
  for (const raw of [
    "{broken",
    JSON.stringify({ schemaVersion: 999, state: {} }),
  ]) {
    const c = core(),
      st = new MemoryStorage();
    st.setItem("originLab.save.v3", raw);
    assert.equal(c.Pt(st).status, "rejected");
    assert.equal(c.Je(st, c.le()), false);
    assert.equal(st.getItem("originLab.save.v3"), raw);
    assert(c.storageManager(st).replace(c.le()));
    assert([...st.data.values()].includes(raw));
  }
});
test("S04 migration quota/backup failure never writes canonical or legacy", () => {
  const c = core(),
    st = new MemoryStorage(),
    raw = wrap(c.le());
  st.setItem("originLab.save.v2", raw);
  st.fail = true;
  assert.equal(c.Pt(st).status, "rejected");
  assert.equal(st.getItem("originLab.save.v3"), null);
  assert.equal(st.getItem("originLab.save.v2"), raw);
});
test("S05 same version concurrent editors stop, preserve both and explicitly recover", () => {
  const a = core(),
    b = core(),
    st = new MemoryStorage(),
    s = completed(a);
  a.Pt(st);
  assert(a.Je(st, s));
  const sb = b.Pt(st).state;
  sb.energy = 8000;
  s.energy = 42;
  assert(a.Je(st, s));
  assert.equal(b.Je(st, sb), false);
  assert.equal(JSON.parse(st.getItem("originLab.save.v3")).state.energy, 42);
  assert(
    b
      .storageManager(st)
      .list()
      .some((x) => x.state?.energy === 8000),
  );
  assert(b.storageManager(st).replace(sb));
  assert.equal(core().Pt(st).state.energy, 8000);
});
test("S05 divergent journal (interrupted simultaneous commit) is surfaced on next load", () => {
  const c = core(),
    st = new MemoryStorage();
  c.Pt(st);
  c.Je(st, c.le());
  const raw = JSON.parse(st.getItem("originLab.save.v3"));
  raw.commitId = "another-branch";
  raw.state.originData = 800;
  st.setItem("originLab.save.v3.commit.another-branch", JSON.stringify(raw));
  const next = core();
  next.Pt(st);
  assert(next.storageManager(st).blocked);
  assert.equal(next.Je(st, next.le()), false);
});
test("S05 bounded routine journal retains reloadable ancestry", () => {
  const c = core(),
    st = new MemoryStorage(),
    s = c.le();
  c.Pt(st);
  for (let i = 0; i < 70; i++) {
    s.energy++;
    assert(c.Je(st, s));
  }
  assert(st.length <= 14);
  const next = core();
  assert.equal(next.Pt(st).state.energy, 70);
  assert.equal(next.storageManager(st).blocked, false);
});
test("R02 all original recipes reachable; first chapter completes with live ecosystem and experiment", () => {
  const c = core(),
    s = c.le(),
    trace = [];
  // Active player probes for introductions; no artificial energy or discovery grants.
  function discoverAvailable() {
    let changed;
    do {
      changed = false;
      for (const r of c.Se.slice(0, 24)) {
        if (
          s.discovered.includes(r.a) &&
          s.discovered.includes(r.b) &&
          !s.discovered.includes(r.out)
        ) {
          assert.equal(c.yt(s, r.a, r.b).kind, "new");
          trace.push({ t: s.tick, id: r.out });
          changed = true;
        }
      }
    } while (changed);
  }
  discoverAvailable();
  for (const [id, h] of [
    ["photo_microbe", "ocean"],
    ["photo_microbe", "coast"],
    ["chemosynth_microbe", "ocean"],
    ["decomposer", "ocean"],
    ["coastal_colony", "coast"],
  ]) {
    while (s.energy < c.g[id].cost) c._t(s);
    assert(c.Ze(s, id, h).ok);
  }
  ticks(c, s, 160);
  discoverAvailable();
  for (const id of ["grazer", "predator"]) {
    while (s.energy < c.g[id].cost) c._t(s);
    assert(c.Ze(s, id, "ocean").ok);
  }
  for (let n = 0; n < 1200 && !s.discovered.includes("trophic_balance"); n++) {
    ticks(c, s, 1);
    if (n % 60 === 0) {
      for (const id of ["photo_microbe", "grazer", "predator"])
        if (s.pops[id].ocean < 3) {
          while (s.energy < c.g[id].cost) c._t(s);
          c.Ze(s, id, "ocean");
        }
    }
  }
  discoverAvailable();
  assert(s.discovered.includes("trophic_balance"));
  assert.equal(s.discovered.length, 30);
  for (const condition of c.U) {
    const sim = c.Ft(s, condition);
    for (let i = 0; i < 60; i++) c.ze(sim);
    assert(c.jt(s, sim).ok);
  }
  assert(c.Bt(s).ok);
  assert(s.finalResearchDone);
  fs.writeFileSync(
    "qa/first-chapter-trace.json",
    JSON.stringify(
      {
        seconds: s.tick,
        probeClicks: s.runClicks,
        discovered: s.discovered,
        trace,
        experiment: s.experiment,
      },
      null,
      2,
    ),
  );
});
test("C01 chapter graph reachable with observations and no first chapter repeat", () => {
  const c = core(),
    s = chapter(c);
  assert.equal(s.discovered.length, 39);
  ticks(c, s, 5);
  assert(c.observeChapter(s).ok);
  c.chapterAction(s, "shade");
  ticks(c, s, 5);
  assert(c.observeChapter(s).ok);
  assert(s.discovered.includes("living_web"));
  assert(s.discovered.includes("light_comparison"));
  assert.equal(c.yt(s, "light_comparison", "living_web").kind, "new");
  assert.equal(s.discovered.length, 42);
  assert(s.chapter.completed);
  fs.writeFileSync(
    "qa/chapter-trace.json",
    JSON.stringify(
      {
        seconds: s.tick,
        discovered: s.discovered.slice(30),
        milestones: s.milestones,
        originData: s.originData,
        flux: s.chapter.flux,
        pops: s.pops,
        log: s.log,
      },
      null,
      2,
    ),
  );
});
test("C02 new animals consume OLD species; algae consumes nutrients and light changes oxygen", () => {
  const c = core(),
    s = chapter(c),
    without = structuredClone(s);
  without.pops.sponge.tide = 0;
  without.pops.cnidarian.tide = 0;
  c.Kt(s);
  c.Kt(without);
  assert(s.pops.photo_microbe.tide < without.pops.photo_microbe.tide);
  assert(s.pops.grazer.tide < without.pops.grazer.tide);
  assert(s.loss["photo_microbe@tide"].predation > 0);
  assert(s.loss["grazer@tide"].predation > 0);
  const bright = chapter(c),
    shade = structuredClone(bright);
  shade.chapter.light = "shade";
  c.Kt(bright);
  c.Kt(shade);
  assert(bright.env.oxygen > shade.env.oxygen);
  assert(bright.pops.macroalgae.tide > shade.pops.macroalgae.tide);
  const algae = chapter(c),
    noAlgae = structuredClone(algae);
  noAlgae.pops.macroalgae.tide = 0;
  c.Kt(algae);
  c.Kt(noAlgae);
  assert(algae.env.hab.tide.nutrients < noAlgae.env.hab.tide.nutrients);
});
test("C03 nursery changes actual predation; flushing affects nutrients and decomposition supply", () => {
  const c = core(),
    s = chapter(c),
    bare = structuredClone(s);
  bare.discovered = bare.discovered.filter((x) => x !== "nursery");
  c.Kt(s);
  c.Kt(bare);
  assert(s.loss["grazer@tide"].predation < bare.loss["grazer@tide"].predation);
  const calm = chapter(c),
    flush = structuredClone(calm);
  c.chapterAction(flush, "flush");
  ticks(c, calm, 6);
  ticks(c, flush, 6);
  assert(flush.env.hab.tide.nutrients > calm.env.hab.tide.nutrients);
  assert(flush.env.hab.tide.organic < calm.env.hab.tide.organic);
});
test("C04 observation preconditions, entry grant and milestone rewards cannot repeat on load or rebirth", () => {
  const c = core(),
    s = chapter(c);
  const energy = s.energy;
  c.enterChapter(s);
  assert.equal(s.energy, energy);
  assert.equal(c.observeChapter(s).ok, false);
  ticks(c, s, 5);
  c.observeChapter(s);
  c.chapterAction(s, "shade");
  ticks(c, s, 5);
  c.observeChapter(s);
  const reward = s.originData;
  for (let n = 0; n < 10; n++) c.observeChapter(s);
  assert.equal(s.originData, reward);
  const records = plain(s.experiment);
  assert(c.Ut(s, true).ok);
  assert.equal(s.originData, reward + 3);
  for (let i = 0; i < 20; i++) {
    assert(c.Ut(s, true).ok);
    assert.equal(c.nt(s), 0);
  }
  assert.equal(s.originData, reward + 3);
  assert(s.chapter.entered);
  assert(s.finalResearchDone);
  assert.deepEqual(plain(s.experiment), records);
  const loaded = c.Re(c.Ye(s)).state;
  c.chapterAction(loaded, "seed");
  ticks(c, loaded, 5);
  c.observeChapter(loaded);
  assert.equal(loaded.originData, reward + 3);
});
test("C05 migrated prior rebirth has no duplicate chapter-one reward, retains currency", () => {
  const c = core(),
    s = completed(c);
  s.rebirths = 8;
  s.originData = 99;
  const migrated = c.Re(wrap(s)).state;
  assert.equal(c.nt(migrated), 0);
  c.Ut(migrated, true);
  assert.equal(migrated.originData, 99);
});
test("C06 finite ecosystem after 30 minutes across choices", () => {
  const c = core(),
    s = chapter(c);
  for (let i = 0; i < 1800; i++) {
    if (i % 50 === 0) c.chapterAction(s, i % 100 ? "shade" : "bright");
    if (i % 60 === 0) c.chapterAction(s, i % 120 ? "flush" : "gentle");
    c.Kt(s);
  }
  for (const id of c.I)
    for (const h of c.C) {
      assert(Number.isFinite(s.pops[id][h]));
      assert(s.pops[id][h] >= 0);
    }
  assert(Number.isFinite(s.energy));
});
test("K01 Korean particles and complete explanations", () => {
  const c = core();
  assert.equal(c.$("물", "을/를"), "물을");
  assert.equal(c.$("조류", "이/가"), "조류가");
  assert.equal(c.$("물", "으로/로"), "물로");
  for (const x of c.Y) {
    for (const f of ["name", "plainSummary", "inGameEffect", "scienceDetail"])
      assert(x[f]?.length > 0, `${x.id}.${f}`);
    if (c.I.slice(6).includes(x.id)) assert(x.scienceCaveat);
  }
});
test("S06 malformed structured saves are rejected without silently defaulting progress", () => {
  const c = core();
  for (const mutate of [
    (s) => delete s.originData,
    (s) => s.discovered.push("unknown_future_id"),
    (s) => (s.pops.grazer.ocean = -1),
    (s) => (s.env.oxygen = "bad"),
    (s) => s.claimed.push("unexpected:reward"),
  ]) {
    const s = c.le();
    mutate(s);
    const st = new MemoryStorage(),
      raw = wrap(s);
    st.setItem("originLab.save.v2", raw);
    assert.equal(c.Pt(st).status, "rejected");
    assert.equal(st.getItem("originLab.save.v2"), raw);
    assert.equal(st.getItem("originLab.save.v3"), null);
  }
});
test("R03 first chapter production and ecology match baseline for 300 ticks", () => {
  const old = core(true),
    c = core(),
    a = completed(old);
  a.energy = 2000;
  a.pops.photo_microbe.ocean = 30;
  a.pops.grazer.ocean = 8;
  a.pops.predator.ocean = 3;
  a.pops.decomposer.ocean = 5;
  a.env.oxygen = 45;
  const b = c.Re(wrap(a)).state;
  for (let i = 0; i < 300; i++) {
    old.Kt(a);
    c.Kt(b);
  }
  assert.equal(b.energy, a.energy);
  assert.equal(b.env.oxygen, a.env.oxygen);
  for (const id of old.I)
    for (const h of old.C) assert.equal(b.pops[id][h], a.pops[id][h]);
  for (const h of old.C)
    assert.deepEqual(plain(b.env.hab[h]), plain(a.env.hab[h]));
});
test("S07 backup-only storage requests recovery and legacy backups remain read-only", () => {
  for (const key of [
    "originLab.save.backup.123",
    "originLab.save.v1-backup",
    "originLab.save.v3.backup.123",
  ]) {
    const c = core(),
      st = new MemoryStorage(),
      s = c.le(),
      raw = wrap(s);
    st.setItem(key, raw);
    assert.equal(c.Pt(st).status, "rejected");
    assert.equal(c.Je(st, c.le()), false);
    const manager = c.storageManager(st);
    assert(manager.list().some((x) => x.raw === raw));
    assert(manager.replace(s));
    assert.equal(st.getItem(key), raw);
    assert.equal(core().Pt(st).status, "ok");
  }
});
test("S08 actual experiment measurement snapshots preserve light switches through all migrations", () => {
  const old = core(true),
    c = core(),
    state = completed(old);
  state.finalResearchDone = false;
  for (const cond of old.U) {
    const sim = old.Ft(state, cond);
    for (let i = 0; i < 60; i++) old.ze(sim);
    sim.switches = cond === "light" ? 2 : 0;
    assert(old.jt(state, sim).ok);
  }
  state.finalResearchDone = true;
  for (const version of [1, 2, 3]) {
    const result = c.Re(wrap(state, version));
    assert.equal(result.status, "ok");
    assert.deepEqual(plain(result.state.experiment), plain(state.experiment));
    assert.equal(result.state.experiment.records.light.switches, 2);
  }
});

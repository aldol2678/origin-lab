const fs = require("node:fs"),
  { createHash } = require("node:crypto"),
  { core, MemoryStorage } = require("./helpers.cjs");
const sha = (raw) => createHash("sha256").update(raw).digest("hex");
const evidence = [];
for (const version of [1, 2]) {
  const old = core(true),
    c = core(),
    storage = new MemoryStorage(),
    state = old.le();
  state.discovered = old.Y.map((x) => x.id);
  state.claimed = [
    "disc:protocell",
    "obs:trophic_balance",
    "place:photo_microbe",
  ];
  state.finalResearchDone = true;
  state.originData = 21;
  state.rebirths = 4;
  state.insight = 40;
  state.energy = 765.5;
  state.perms = { click: 2 };
  state.theories = ["growth"];
  state.pops.photo_microbe.ocean = 45;
  state.env.oxygen = 57;
  for (const cond of old.U) {
    const sim = old.It(cond, 1729);
    for (let i = 0; i < 60; i++) old.ze(sim);
    old.jt({ ...state, finalResearchDone: false }, sim);
  } // separate records below share the same experiment object
  const raw = JSON.stringify({ schemaVersion: version, savedAt: 123, state });
  const key = version === 1 ? "originLab.save" : "originLab.save.v2";
  storage.setItem(key, raw);
  const loaded = c.Pt(storage);
  const canonical = storage.getItem("originLab.save.v3");
  const checks = {};
  for (const field of [
    "discovered",
    "claimed",
    "originData",
    "rebirths",
    "insight",
    "energy",
    "perms",
    "theories",
    "finalResearchDone",
    "experiment",
  ])
    checks[field] = {
      before: state[field],
      after: loaded.state[field],
      equal:
        JSON.stringify(state[field]) === JSON.stringify(loaded.state[field]),
    };
  const stale = old.le();
  stale.totalTicks = 99999999;
  stale.rebirths = 30;
  old.Je(storage, stale);
  const after = storage.getItem("originLab.save.v3");
  evidence.push({
    scenario: `synthetic v${version} migration then old-v2 writer`,
    rawSha256: sha(raw),
    legacySourceBackedUp: [...storage.data.values()].includes(raw),
    checks,
    canonicalBeforeSha256: sha(canonical),
    canonicalAfterOldWriterSha256: sha(after),
    canonicalUnchanged: canonical === after,
    keys: [...storage.data.keys()],
  });
}
fs.writeFileSync(
  "qa/migration-evidence.json",
  JSON.stringify(evidence, null, 2),
);
console.log("Migration evidence recorded");

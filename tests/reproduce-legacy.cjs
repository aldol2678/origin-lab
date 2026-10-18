const assert = require("node:assert/strict");
const { core, MemoryStorage } = require("./helpers.cjs");
const c = core(true),
  storage = new MemoryStorage();
const complete = c.le();
complete.finalResearchDone = true;
complete.totalTicks = 100;
complete.originData = 7;
const old = structuredClone(complete);
old.finalResearchDone = false;
old.totalTicks = 10000;
storage.setItem(
  "originLab.save",
  JSON.stringify({ schemaVersion: 1, state: old }),
);
storage.setItem(
  "originLab.save.v2",
  JSON.stringify({ schemaVersion: 2, state: complete }),
);
const loaded = c.Pt(storage);
c.Je(storage, loaded.state);
const after = JSON.parse(storage.getItem("originLab.save.v2")).state;
console.log(
  JSON.stringify(
    {
      test: "legacy regression before fix",
      expectedFinal: true,
      actualFinal: after.finalResearchDone,
      oldTicks: old.totalTicks,
      newTicks: complete.totalTicks,
      defectReproduced: !after.finalResearchDone,
    },
    null,
    2,
  ),
);
assert.equal(
  after.finalResearchDone,
  false,
  "Baseline must reproduce the defect",
);

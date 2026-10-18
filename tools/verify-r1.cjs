const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict"),
  crypto = require("node:crypto");
const { keys, bundleAssets } = require("./assets.cjs");
const blocked = [
  "water",
  "mineral",
  "atmosphere",
  "energy",
  "vapor",
  "cloud",
  "rain",
  "sediment",
  "heat",
  "hydrothermal",
].map((x) => "discovery." + x);
function verify(root = "assets") {
  const ledger = JSON.parse(
      fs.readFileSync(path.join(root, "r1-provenance.json")),
    ),
    manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"))),
    supported = keys(require("../data/catalog.json"));
  assert.equal(ledger.archiveSha256, require("./import-r1.cjs").ARCHIVE_SHA);
  assert.equal(
    ledger.sourceChecksumsSha256,
    require("./import-r1.cjs").CHECKSUMS_SHA,
  );
  assert.equal(ledger.records.length, 104);
  assert.equal(ledger.sourceFilesVerified, 1643);
  assert.equal(new Set(ledger.records.map((x) => x.key)).size, 104);
  assert(ledger.records.every((x) => x.sourceApproved === false));
  assert.deepEqual(
    ledger.records
      .filter((x) => x.runtimeSupported)
      .map((x) => x.key)
      .sort(),
    supported.slice().sort(),
  );
  assert.deepEqual(
    Object.keys(manifest.assets).sort(),
    supported.filter((x) => !blocked.includes(x)).sort(),
  );
  assert.equal(
    ledger.records.filter((x) => x.integration === "OUT_OF_SCOPE").length,
    46,
  );
  assert.equal(ledger.releaseApproved, false);
  const referenced = new Set();
  for (const [key, variants] of Object.entries(manifest.assets)) {
    const record = ledger.records.find((x) => x.key === key);
    assert.equal(record.rightsStatus, "GENERATED_VECTOR_NO_THIRD_PARTY_INPUT");
    assert.equal(record.integration, "ENABLED_FOR_DRAFT_REVIEW");
    assert(variants["light.default"] && variants["dark.default"]);
    if (key.startsWith("discovery."))
      assert.equal(variants["default.locked"].path, "r1/common/locked.svg");
    if (key.startsWith("species.")) assert(variants["default.selected"]);
    for (const entry of Object.values(variants)) {
      assert.equal(entry.approved, true);
      const row = ledger.files.find((x) => x.path === entry.path);
      assert(row);
      referenced.add(entry.path);
      assert.equal(entry.sha256, row.sha256);
      const bytes = fs.readFileSync(path.join(root, entry.path));
      assert.equal(
        crypto.createHash("sha256").update(bytes).digest("hex"),
        row.sha256,
      );
    }
  }
  const allFiles = [];
  function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p);
      else allFiles.push(path.relative(root, p).split(path.sep).join("/"));
    }
  }
  walk(path.join(root, "r1"));
  assert.deepEqual(allFiles.sort(), [...referenced].sort());
  assert.equal(referenced.size, 106);
  assert.equal(ledger.files.length, 106);
  const result = bundleAssets(root, supported);
  assert.deepEqual(result.warnings, []);
  return {
    supported: 58,
    enabled: 48,
    blocked: 10,
    unimplemented: 46,
    files: 106,
    externalAssetDependencies: 0,
  };
}
if (require.main === module) console.log(JSON.stringify(verify(), null, 2));
module.exports = { verify, blocked };

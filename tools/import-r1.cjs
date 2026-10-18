// Reproducible, local-only selection from the reviewed R1 archive. No grant of license.
const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto");
const { keys, bundleAssets } = require("./assets.cjs");
const ARCHIVE_SHA =
  "d7ca9dc9107f9bb8e1bdda7d53904ac76bb085814ac293ced2a2791c8bd16c11";
const CHECKSUMS_SHA =
  "8182ef5e07b16f7c0d20260ed92bf2e3565c92bd46acdddc88c9626cded5642c";
const VERIFIED_ORIGIN = "GENERATED_VECTOR_NO_THIRD_PARTY_INPUT";
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
function importR1(kit, output) {
  const base = fs.realpathSync(kit) + path.sep;
  const read = (rel) => {
    if (path.isAbsolute(rel) || rel.split(/[\\/]/).includes(".."))
      throw Error("Archive path escapes root");
    const file = path.join(kit, rel);
    if (!fs.realpathSync(file).startsWith(base))
      throw Error("Archive link escapes root");
    return fs.readFileSync(file);
  };
  const sums = read("SHA256SUMS.txt");
  if (sha(sums) !== CHECKSUMS_SHA)
    throw Error("Unreviewed source checksum manifest");
  let verifiedFiles = 0;
  for (const line of sums.toString("utf8").trim().split("\n")) {
    const m = line.match(/^([a-f0-9]{64})  (.+)$/);
    if (!m || sha(read(m[2])) !== m[1])
      throw Error("Source file hash mismatch");
    verifiedFiles++;
  }
  const register = JSON.parse(read("manifest/work-asset-register.json")),
    supported = keys(require("../data/catalog.json"));
  const records = register.records;
  if (records.length !== 104 || new Set(records.map((x) => x.key)).size !== 104)
    throw Error("Registry ID set invalid");
  if (
    JSON.stringify(
      records
        .filter((x) => x.runtimeSupported)
        .map((x) => x.key)
        .sort(),
    ) !== JSON.stringify(supported.slice().sort())
  )
    throw Error("Supported 58-key set changed");
  const manifest = { version: 1, assets: {} },
    provenance = {
      schema: "origin-lab.asset-integration.r1",
      archiveSha256: ARCHIVE_SHA,
      sourceChecksumsSha256: CHECKSUMS_SHA,
      sourceRegistrySha256: sha(read("manifest/work-asset-register.json")),
      sourceFilesVerified: verifiedFiles,
      designApproved: true,
      releaseApproved: false,
      originalRegistryUnmodified: true,
      records: [],
      files: [],
    };
  const written = new Set();
  function variant(key, name, source) {
    const bytes = read("assets/" + source),
      dest = "r1/" + source.replace(/^staging\//, "");
    if (!written.has(dest)) {
      fs.mkdirSync(path.dirname(path.join(output, dest)), { recursive: true });
      fs.writeFileSync(path.join(output, dest), bytes);
      written.add(dest);
      provenance.files.push({
        path: dest,
        sourcePath: "assets/" + source,
        sha256: sha(bytes),
        bytes: bytes.length,
      });
    }
    manifest.assets[key][name] = {
      path: dest,
      approved: true,
      sha256: sha(bytes),
    };
  }
  for (const record of records) {
    if (record.approved !== false)
      throw Error("Original registry approval unexpectedly changed");
    const eligible =
      record.runtimeSupported && record.rightsStatus === VERIFIED_ORIGIN;
    provenance.records.push({
      key: record.key,
      sourceApproved: record.approved,
      runtimeSupported: record.runtimeSupported,
      rightsStatus: record.rightsStatus,
      integration: eligible
        ? "ENABLED_FOR_DRAFT_REVIEW"
        : record.runtimeSupported
          ? "BLOCKED_PROVENANCE"
          : "OUT_OF_SCOPE",
    });
    if (!eligible) continue;
    manifest.assets[record.key] = {};
    for (const theme of ["light", "dark"])
      variant(
        record.key,
        theme + ".default",
        `staging/${record.category}/${record.category === "species" ? "png18" : "svg20"}-${theme}/${record.id}.${record.category === "species" ? "png" : "svg"}`,
      );
    if (record.category === "species")
      variant(
        record.key,
        "default.selected",
        `staging/species/svg20-selected/${record.id}.svg`,
      );
    if (record.category === "discoveries")
      variant(record.key, "default.locked", "staging/common/locked.svg");
  }
  provenance.counts = {
    registered: 104,
    supported: 58,
    enabled: Object.keys(manifest.assets).length,
    blocked: provenance.records.filter(
      (x) => x.integration === "BLOCKED_PROVENANCE",
    ).length,
    outOfScope: 46,
    files: written.size,
  };
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(
    path.join(output, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(output, "r1-provenance.json"),
    JSON.stringify(provenance, null, 2) + "\n",
  );
  const bundled = bundleAssets(output, supported);
  if (bundled.warnings.length)
    throw Error("Selected asset unexpectedly missing");
  return provenance.counts;
}
if (require.main === module) {
  if (!process.argv[2])
    throw Error(
      "Usage: node tools/import-r1.cjs <extracted-kit-directory> [output-assets-directory]",
    );
  console.log(importR1(process.argv[2], process.argv[3] || "assets"));
}
module.exports = { importR1, ARCHIVE_SHA, CHECKSUMS_SHA };

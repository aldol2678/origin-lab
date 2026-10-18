// Build only explicitly approved local artwork. An empty/missing manifest is valid.
const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto");
const states = ["default", "locked", "discovered", "selected", "disabled"];
const themes = ["default", "light", "dark"];
function keys(catalog) {
  return [
    ...catalog.items.map((x) => "discovery." + x.id),
    ...Object.keys(catalog.species).map((x) => "species." + x),
    "status.oxygen",
    "status.energy",
    "status.insight",
    ...["world", "lab", "evo", "log"].map((x) => "ui.tab." + x),
  ];
}
function bundleAssets(root, allowedKeys) {
  const manifestPath = path.join(root, "manifest.json"),
    output = { version: 1, assets: {} },
    warnings = [];
  if (!fs.existsSync(manifestPath))
    return {
      manifest: output,
      warnings: ["Optional asset manifest absent; existing visuals retained."],
    };
  const input = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (
    input.version !== 1 ||
    !input.assets ||
    Array.isArray(input.assets) ||
    typeof input.assets !== "object"
  )
    throw Error("Asset manifest schema invalid");
  const allowed = new Set(allowedKeys),
    realRoot = fs.realpathSync(root) + path.sep;
  for (const [key, variants] of Object.entries(input.assets)) {
    if (
      !allowed.has(key) ||
      !variants ||
      typeof variants !== "object" ||
      Array.isArray(variants)
    )
      throw Error("Unknown asset key: " + key);
    output.assets[key] = {};
    for (const [variant, entry] of Object.entries(variants)) {
      const [theme, state, ...extra] = variant.split(".");
      if (extra.length || !themes.includes(theme) || !states.includes(state))
        throw Error("Unknown asset variant: " + variant);
      if (!entry || entry.approved !== true || typeof entry.path !== "string")
        throw Error("Artwork requires explicit approved metadata");
      if (
        !/^[a-zA-Z0-9_./-]+\.(svg|png|webp)$/.test(entry.path) ||
        entry.path.startsWith("/") ||
        entry.path.split("/").includes("..")
      )
        throw Error("Asset must be a local SVG/PNG/WebP");
      const file = path.resolve(root, entry.path);
      if (!fs.existsSync(file)) {
        warnings.push("Missing optional asset: " + key + "/" + variant);
        continue;
      }
      if (!fs.realpathSync(file).startsWith(realRoot))
        throw Error("Asset path escapes asset directory");
      const bytes = fs.readFileSync(file),
        ext = path.extname(file).slice(1);
      if (
        entry.sha256 !== undefined &&
        (!/^[a-f0-9]{64}$/.test(entry.sha256) ||
          crypto.createHash("sha256").update(bytes).digest("hex") !==
            entry.sha256)
      )
        throw Error("Asset hash mismatch: " + key + "/" + variant);
      if (bytes.length >= 1024 * 1024) throw Error("Asset exceeds 1 MiB");
      if (ext === "svg") {
        const text = bytes.toString("utf8");
        if (
          !/<svg\s/.test(text) ||
          !/\bviewBox\s*=\s*(["'])0\s+0\s+64\s+64\1/.test(text) ||
          /<(?:script|foreignObject|iframe|image|use|text|style)\b|\bon[a-z]+\s*=|(?:href|src)\s*=|<!ENTITY|<!DOCTYPE|@import|url\s*\(/i.test(
            text,
          )
        )
          throw Error("SVG must be self-contained, text-free and inert");
      } else if (
        ext === "png" &&
        bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a"
      )
        throw Error("PNG signature invalid");
      else if (
        ext === "webp" &&
        (bytes.toString("ascii", 0, 4) !== "RIFF" ||
          bytes.toString("ascii", 8, 12) !== "WEBP")
      )
        throw Error("WebP signature invalid");
      output.assets[key][variant] = {
        src:
          "data:image/" +
          (ext === "svg" ? "svg+xml" : ext) +
          ";base64," +
          bytes.toString("base64"),
        width: 64,
        height: 64,
      };
    }
  }
  return { manifest: output, warnings };
}
module.exports = { bundleAssets, keys };

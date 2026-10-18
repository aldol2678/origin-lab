/* Optional artwork adapter. Reviewed local assets are inlined at build time. */
const ASSET_MANIFEST = /* BUILD_ASSET_MANIFEST */ { version: 1, assets: {} };
const ASSET_STATES = [
  "default",
  "locked",
  "discovered",
  "selected",
  "disabled",
];
const assetThemeQuery =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;
function getAsset(key, variant = {}) {
  const requested = typeof variant === "string" ? { state: variant } : variant;
  const state = ASSET_STATES.includes(requested.state)
    ? requested.state
    : "default";
  const theme =
    requested.theme || (assetThemeQuery?.matches ? "dark" : "light");
  const variants = ASSET_MANIFEST.assets[key];
  if (!variants) return null;
  // Locked discoveries never show a revealed image through a fallback variant.
  const candidates =
    state === "locked"
      ? [theme + ".locked", "default.locked"]
      : [
          theme + "." + state,
          "default." + state,
          theme + ".default",
          "default.default",
        ];
  for (const v of candidates) if (variants[v]) return variants[v];
  return null;
}
const assetImageCache = new Map();
const failedAssetSources = new Set();
function assetFailed(src, key) {
  if (!failedAssetSources.has(src))
    console.warn(
      "Optional image could not be decoded; fallback retained:",
      key,
    );
  failedAssetSources.add(src);
}

function assetImage(key, variant) {
  const asset = getAsset(key, variant);
  if (!asset || failedAssetSources.has(asset.src)) return null;
  let image = assetImageCache.get(asset.src);
  if (!image) {
    image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (typeof ge !== "undefined") ge.draw(true);
    };
    image.src = asset.src;
    assetImageCache.set(asset.src, image);
    image.onerror = () => {
      assetFailed(asset.src, key);
    };
  }
  return image.complete && image.naturalWidth ? image : null;
}
const assetDrawAgent = Pe.prototype.drawAgent;
Pe.prototype.drawAgent = function (sp, x, y, time) {
  const image = assetImage("species." + sp, {
    state: this.selected === sp ? "selected" : "default",
  });
  if (image) {
    this.ctx.drawImage(image, x - 9, y - 9, 18, 18);
    return;
  }
  return assetDrawAgent.call(this, sp, x, y, time);
};
Ge.prototype.applyAssets = function (root = document) {
  if (!root) return;
  const slots = [
    ...root.querySelectorAll(
      "[data-item],[data-codex],button[role=tab][data-tab]",
    ),
  ];
  for (const el of slots) {
    const id = el.dataset.item || el.dataset.codex;
    const key = id ? "discovery." + id : "ui.tab." + el.dataset.tab;
    const locked = !!id && !b(this.state, id),
      state = locked
        ? "locked"
        : el.disabled
          ? "disabled"
          : el.getAttribute("aria-pressed") === "true" ||
              el.getAttribute("aria-selected") === "true"
            ? "selected"
            : id
              ? "discovered"
              : "default";
    applyAssetSlot(el, key, state);
  }
  for (const [id, key] of [
    ["hud-energy", "energy"],
    ["hud-insight", "insight"],
  ]) {
    const value = root === document ? document.getElementById(id) : null;
    if (value)
      applyAssetSlot(
        value.parentElement.querySelector("dt"),
        "status." + key,
        "default",
      );
  }
  const oxygen = root.querySelector("#env-card .bar-row > span");
  if (oxygen) applyAssetSlot(oxygen, "status.oxygen", "default");
};
function applyAssetSlot(el, key, state) {
  if (!el) return;
  const asset = getAsset(key, { state });
  const existing = el.querySelector(":scope > img.optional-asset");
  const fallback = el.querySelector(":scope > svg.ico");
  const restore = () => fallback?.classList.remove("asset-replaced");
  // Set identity before loading so late theme/state callbacks cannot reveal an old icon.
  el.dataset.assetKey = key;
  el.dataset.assetState = state;
  if (!asset || failedAssetSources.has(asset.src)) {
    existing?.remove();
    restore();
    return;
  }
  if (existing?.getAttribute("src") === asset.src) return;
  existing?.remove();
  restore();
  const img = document.createElement("img");
  img.className = "optional-asset";
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  img.width = 20;
  img.height = 20;
  img.hidden = true;
  img.onload = () => {
    if (
      !img.isConnected ||
      el.querySelector(":scope > img.optional-asset") !== img
    )
      return;
    // Never show a revealed variant if this slot became locked before the decode completed.
    if (getAsset(key, { state: el.dataset.assetState })?.src !== asset.src)
      return;
    img.hidden = false;
    fallback?.classList.add("asset-replaced");
  };
  img.onerror = () => {
    assetFailed(asset.src, key);
    img.remove();
    restore();
  };
  el.prepend(img);
  img.src = asset.src;
  if (img.complete && img.naturalWidth) img.onload();
}
for (const name of ["renderLab", "renderLog", "renderTabs", "renderWorld"]) {
  const original = Ge.prototype[name];
  Ge.prototype[name] = function (...args) {
    const result = original.apply(this, args);
    this.applyAssets(
      document.querySelector(
        {
          renderLab: "#panel-lab",
          renderLog: "#panel-log",
          renderTabs: ".tabbar",
          renderWorld: "#panel-world",
        }[name],
      ),
    );
    return result;
  };
}
if (typeof window !== "undefined") {
  window.OriginLabAssets = Object.freeze({ getAsset });
  assetThemeQuery.addEventListener("change", () => {
    if (typeof ge !== "undefined") {
      ge.applyAssets();
      ge.draw(true);
    }
  });
}

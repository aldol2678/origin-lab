# v0.3 — 살아 있는 실험실: implementation design

The feature branch is stacked on the reviewed, unmerged v0.2 baseline. Main remains unchanged. Content IDs remain 42 discoveries, 34 recipes, 9 species, 3 habitats and 4 observations. No new artwork, license or deployment is included.

## Comparison boundary

The lab captures a deep snapshot including RNG, discovered content, resource values and populations. A common study-sample preparation, if requested, runs before the snapshot is cloned into A/B. Only the declared independent variable differs: tidal light, nursery effectiveness, or the selected habitat's decomposer population. Recycling is available in the first chapter when decomposers are discovered; tidal presets explain their unlock requirements.

Both copies call the existing fixed-tick ecosystem engine. The world pauses while the comparison session is open. Lab calculation has no persistence or UI purchase callbacks. Runs yield between bounded chunks and can be cancelled. Re-running retains the same snapshot and seed. Durations are 30/60/120/180 simulated ticks, not wall-clock waiting. Samples include tick 0, every fifth tick and the end, bounded to 200 points. Explanations use measured final changes and actual cumulative predation/recycling, with a short-model limitation.

## Research notes and schema

The explicit v4 canonical key leaves v3 and all older keys read-only. Migration validates and backs up the v3 head plus any conflicting journal branches; it does not fall back to an older, apparently higher-scoring save. Notes contain only bounded summaries, conditions, sample provenance, seed/RNG/tick, duration, version and timestamp. Maximum 20 notes, explicit delete, no discovery/currency/rebirth rewards. Raw full time series stay in memory or an explicit export.

## Early automation

A free cultivation aid unlocks after the first basic producer is introduced. It harvests additional energy from a living producer population, without synthesizing button clicks. The manual probe and an explicit enable/disable choice remain. Balance is measured with a reproducible player policy rather than claimed from the old 835-probe result. Neither extra time gates nor expensive experiment gates are added.

## Asset boundary

An optional, empty manifest declares stable namespaced keys and theme/state variants. Build-time bundling embeds approved local image bytes; runtime never fetches assets. Missing/invalid images retain the existing Canvas/SVG fallback. No fonts, logos, sprites or icons are designed in this feature work. Documentation supplies the integration contract for the separate art track.

## Measured balance and interpretation

Replaying the v0.2 known-recipe policy gives 835 probe actions, 220 ecosystem ticks, 30 discoveries, seven placements, zero failed actions and zero population-to-zero transitions. The v0.3 policy starts with the same producer, then uses the free harvester for subsequent affordable introductions: **60 probes / 220 ticks / 30 discoveries / seven placements / zero failures / zero extinctions**. Both finish the same three final experiment conditions (180 experiment steps, nominal 18 seconds). The longest stretch without discovery or placement in these policies drops from 160 to 93 ticks. These are deterministic engine policies, not human play time. The fixed 160-tick observation window is deliberately retained for comparability; this is not a new enforced game timer. Human curiosity and perceived waiting remain UNKNOWN.

Harvester rate is `8 × min(1, living basic producers / 6)` when enabled and unlocked, zero otherwise. Ecosystem coefficients and every existing recipe remain unchanged. The graph's energy metric excludes this player assistance and shows actual ecosystem production; the HUD shows the combined income. Experiments cannot grant main-world energy, discoveries, notes or milestone currency by themselves. Recording a note is a separate, explicit persistence action.

## Numeric definitions

Each series sample is the exact engine state at tick 0, then every fifth tick. Nutrients and organic matter are per habitat; oxygen is a shared global relative quantity, not a calibrated real concentration. Populations are continuous model counts. Cumulative predation sums actual loss records, with both habitat totals and species-specific totals. Recycling sums the decomposer's actual consumed organic matter times the existing conversion coefficient and symbiosis multiplier, before the habitat nutrient cap; it is gross return, not net stock change. Energy production is the engine rate and its per-tick integral. Axes start at zero and share a maximum across A/B; finite numeric tables accompany the curves.

Nursery effectiveness changes the existing predation-demand multiplier, with no discovery deletion. At longer durations an initially protected population can support more predators, so cumulative predation need not always remain lower. The explanation reports observed values rather than asserting a predetermined winner. Light affects photosynthetic growth and oxygen supply together as the game's existing one-variable light model. Recycling removes only the chosen habitat's decomposers after common preparation; indirect food-web changes are outcomes, not additional independent interventions.

## Save format details

The v4 envelope retains `format`, `schemaVersion`, `savedAt`, `commitId`, `parent`, `ancestors`, and `state`. State adds `automation: {unlocked, enabled}` and `researchNotes: []`. Notes contain a UUID, experiment ID, A/B conditions, habitat, prepared flag and interventions, duration, seed, RNG state, source tick, version, creation time, and each metric's start/end/change. No raw populations or full series are persisted in notes. Values and note limits are validated on import and load; missing v4 fields are rejected. v1/v2/v3 normalization supplies the new defaults explicitly. Existing notes survive simulation restart.

A valid v4 head is authoritative. Without one, a valid v3 head and its ancestry are checked; corrupt or divergent v3 branches block automatic migration, even if older saves exist. Original keys stay byte-identical under the v0.3 writer. Old writers may continue changing their own keys independently. Explicit restore operates on decoded/normalized candidates, backs up the current state and branches, and starts a reviewed v4 lineage. Cross-tab storage changes still pause play and prevent overwrite. This is local browser storage with a recoverable journal, not a server transaction or cross-device sync guarantee.

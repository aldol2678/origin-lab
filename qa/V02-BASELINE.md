# v0.2 baseline verification for v0.3

2026-10-18 · ORIGIN-LAB-V03-ASTRA-001

- Repository: public `aldol2678/origin-lab`, main initially `9033ccc589f8f2bc888f99e56672d4f282d42b11`.
- Initial tree: WIP README only. No other branches, pull requests or LICENSE. Push permission confirmed.
- Downloaded baseline archive: `origin-lab-v0.2.zip`, 4,156,929 bytes.
- ZIP SHA-256: `e5deb357c27c5966f414266449922a0329e5b3854353450acc9e833440b07265`.
- HTML SHA-256: `ecea5a45fa5082f5531ea07dec4ca2400e75eaf8790f574e69dd4e4a81c0a432`.
- Fresh archive bytes match the prior delivered archive. HTML matches its BUILD-INFO declaration and implementation contract.
- Node.js 24.19.0; Chromium 154.0.8037.57; Linux. Exact model/effort: UNKNOWN.

## Fresh execution

`npm ci`, `npm run build`, `npm test`, `npm run test:browser` were run against a fresh extraction, not inferred from the old report.

| Check | Result |
|---|---|
| Dependency install and standalone build | PASS |
| Engine/storage tests | 22 PASS / 0 FAIL |
| Browser cases | 9 PASS / 1 BLOCKED / 0 FAIL |
| file scheme | BLOCKED by environment Chromium policy |
| Human play / actual mobile devices | UNKNOWN |

The shipped defect reproduction deliberately verifies the old false result; its successful exit means the defect was reproduced. The new engine tests verify the fixed behavior. Browser tests cover the supplied older HTML, migration, two-tab conflicts, export/import/restore, chapters, and responsive layout. Test-generated JSON and screenshots are excluded from the public index.

## Public import changes

The v0.2 game build remains byte-identical. Only repository packaging and test portability changed: preserve WIP README, select source/data/docs/tests, ignore private/generated output, use configured or Playwright-installed Chromium, report the actual browser version, and add build/test-only CI. There is no deployment or license addition.

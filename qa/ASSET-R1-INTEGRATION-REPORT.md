# R1 closeout · A01~A15 구현·검증 보고서

작업: `ASTRA / ORIGIN-LAB-ASSET-R1-CLOSEOUT-002` · 2026-10-18

## 결과

**실제 연결 58/58, 출처 정정 10/10, 원본 명세 대조 15/15.** 현재 로컬 단위·통합 69 PASS / 0 FAIL, 브라우저 39 PASS / 2 BLOCKED / 0 FAIL. 구현 커밋 `01e780e12dffc222f075a973d703d2f9aae09844`의 [GitHub CI](https://github.com/aldol2678/origin-lab/actions/runs/39165417410)는 69개 단위·41개 브라우저 검사 PASS / 0 FAIL입니다. file:// 직접 실행 2개도 CI에서 PASS입니다. 최종 문서 커밋의 결과는 PR checks와 납품 보고서에 기록합니다. 실기기는 UNKNOWN입니다.

기준 PR #3 `feature/assets-v11-r1`의 `589e19cc579923fb19a01725eed42eb26ea39b46`에서 새 `feature/assets-r1-closeout` 브랜치를 만들었습니다. 기존 48개 매핑과 그림을 보존하고 10종 × 두 테마 = SVG 20개를 추가했습니다. 전체 126개 파일은 정본과 바이트가 같으며 총 76,796바이트입니다.

## 원본 명세 및 이번 승인 적용

복구된 `Origin_Lab_Astra_Asset_Integration_Spec_R1_20261018.md` 원문 전체를 읽었습니다. 원문 SHA-256: `f95fad75281172bff9d314091201c2e9268ce5eefeb41e1e3a2be5545b7030fc`. 이전의 명세 누락 차단은 해소됐습니다.

원문 G0/A03의 “기본 manifest 비어 있음”과 “런타임/공개 승인 대기”는 당시 승인 상태에 관한 조건입니다. 이번 사용자 지시가 최종 R1 초기 10종을 포함한 58개 공개 Draft 통합을 명시 승인하므로 실행 manifest만 활성화합니다. 원본 빈 manifest·104개 approved:false·과거 디자인 승인 JSON은 변경하지 않습니다. `approved:false`의 빌드 거부와 빈 manifest fallback은 계속 시험합니다. 원문의 PR #3/base #2 절차는 이번 지시의 새 PR #4/base #3로 갱신합니다. 이는 묵시적 배포 승인으로 해석하지 않습니다.

현재 승인: **designApproved:true / draftIntegrationApproved:true / releaseApproved:false / productionDeploymentApproved:false**. 출처 증거·확인 방식은 [출처 감사](../docs/ASSET-R1-PROVENANCE-AUDIT.md)와 [정정 원장](../assets/r1-provenance-correction.json)에 구분합니다. 원본 R2/R1과 인계 자료는 그대로 보존하며 과거 광택 원화는 공개하지 않습니다.

## 조항별 일대일 검증

| ID | 요구사항 | 구현 위치 | 검증 방법 | 상태 | 테스트·증거 |
|---|---|---|---|---|---|
| A01 | ZIP·원본 무결성: R1 해시, 104키, 58/46, 원본 불변 | tools/import-r1.cjs; assets/r1-provenance.json | 정본 ZIP CRC/해시·1,643 항목 및 R2 동일 ZIP/60개 파일 해시 대조 | PASS | source-evidence.json (납품 ZIP); AR01; C01 |
| A02 | 안전한 공개 선별, 미확인 그림 0개 | assets/r1-provenance-correction.json; docs/ASSET-R1-PROVENANCE-AUDIT.md | 설계자 제작 경위·명시적 공개 승인, R2/R1 대조, staged 파일 감사 | PASS | C01; AR05; qa/PUBLIC-REVIEW.md; audit:public |
| A03 | approved:false 활성화 금지·원래 빈 매니페스트 조건 | tools/assets.cjs; assets/manifest.json | false 승인 거부와 빈 매니페스트 fallback. 이번 명시 승인으로 58개 runtime approved:true 허용 | PASS | C03; V03-T09; R1B07; 아래 승인 변경 해석 |
| A04 | 실물 경로·ID·변형·출처/활성 상태 자동 매핑 | tools/r1-mapping.cjs; assets/r1-mapping.json | catalog 생성 키와 58개 매핑, 파일 해시·경로 일치, missing 0 | PASS | C02; tools/verify-r1.cjs; docs/ASSET-R1-MAPPING.md |
| A05 | 42종 미발견 정체 비노출·해금 후 아이콘 | src/assets.js: getAsset/applyAssetSlot | 42개 전체 두 테마에서 잠금 상태 클릭, ???와 동일 잠금 URI 확인 후 전부 해금·선택 | PASS | AR02; CB01; closeout-*-locked-390.png |
| A06 | 9종 Canvas 이동·선택·18px·실패 fallback | src/assets.js; 기존 Pe renderer | 실제 drawImage 18×18/선택 9종, 시간에 따른 위치 변화, 재선택 해제, 오류 Canvas 대체 | PASS | R1B04/R1B07; CB03; closeout-dark-1280-world.png |
| A07 | 밝음·어두움·상태 대비·OS/게임 테마 | src/style.css; src/assets.js: assetThemeQuery | 두 OS 테마에서 실제 CSS 색·변형·잠금·선택 확인. 별도 게임 테마 설정은 없음 | PASS | AR03; R1B05; CB01/CB02; 밝음/어두움 캡처 |
| A08 | 5개 지정 viewport·터치 44px | 기존 반응형 CSS 및 20px 장식 이미지 | 320×568/360×640/390×844/1024×768/1280×800 × 두 테마 × 네 패널; 활성 버튼/summary/select/체크박스 label 크기 | PASS | R1B05 가로 넘침 0; CB02 40조합·2,746개 타깃 측정 |
| A09 | 승인된 standalone·외부 fetch/CDN 0 | build.cjs; tools/assets.cjs | 단일 HTML 인라인, offline context와 실제 조작, 외부 요청 없음; 로컬 file:// 정책 차단은 CI 별도 확인 | PASS | B10; R1B06/R1B07; CI B07 |
| A10 | 42 발견·34 조합·9종·A/B 3종·노트 유지 | data/catalog.json; src/research*.js (불변) | 기존 전체 단위/엔진·UI 조작 회귀, 세 preset 계산과 노트 reload/delete | PASS | tests/core.test.cjs; tests/v03.test.cjs; U02/U05; source-evidence.json |
| A11 | v4 저장·v1/v2/v3 이전/복구·충돌/원본 백업 | src/persistence.js (불변) | 기존 migration/import/backup/two-tab 테스트 및 asset 렌더 전후 상태·저장 원문 대조 | PASS | B02/B05/B06; U01; R1B06; tests/evidence.cjs |
| A12 | npm ci/build/test/browser·공개 감사·CI | package.json; .github/workflows/test.yml | 로컬 설치·69 단위·39 브라우저 PASS/2 정책 BLOCKED·재현 빌드·공개 감사. GitHub CI 69 단위·41 브라우저 PASS | PASS | final-unit.txt; final-browser.txt (ZIP); 최종 PR checks |
| A13 | 파일 <1MiB·HTML 크기·성능·메모리 비교 | tools/assets.cjs; tests/closeout-browser.cjs | 1MiB 경계/64 viewBox 거부, 번들 전후 크기, 150 draw 및 빈/48/58 CDP heap 측정 | PASS | C03; R1B08; CB04; 아래 측정표 |
| A14 | 한글 라벨·키보드·스크린리더 구조 보존 | src/assets.js; src/game.js 텍스트 불변 | 기존 이름/aria·키보드 focus 테스트, 이미지 alt 빈 값/aria-hidden, 화면 한국어·배치 검토 | PASS | R1B01/R1B05; U03; source-evidence.json; 화면 캡처 |
| A15 | 실제 모바일과 에뮬레이션 구분 | 테스트 환경·보고서 | 실제 휴대폰 미사용. Chromium viewport 검사와 실기기 결과를 구별 | UNKNOWN | 이 보고서 UNKNOWN 목록; physicalDevice: UNKNOWN |

모든 15개 조항을 대조했습니다. A01~A14는 PASS이고 A15는 실기기 미사용으로 UNKNOWN입니다. 14개 PASS는 위에 명시한 검증 범위에서 PASS입니다. 화면의 미학·초보자 식별률·법적 독점권을 자동 테스트 PASS로 보장하지 않습니다.

## 수정한 명세 차이

- 명시 승인에 따른 58개 매핑과 초기 10종 출처 정정, 원본/정정 출처 및 Draft/출시 승인 분리.
- 원문 요구의 기계 판독 매핑·출처 감사·A01~A15 보고서 경로를 추가했습니다.
- 빌더의 SVG 검사를 정확한 0 0 64 64 viewBox와 1MiB 미만으로 강화하고 경계·안전성 테스트를 추가했습니다.
- 생물 선택을 같은 버튼으로 해제할 수 없던 기존 동작에 표시 전용 토글을 추가했습니다. 게임 상태·저장·개체 수에는 쓰지 않습니다.
- 전체 42종의 잠금/해금, 전 화면 활성 조작 44px, 생물 이동/해제/탭 전환과 JS heap 비교를 추가 검증했습니다.

게임 ID·조합·생물 데이터·저장 스키마는 변경하지 않았습니다. `src/game.js`, `src/chapter.js`, `src/persistence.js`, `src/research.js`, `src/research-ui.js`, `data/catalog.json`은 기준 PR #3과 바이트 단위로 같습니다. 단일 HTML에는 승인 파일을 전부 인라인합니다. 빈/부분/잘못 디코딩되는 에셋은 기존 표시로 돌아갑니다.

## 크기·성능·메모리

| 빌드 | HTML 바이트 | 변화 |
|---|---:|---|
| v0.3 최초 | 219,841 | 아트 미연결 |
| PR #3 / 48개 | 347,047 | 기준선 |
| 이번 / 58개 | 366,732 | PR #3 대비 +19,685 (약 5.67%) |

최종 HTML SHA-256: `557d7966a6dfd472f24268fa2f9872557d1cde6c733499f6f742d640c8670fe1`. 연속 두 번 빌드 바이트 일치. CI에서도 git diff로 재현 빌드를 확인합니다.

150회 준비된 Canvas draw: 연결 평균 0.709ms / p95 0.300ms / 최대 42.9ms, 빈 manifest 평균 0.209ms / p95 0.600ms / 최대 2.7ms. 같은 로컬 Chromium의 짧은 합성 측정이며 일반적인 FPS나 실기기 성능 보장이 아닙니다.

| 매니페스트 | JS heap 초기 | 100회 렌더 뒤 | DOM nodes 초기→이후 | listeners 초기→이후 |
|---|---:|---:|---|---|
| empty | 1,098,352 | 1,430,408 | 1293→1293 | 28→28 |
| prior48 | 1,193,912 | 1,526,668 | 1641→1650 | 170→188 |
| complete58 | 1,210,016 | 1,535,884 | 1701→1710 | 210→228 |

CDP GC 후 JS heap와 DOM 카운터입니다. SVG 이미지 문서와 처음 로딩되는 생물 캐시도 집계에 영향을 줍니다. 같은 코드에서 48개와 58개 매니페스트를 비교했고, GPU·이미지 픽셀 버퍼·프로세스 RSS·장시간 누수는 측정하지 않았습니다. 렌더 도중 짧은 오류/누락을 저장 상태 변화로 처리하지 않습니다.

## 자동 검증과 화면 검토 구분

- Node.js 24.19.0, Playwright, 로컬 Chromium 154.0.8037.57. `npm ci`, build, 69개 단위, legacy 결함 재현, 밸런스/완주, migration 증거 생성 및 전체 브라우저 스위트 실행.
- 로컬 브라우저: v0.2 9 PASS + 1 BLOCKED, v0.3 9 PASS + 1 BLOCKED, v0.3 UI 9 PASS, R1 8 PASS, closeout 4 PASS. B08 무예외 확인은 JSON 결과에 포함됩니다.
- BLOCKED 2개는 환경 관리 정책의 file:// 차단입니다. 정책 변경/우회는 하지 않았습니다. 네트워크 차단 페이지에서 단일 HTML과 실제 조작은 PASS입니다. CI의 일반 Chromium 결과는 별도로 기록합니다.
- 모바일 320 밝음 실험실과 1280 어두움 PC 등 캡처를 직접 열어 새 10종과 기존 48개의 배치·텍스트·색·중복·넘침을 검토했습니다. 초보자가 직접 한 완주/식별성 시험과 구별합니다.
- 실제 휴대폰, Safari/Firefox, 직접 스크린리더 사용, 처음 보는 사람의 18/20px 종 식별률, 장시간 배터리/메모리 및 사람 직접 완주는 **UNKNOWN**입니다.

## 재현 및 증거

```sh
npm ci
npx playwright install chromium
npm run build
npm test
npm run test:assets
npm run test:evidence
npm run test:browser
npm run audit:public
```

설치된 Chromium은 CHROMIUM_PATH로 지정할 수 있습니다. 원본 ZIP 전체 검증은 비공개 입력을 로컬에서 해시 대조했고 CI에는 원본 ZIP을 올리지 않았습니다. CI는 공개한 126개 파일·원장·변형과 출처 정정 기록을 검증합니다.

- [58개 키 목록](../docs/ASSET-R1-KEYS.md), [자동 매핑](../assets/r1-mapping.json), [출처 정정](../assets/r1-provenance-correction.json)
- [밝음 320 실험실](screenshots/closeout-light-320-lab.png), [어두움 1280 세계](screenshots/closeout-dark-1280-world.png), [어두움 390 도감](screenshots/closeout-dark-390-log.png)
- 상세 JSON·로그·추가 캡처·source-evidence.json은 전달 ZIP qa/에 포함합니다. 합성 테스트 저장만 포함하며 사용자 개인 저장은 없습니다.

## 병합 전 확인

실제 휴대폰에서 18/20px 식별성과 테마 대비를 설계자가 확인하는 것이 남았습니다. PR 스택은 #1→#2→#3→새 Draft이며, 상위 PR 병합 시 base 변경과 최신 HEAD CI 재확인이 필요합니다. 이번 작업은 병합·Draft 해제·배포를 수행하지 않습니다. 미지원 46개·로고·큰 그림·폰트는 별도 제안 범위입니다.

# R1 출처 정정·공개 범위 감사

작업 `ORIGIN-LAB-ASSET-R1-CLOSEOUT-002`. PR #3의 보류 판단은 당시 전달 기록에만 근거했습니다. 이번에 설계자가 제작 경위를 확인하고 최종 R1 10종의 공개 GitHub Draft 및 테스트 HTML 연결을 명시적으로 승인했습니다. 이에 유효 분류를 정정합니다. 상세 생성 도구 로그가 없다는 사실만으로 다시 차단하지 않습니다.

## 서로 다른 증거

1. **설계자 확인:** 초기 원화를 설계자 요청에 따라 ChatGPT 이미지 생성 도구로 만들고, 같은 프로젝트에서 R2 수정과 R1 평면 벡터 재제작을 진행했다는 사용자 진술. 도구 내부 로그를 독립 열람했다고 주장하지 않습니다.
2. **파일에서 확인:** R2 README는 생성 이미지와 별도 SVG를 구분합니다. 인계 ZIP의 `reference/Origin_Lab_Discovery_Assets_R2_10items.zip`과 R1의 `source/R2_10items_ORIGINAL_UNMODIFIED.zip`이 바이트 단위로 같습니다. R2 asset-index의 10개 ID·60개 파일 해시와 바이트 수를 검증했습니다.
3. **R1에서 확인:** 원본 ZIP과 내부 체크섬 1,643개, 등록부 104개 ID, 최종 디자인 승인 SHA가 일치합니다. R1 스타일 기록은 초기 10종의 큰 그림을 벡터로 재제작하고 작은 SVG는 보존했다고 구분합니다. 이번에 연결하는 것은 최종 승인 R1 패키지의 `svg20-light/dark` 파일입니다. 과거 광택 원화를 축소하거나 가져오지 않습니다.
4. **권한:** 이번 사용자 지시가 공개 Draft 통합을 승인합니다. 과거 디자인 승인 JSON의 runtimeApproved:false 등은 당시 상태 그대로 보존합니다. 출시는 승인하지 않았습니다.

| 증거 | SHA-256 |
|---|---|
| R1 정본 ZIP | d7ca9dc9107f9bb8e1bdda7d53904ac76bb085814ac293ced2a2791c8bd16c11 |
| R2 제작 인계 ZIP | 3b169e70125a66e839c24a8c65543f5637daeb86c2329313723f2ccf25b40f4a |
| 두 곳에 보존된 동일 R2 ZIP | 84f1d8235641722cfde5f027a936b2b58e181d88a475cfb756dc5122d7fcad75 |
| 원본 R1 구현 명세 | f95fad75281172bff9d314091201c2e9268ce5eefeb41e1e3a2be5545b7030fc |
| 디자인 승인 JSON | 4ce5b34704ff6e400a6bfc3d9af60e1dc3393f58be66eae8d66bf5195fe555ca |

## 정정 10종과 승인 상태

`water`, `mineral`, `atmosphere`, `energy`, `vapor`, `cloud`, `rain`, `sediment`, `heat`, `hydrothermal`.

원래 기록 `USER_SUPPLIED_R2_AND_NEW_VECTOR_DERIVATIVE_EXTERNAL_HISTORY_UNKNOWN`은 `sourceRightsStatus`로 보존합니다. 유효 출처는 `USER_DIRECTED_CHATGPT_GENERATED_PROJECT_REVISED_R1_VECTOR`, 감사 상태는 `VERIFIED_FOR_REVIEW`입니다. AI 생성물을 사람이 직접 그렸다고 표기하지 않으며 독점적 저작권이 확정되었다고 주장하지 않습니다. 확인한 자료에서 제3자 그림을 가져왔다는 구체적인 증거는 발견하지 않았습니다.

- designApproved: **true**
- draftIntegrationApproved: **true**
- releaseApproved: **false**
- productionDeploymentApproved: **false**

[정정 원장](../assets/r1-provenance-correction.json)은 R2의 60개 원본 파일 해시와 R1의 새 연결 파일 20개 해시를 담습니다. [통합 원장](../assets/r1-provenance.json)은 원본 104개 상태·원래 승인·현재 결정과 런타임 126개 파일을 담습니다. 원본 제작 등록부·R2/R1 ZIP·과거 승인 문서는 변경하지 않았습니다.

## 공개 파일 선별

기존 48개 매핑과 106개 파일을 보존하고 작은 SVG 20개만 추가했습니다. 지원 58개는 VERIFIED_FOR_REVIEW/APPROVED_FOR_DRAFT, 미지원 46개는 EXCLUDED입니다. 큰 원화, 원본 R2 ZIP, 제작 인계 ZIP, 원본 명세 전체, 폰트, 로고, 개인 저장·환경 파일은 공개하지 않습니다. GitHub Draft도 공개임을 전제로 검수했습니다. 새로운 LICENSE는 없습니다.

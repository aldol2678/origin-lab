# R1 매핑 · 58 지원 / 46 미지원

[지원 키별 현재 파일](ASSET-R1-KEYS.md) · [전체 변형 기계 매핑](../assets/r1-mapping.json)

키는 `tools/assets.cjs:keys(catalog)`로 생성하며 한국어 이름에서 파일명을 역산하지 않습니다. 매핑은 `tools/r1-mapping.cjs`가 생성하고 importer와 테스트가 검증합니다. 58개 모두 밝은/어두운 기본 변형이 존재하며 누락은 0입니다. 발견 42개는 공통 잠금, 생물 9개는 선택 SVG를 추가 사용합니다. 일반 선택/비활성 상태는 계약의 기본 변형으로 fallback하고 상태·버튼 테두리는 HTML/Canvas가 전달합니다.

| 용도 | 원본 R1 경로 | 게임 내 경로 | 표시 |
|---|---|---|---|
| 발견 42 | assets/staging/discoveries/svg20-{light,dark} | assets/r1/discoveries/svg20-{light,dark} | 20px |
| 생물 9 | assets/staging/species/png18-{light,dark} | assets/r1/species/png18-{light,dark} | 18px Canvas |
| 생물 선택 | assets/staging/species/svg20-selected | assets/r1/species/svg20-selected | 18px + 기존 선택 테두리 |
| 상태 3 | assets/staging/status/svg20-{light,dark} | assets/r1/status/svg20-{light,dark} | 20px |
| 탭 4 | assets/staging/tabs/svg20-{light,dark} | assets/r1/tabs/svg20-{light,dark} | 20px |
| 잠금 | assets/staging/common/locked.svg | assets/r1/common/locked.svg | 공통 중립 그림 |

## 미지원 46개: EXCLUDED

- `status.growth`
- `status.decline`
- `status.discovery`
- `status.warning`
- `status.experiment`
- `status.compare`
- `status.graph`
- `status.origin_data`
- `status.nutrients`
- `status.predation`
- `status.decomposition`
- `status.photosynthesis`
- `status.respiration`
- `status.shelter`
- `status.population`
- `status.filter_feeding`
- `status.save`
- `status.restore`
- `status.lock`
- `status.unlock`
- `status.info`
- `status.success`
- `status.pause`
- `status.play`
- `status.reset`
- `ui.component.slot_empty`
- `ui.component.slot_selected`
- `ui.component.slot_complete`
- `ui.component.button_default`
- `ui.component.button_hover`
- `ui.component.button_active`
- `ui.component.button_disabled`
- `ui.component.card_info`
- `ui.component.card_discovery`
- `ui.component.research_panel`
- `ui.component.comparison_a`
- `ui.component.comparison_b`
- `ui.component.legend_producer`
- `ui.component.legend_grazer`
- `ui.component.legend_predator`
- `ui.component.legend_decomposer`
- `ui.component.progress_track`
- `ui.component.progress_fill`
- `ui.component.badge_warning`
- `ui.component.badge_info`
- `ui.component.badge_success`

로고·큰 도감 그림·폰트도 EXCLUDED입니다. 후속 후보는 상태 25개와 UI 21개에 별도 표시 슬롯·접근성 계약을 설계하는 PR, 큰 도감 그림의 확대 슬롯 PR입니다. 이번에 구현하거나 자동 활성화하지 않습니다.

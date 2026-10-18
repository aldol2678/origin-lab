# 에셋 연동 계약 · v0.3

v0.3 최초 계약은 빈 매니페스트로 검증했습니다. R1 통합에서는 제공된 Asset Kit의 확인 가능한 48개 키를 연결합니다. 나머지 10개 키와 누락·오류 슬롯은 기존 Canvas·SVG·HTML 표시를 유지합니다. 에셋을 새로 제작하거나 폰트·로고를 추가하지 않습니다.

## 고정 키와 데이터

- `discovery.<id>`: `data/catalog.json.items`의 발견 ID 42개. 실험실 칩과 도감에 적용.
- `species.<id>`: `data/catalog.json.species`의 종 ID 9개. 세계 Canvas 생물에 적용.
- `status.oxygen`, `status.energy`, `status.insight`: 환경/HUD.
- `ui.tab.world`, `ui.tab.lab`, `ui.tab.evo`, `ui.tab.log`: 기본 탭.
- 조합, 발견, 종 ID를 바꾸지 않습니다. 키 목록은 `tools/assets.cjs`의 `keys(catalog)`로 얻습니다.

## 매니페스트 형식

아래는 연동 형식 예시입니다. 참조한 파일은 제공되지 않습니다. 실제 아트 검토·사용 권한 확인을 마친 뒤에만 `approved: true`를 지정하세요.

```json
{
  "version": 1,
  "assets": {
    "discovery.water": {
      "light.discovered": {"path": "approved/water-light.svg", "approved": true},
      "dark.discovered": {"path": "approved/water-dark.svg", "approved": true}
    }
  }
}
```

- 변형 키: `<theme>.<state>`. theme은 `default/light/dark`, state는 `default/locked/discovered/selected/disabled`.
- 아트는 기본 64×64, 투명 배경, SVG는 일관된 `viewBox`. PNG/WebP도 지원합니다. 현재 UI 아이콘은 20×20, Canvas 생물은 18×18로 표시하므로 작은 크기에서도 식별 가능해야 합니다.
- 설명·이름·숫자는 HTML 텍스트에 둡니다. SVG 안에 텍스트를 넣지 않습니다. 장식 이미지는 빈 alt이며 이름과 상태는 기존 HTML 접근성 정보로 전달합니다.
- 파일 경로는 `assets/` 내부 상대 경로만 허용합니다. 외부 URL, 경로 이탈, 심볼릭 링크 이탈, 1 MiB 초과 파일은 빌드 오류입니다.
- SVG는 스크립트, 이벤트 속성, 외부 참조, 이미지/use/foreignObject/style/text 요소 없이 자급적인 도형만 사용합니다. 승인 메타데이터나 형식이 잘못되면 조용히 포함하지 않고 빌드를 멈춥니다.

## Resolver와 fallback

`window.OriginLabAssets.getAsset(key, variant)`는 `{src, width:64, height:64}` 또는 `null`을 반환합니다. src는 빌드에 인라인된 data URI입니다. null이면 호출부의 기존 Canvas/SVG/텍스트가 fallback입니다.

```js
getAsset('species.macroalgae', {theme: 'dark', state: 'selected'});
getAsset('discovery.water', 'discovered'); // 테마는 운영체제 설정
```

우선순위는 `theme.state → default.state → theme.default → default.default`입니다. 잠긴 도감은 `theme.locked → default.locked`만 사용해 미발견 그림이 노출되지 않게 합니다. 테마 변경을 반영하며 키보드 선택과 텍스트는 유지합니다.

매니페스트가 없거나 비어 있어도 빌드·게임은 정상입니다. 일부 파일이 빠지면 개발 콘솔에 경고를 남기고 해당 슬롯만 fallback을 사용합니다. 이미지 디코딩 실패도 fallback으로 돌아갑니다. 매니페스트가 아예 비어 있을 때 각 기본 슬롯마다 경고를 반복하지 않습니다.

`npm run build`가 승인된 로컬 파일을 단일 HTML에 인라인합니다. 실행 중 fetch/CDN 요청은 없습니다. 폰트 슬롯은 이번 범위에 포함하지 않았으며 시스템 한글 폰트를 사용합니다. 사용자 제작/권리 검토가 완료된 폰트 적용은 후속 작업입니다.

## R1 선별 규칙과 공개 범위

정본 ZIP의 SHA-256은 `d7ca9dc9107f9bb8e1bdda7d53904ac76bb085814ac293ced2a2791c8bd16c11`입니다. 내부 SHA256SUMS의 1,643개 항목을 검증했습니다. 원본 레지스트리 104개 ID와 `approved:false`는 원본에서 수정하지 않습니다. 별도 원장 `assets/r1-provenance.json`에 원래 상태와 통합 결정을 함께 기록합니다.

- 지원 58개 중 `GENERATED_VECTOR_NO_THIRD_PARTY_INPUT`인 48개만 연결합니다. 이는 제공된 제작 기록에 따른 분류이며 독점권·법적 권리 보증을 뜻하지 않습니다.
- `USER_SUPPLIED_R2_AND_NEW_VECTOR_DERIVATIVE_EXTERNAL_HISTORY_UNKNOWN`인 초기 발견 10개는 보류합니다. 디자인 승인만으로 불명확한 원본의 공개 권한을 추정하지 않습니다. [키별 목록](ASSET-R1-KEYS.md)을 참고하세요.
- 미지원 46개, 로고, 폰트, 큰 삽화, 접촉 시트, 원본 R2 묶음은 공개하거나 연결하지 않습니다.
- 런타임의 `approved:true`는 검수된 파일을 이 Draft에서 인라인할 수 있다는 표시입니다. 원장의 `releaseApproved:false`와 원본의 `sourceApproved:false`는 유지합니다.

선택 파일 106개(69,360바이트)는 변형 없이 복사합니다. 발견·상태·탭은 `svg20-light/dark`, 생물 기본은 `png18-light/dark`, 생물 선택은 `svg20-selected`를 사용합니다. 발견 32개는 동일한 중립 잠금 SVG를 공유합니다. 어두운/밝은 테마 파일이 동일한 생물도 정본 그대로 사용합니다. 이름·숫자·상태·선택 테두리는 기존 코드와 HTML이 전달합니다.

각 매니페스트 항목의 `sha256`이 실제 바이트와 다르면 빌드를 중단합니다. 누락된 선택 파일은 경고 후 기본 표시를 쓰지만, 검토된 공개 파일 전체를 확인하는 `verify-r1`은 누락을 실패로 처리합니다. 디코딩이 실패한 URI는 다시 시도하거나 경고를 반복하지 않습니다. 새 이미지가 해독되기 전에는 기본 표시를 유지하며, 성공한 경우에만 기존 탭 SVG를 숨깁니다. 늦게 완료된 요청은 바뀐 테마나 잠금 상태를 덮어쓰지 않습니다.

```sh
# 검증된 정본을 로컬에서 추출한 경우에만 재선별합니다.
node tools/import-r1.cjs /path/to/Origin_Lab_Asset_Kit_v1_1_R1
npm run build
npm run test:assets
npm run test:browser
```

가져오기 도구는 고정된 원본 체크섬 목록의 해시와 모든 항목을 검증한 뒤, 지원 키와 출처 상태의 교집합만 복사합니다. 실행에 정본 ZIP이나 Drive 연결은 필요하지 않습니다.

## 남은 확인

요청에 명시된 `Origin_Lab_Astra_Asset_Integration_Spec_R1_20261018.md`는 이번 접근 가능한 첨부·정본 ZIP·Drive 검색에서 찾지 못했습니다. 사용자 요청, 기존 계약, 정본 기록 및 디자인 승인에 따라 위 범위만 구현했습니다. 보이지 않는 문서의 세부 요구사항 준수는 BLOCKED입니다.

권리 보류 10개는 출처·공개 권한 확인 후 별도 검토가 필요합니다. 실제 휴대폰과 처음 보는 사람의 18/20px 의미 식별성 검증은 UNKNOWN입니다. 자동 브라우저·화면 검토·성능 측정 범위는 [R1 보고서](../qa/ASSET-R1-REPORT.md)에 구분합니다.

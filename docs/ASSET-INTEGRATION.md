# 에셋 연동 계약 · v0.3

이 구현에는 새 그림·아이콘·로고·폰트가 없습니다. `assets/manifest.json`의 `assets`는 비어 있으며 기존 Canvas와 기본 SVG, HTML 텍스트로 전체 게임이 실행됩니다. 에셋 제작과 최종 승인은 설계자 측 별도 작업입니다.

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

## 별도 아트 트랙의 미완료 항목

실제 생물 이미지, 조합 아이콘, 상태 아이콘, 탭 아이콘, 폰트, 로고는 전부 미제공입니다. 이번 검증은 빈 슬롯·누락·부분 매니페스트·테마/상태 선택·기존 화면 fallback을 대상으로 합니다. 실제 완성 아트의 선명도, 대비, 캐릭터성, 파일 크기와 모바일 식별성은 납품 후 다시 검수해야 합니다.

# v3 저장 계약

## 키와 형식

- 정본: `originLab.save.v3`
- 변경 이력: `originLab.save.v3.commit.<UUID>` (현재 + 최근 조상 12개)
- 보존 백업: `originLab.save.v3.backup.<timestamp>.<UUID>.<reason>`
- 기존 백업 목록: `originLab.save.backup.*`, `originLab.save.v1-backup`도 읽기 전용 복구 후보로 표시
- 최초 이전 입력: `originLab.save`, `originLab.save.v2` — v0.2는 쓰거나 지우지 않음

```json
{
  "schemaVersion": 3,
  "savedAt": 1792240000000,
  "format": "origin-lab",
  "commitId": "UUID",
  "parent": "previous UUID or null",
  "ancestors": ["up to 24 known ancestor IDs"],
  "state": {
    "schemaVersion": 3,
    "discovered": ["water", "mineral", "atmosphere", "energy"],
    "claimed": [],
    "milestones": [],
    "chapter": {}
  }
}
```

위 state는 설명을 위한 축약이다. 전체 필드는 `src/game.js`의 `le()`와 `src/chapter.js`의 `chapterDefaults()`에 정의되어 있다. JSON 내보내기에는 `schemaVersion`, `savedAt`, `state`만 필요하다. 가져오기는 확인 후 새 정본 이력을 만든다. 저장 timestamp, tick, 발견 개수, 재화는 정본 우선순위를 정하는 점수가 아니다.

## 이전과 보존

v1/v2의 `discovered`, `claimed`, 통찰, 기원 데이터, 환생 수, 영구 연구, 이론, 장비, 에너지, 기존 두 서식지의 환경·개체군, 최종 완료와 세 조건 기록(빛 전환 횟수 `switches` 포함)을 보존한다. v1에 실험 기록이 없으면 빈 실험 기록으로 이전하되 완료 사실은 유지한다. 기존 환생 수가 1 이상이면 첫 장 보상 성취를 이미 지급된 것으로 표시한다. 장 해금은 최종 완료 또는 기존 환생에서 복원한다. 새 장 필드는 기본값을 추가한다.

유효한 입력을 대상으로 보존 필드를 비교했다. 필수 필드가 없거나 값·ID가 지원되지 않는 입력은 정상 진행으로 간주해 초기화하지 않고 거절한다. 원본 JSON은 그대로 백업한다. 로그의 표시용 분류와 길이는 안전하게 정규화하고, 일시적 감소 원인 창(`loss`, `win`)은 다음 tick에 다시 계산한다. 이 두 진단 캐시는 영구 진행으로 보존하지 않는다.

v1/v2 두 입력의 정규화된 상태가 다르면 모두 백업한 뒤 선택을 요청한다. 같으면 한 상태로 이전한다. 정본이 생긴 뒤에는 구버전 입력의 증가한 시간이나 재화가 정본 선택에 관여하지 않는다. 이전은 멱등이다.

## 동시 저장과 오류

메모리의 마지막 정본 raw와 현재 저장 raw가 다르면 충돌로 중지한다. 정본을 바꾸기 전에 새 이력 항목을 기록하고 읽기 검증한다. 동시 실행으로 분기되거나 정본 쓰기 직전 중단된 이력이 있으면 다음 로드에서 분기 후보를 보여 주고 선택을 요구한다. 임의의 합집합 병합으로 재화나 보상을 늘리지 않는다.

`localStorage`는 여러 키에 걸친 트랜잭션을 제공하지 않는다. 이 구현은 여러 탭의 쓰기를 완전한 원자적 트랜잭션이라고 주장하지 않는다. 분기 이력을 먼저 보존하고, 정본 raw 비교·storage 이벤트·재로드 시 이력 검사를 함께 사용해 충돌을 드러낸다. 원자적인 단일 키 저장 자체가 실패하거나 저장소가 외부에서 통째로 삭제된 경우까지 완벽한 내구성을 보장할 수 없다.

백업, 정본, 이력 쓰기 후 readback을 확인한다. 실패를 숨기지 않고 자동 저장을 중지한다. 명시적 가져오기/복구/초기화도 기존 상태·메모리 상태·이력을 먼저 백업한 뒤 진행한다. 복구 백업은 자동 삭제하지 않으므로 반복 복구가 많으면 브라우저 저장 공간이 찰 수 있다. 그때는 원본 JSON을 외부 파일로 보관한 후 브라우저 저장 공간을 관리해야 한다. 이력만 정기적으로 13개 안팎으로 제한한다.

## 증거

- `qa/legacy-red.json`: 원본 완료 true가 오래된 미완료 false로 바뀌는 결함 재현
- `qa/core-tests.txt`, `qa/test-run.txt`: v1/v2 필드 보존, 이전 멱등, 동시 저장, 잘못된 입력, 상위 스키마, 쓰기 실패, 복구
- `qa/browser-tests.json`: 첨부 v0.1.1 실제 재실행, 두 탭의 실제 storage 이벤트, 가져오기 취소·확인·복구
- `qa/export-evidence.json`: 브라우저에서 다운로드한 v3 상태

v0.1 HTML은 제공되지 않았다. v1 형식과 구판 쓰기 동작은 제공된 로더 및 문제 명세에서 구성한 fixture로 테스트했다. 실제 v0.1 파일 실행 검증은 UNKNOWN이다.

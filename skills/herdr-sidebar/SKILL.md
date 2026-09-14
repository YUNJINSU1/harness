---
name: herdr-sidebar
description: Herdr 오른쪽 사이드바(위 Sheep pasture 목장 + 아래 Agent Usage 사용량 미터)를 다시 띄우거나 배치를 고칠 때 사용. 사용자가 "양떼 꺼졌어", "유세지 다시 켜", "사이드바 복구", "목장/사용량 패널 다시" 같은 요청을 하면 이 스킬로 처리한다. HERDR_ENV=1 필요.
---

# Herdr 사이드바 복구

오른쪽 열 하나에 플러그인 팬 두 개를 세로로 쌓은 레이아웃이다. 위가 `huketo.sheep`의 목장(Sheep pasture), 아래가 `usagebar`의 사용량 미터(Agent Usage)다.

## 실행

요청을 받으면 이 한 줄이면 끝난다. 팬을 직접 열지 말고 항상 스크립트를 쓴다.

```bash
bash "$HOME/.config/herdr/scripts/sidebar-toggle.sh" --rebuild
```

`--rebuild`는 남아 있는 팬을 닫고 새로 연다. 인자 없이 부르면 토글이라 **살아 있을 땐 닫아버리므로**, 복구 요청에는 절대 인자 없이 부르지 않는다.

사람이 직접 쓸 키는 이미 `config.toml`에 있다. `F9` / `prefix+u` 는 토글, `F8` / `prefix+shift+u` 는 재구성이다.

## 왜 토글로는 복구가 안 되나

플러그인 프로세스(`bin/herdr-sheep`, `bin/usagebar`)가 죽어도 herdr는 팬을 **라벨을 단 빈 셸로 남긴다.** 스크립트는 라벨로만 존재를 판별하므로 토글은 그 껍데기를 "열려 있음"으로 읽고 닫기만 한다. 그래서 죽은 사이드바는 토글로 두 번 눌러야 살아나고, 사용자 눈엔 고장으로 보인다. `--rebuild`가 그 단일 수리 경로다.

같은 라벨의 팬이 여러 개 쌓인 경우에도 `--rebuild` 하나로 전부 정리된다. 스크립트는 라벨이 붙은 팬을 **모두** 닫고, `plugin pane close`가 `plugin_pane_not_found`로 거절하면 `pane close`로 다시 시도한다. 좀비 팬을 수동으로 하나씩 닫지 않는다.

## 검증

명령이 성공했다고 끝내지 말고 배치를 확인한다. 목장이 위(`y`가 작은 쪽), 미터가 아래여야 한다.

```bash
herdr api snapshot | jq -c '.. | objects | select(has("pane_id") and .rect != null) | {p:.pane_id, r:.rect}' | sort -u
```

내용까지 보려면 `herdr pane read <pane_id>`로 목장 렌더링과 미터 갱신 시각을 확인한다.

## 손대지 말 것

- 팬 크기는 스크립트의 `converge`가 비율 델타를 반복 적용해 맞춘다. `herdr plugin pane open`에는 `--width/--height`가 없다. 직접 `pane resize`를 부르지 않는다.
- 폭·높이를 바꾸려면 환경변수 `SIDEBAR_WIDTH`(기본 64), `SIDEBAR_SHEEP_HEIGHT`(기본 14)를 쓴다. 스크립트 상수를 고치지 않는다.
- 미터가 비어 있거나 값이 이상한 건 레이아웃 문제가 아니다. `usagebar`의 데이터 문제이므로 `bash bin/run-status.sh`로 갱신을 시도한다.

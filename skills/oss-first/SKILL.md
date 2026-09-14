---
name: oss-first
description: Use BEFORE implementing any sizable new feature, screen, shell, chart, auth, parser, or subsystem from scratch — research existing open-source solutions first and present a "adapt vs build" comparison. Triggers on "새 기능", "새로 만들", "구현해줘" for chunky components, or when about to write >~200 lines of generic (non-domain) code.
---

# OSS First — 직접 구현 전에 오픈소스 조사

직접 구현하려는 경향을 교정한다. 덩어리 있는 범용 기능은 누군가 이미 만들었을 확률이 높다.

## When NOT to apply

- 자잘한 유틸(몇 줄이면 되는 것) — 의존성 추가가 오히려 손해
- 도메인 고유 로직(비즈니스 규칙, 사내 시스템 연동)
- 이미 쓰는 의존성/코드베이스로 해결되는 것 (ponytail 사다리 먼저)

## Workflow

1. **조사**: WebSearch로 후보 2~3개 찾기 (템플릿·라이브러리·보일러플레이트).
2. **검증**: 각 후보의 GitHub 저장소를 WebFetch로 직접 확인 —
   - 라이선스 (MIT/Apache OK, GPL은 사용자에게 확인)
   - 유지보수 상태 (최근 커밋, 스타 수, 오픈 이슈)
   - 실제 포함 기능 (README 주장 말고 기능 목록)
   - 치명 결함: 외부 SaaS 종속, 무거운 피어 의존성
3. **비교 제시**: 진행 전에 사용자에게 짧게 보여준다:
   - "가져다 수정" — 후보명, 아끼는 작업량, 뜯어낼 것
   - "직접 구현" — 예상 규모, 유리한 경우
   - 추천 1개 + 이유 한 줄
4. **결정 후 진행**. 조사 결과는 프로젝트 docs에 남긴다 (커밋 여부는 사용자 규칙 따름).

## Guardrails

- 후보 정보는 반드시 저장소를 직접 fetch해서 확인한 것만 보고 (자체 지식으로 스타 수·기능 단정 금지).
- 후보가 정말 없으면 "없음 — 직접 구현이 맞음" 한 줄로 끝내고 바로 구현. 조사를 핑계로 늘어지지 않는다.

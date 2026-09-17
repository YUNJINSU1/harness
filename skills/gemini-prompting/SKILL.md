---
name: gemini-prompting
description: Gemini 3 계열(3.1 Pro, 3.x Flash)에 보낼 프롬프트를 작성·교정할 때 사용한다. Claude·GPT용 프롬프트를 그대로 넘기면 품질이 떨어지므로, thinking 수준 선택과 지시 배치를 이 규칙대로 정한다. 사용자가 "제미니 프롬프트", "제미니한테 시킬 것", "1M 컨텍스트로 조사", "제미니로 넘겨"라고 하거나 `omp --model google-antigravity/...` 호출문을 작성할 때 적용한다.
---

# Gemini 프롬프트 작성

Gemini 3은 추론 모델이고, **Claude·GPT와 반대 방향으로** 프롬프트해야 한다. 장문의 구조화된 지시는 Claude에서 이득이지만 Gemini에서는 과잉 분석을 유발한다. 공식 가이드의 표현은 "It may over-analyze verbose or overly complex prompt engineering techniques used for older models"다.

## 1. thinking 수준을 먼저 정한다

기본값과 지원 범위가 모델마다 다르다. 지정하지 않았을 때의 기본값과 각 모델이 허용하는 `thinking_level`을 사전에 명시해 둔다.

| 모델 | 지원 범위 | 기본값 | 비고 |
| --- | --- | --- | --- |
| `gemini-3.1-pro` | `low`, `high` | `high` | `medium`, `minimal` 미지원 |
| `gemini-3-pro` | `low`, `high` | `high` | `medium`, `minimal` 미지원 |
| `gemini-3.8-flash` | `low`, `medium`, `high` | **`medium`** | **`minimal` 지정 시 API 검증 오류 발생** |
| `gemini-3.7-flash` | `minimal`, `low`, `medium`, `high` | `high` | `minimal` 지원 |
| `gemini-3.5-flash` / `3.6-flash` | `minimal`, `low`, `medium`, `high` | `high` | `minimal` 지원 |
| `gemini-3-flash` | `minimal`, `low`, `medium`, `high` | `high` | `minimal` 지원 |
| `gemini-3.1-flash-lite` | `minimal`, `low`, `medium`, `high` | `minimal` | 초경량 모델 |
| `claude-opus-4-5` / `4-6` (antigravity) | `minimal`, `low`, `medium`, `high` | `medium` | antigravity 경유 시 |
| `claude-sonnet-4-5` / `4-6` (antigravity) | `minimal`, `low`, `medium`, `high` | `medium` | antigravity 경유 시 |

OMP 카탈로그(`omp models google-antigravity`)는 `gemini-3.8-flash`가 `minimal`을 지원한다고 표기하지만 **틀렸다.** 실제로 호출하면 오류도 없이 멈춘다(2026-09 실측: 100초 타임아웃, 출력 0바이트). 카탈로그의 지원 범위를 근거로 삼지 않고 위 표를 따른다.

검색 그라운딩(`providers.webSearchGeminiModel`)에는 thinking을 지정할 수 없다. `web/search/providers/gemini.ts`가 설정값을 그대로 API 모델 ID로 넘기므로 `:high` 같은 접미사를 붙이면 존재하지 않는 모델을 부르게 된다. 모델명만 적고, 그 모델의 기본값으로 돈다고 전제한다.

| 작업 | 수준 | 근거 |
| --- | --- | --- |
| 형식이 엄격한 추출·변환·분류, 목록화, 라우팅 | **`low`** | 높은 수준은 "표가 더 낫겠다"고 스스로 판단해 형식을 바꾼다 |
| 대량 파일 훑기, 요약 | `low` ~ `medium` | 판단보다 처리량이 목적 |
| 근본 원인 진단, 아키텍처 검토, 수학·논리 | `high` | 다단계 추론에서만 값을 한다 |

**형식 준수와 추론 깊이는 상충한다.** 둘 다 필요하면 작업을 쪼개 깊은 추론은 `high`로 받고, 그 결과를 `low` 호출로 형식화한다. 한 번에 요구하지 않는다.

## 2. 지시는 짧게, 데이터 뒤에

- **짧고 직접적으로.** 역할 연기, 감정적 설득, "단계별로 생각해봐" 같은 유도는 제거한다. 추론은 `thinking_level`이 담당하므로 프롬프트로 유도할 필요가 없다.
- **대용량 입력은 샌드위치로.** 시스템 규칙(위) → 데이터(중간) → **질문(끝)**. 질문을 데이터 앞에 두지 않는다.
- 데이터에서 질문으로 넘어갈 때 `"Based on the preceding information..."`으로 앵커링한다.
- 출력은 기본이 간결하다. 길고 친절한 설명이 필요하면 **명시해야** 나온다.
- 표준 구조(JSON 스키마, Markdown 표)는 설명 없이 이해한다. 형식 규칙을 장황하게 풀어쓰지 않는다.

## 3. 부정 제약은 약하다 — 구조로 막는다

Gemini는 `"절대 X 하지 마"`를 Claude만큼 지키지 않는다. 상황이 그럴듯하면 어기고, 사고 흔적에 규칙을 인지했다고 적고도 어긴다. high에서 더 심하다.

그래서 금지는 프롬프트 문장이 아니라 **경계 자체**로 표현한다.

- 도구 설명에 부정 경계를 박는다. `"Searches files"` 대신 `"Search ONLY when the path is not already in context"`.
- 건드리면 안 되는 대상은 애초에 주지 않는다. 읽기 전용 경로로 넘기거나 입력에서 뺀다.
- 지켜야 할 게 많으면 프롬프트를 늘리지 말고 호출을 쪼갠다.

## 4. temperature를 건드리지 않는다

공식 권고는 **1.0 고정**이다. 결정론적 출력을 위해 낮추면 복잡한 작업에서 **루프와 성능 저하**를 일으킨다. 기존 코드에 명시적 temperature가 있으면 제거한다.

## 5. 맡기면 안 되는 일

| 금지 | 이유 |
| --- | --- |
| 코드 편집·diff 생성 | 들여쓰기 off-by-one, 줄 수 드리프트, `// ... 나머지 동일 ...` 플레이스홀더로 파일 훼손 |
| 서브에이전트(`task`/`scout`) 라우팅 | `google-antigravity` 공급자가 구조화 출력 요청에서 반환되지 않는다(2026-09 확인). 셸 호출만 쓴다 |
| 15턴 넘는 멀티턴 스레드 | 후반부에 부정 제약을 점진적으로 무시한다. 단계마다 새 호출로 끊고 상태는 파일에 둔다 |

## 6. 실행 형태

이 저장소에서 검증된 경로는 셸 호출이다.

```bash
omp --model 'google-antigravity/gemini-3.8-flash:low' -p '<프롬프트>'    # 대량 처리·형식 준수
omp --model 'google-antigravity/gemini-3.1-pro:high' -p '<프롬프트>'     # 심층 추론
```

모델 선택: 에이전틱 코딩·터미널 작업·대량 조사는 **3.8 Flash**(Terminal-Bench 2.1 약 90.8%), 대규모 다중파일 구조 파악과 학술적 추론은 **3.1 Pro**. Flash가 Pro보다 세대가 앞서므로 "Pro가 항상 위"라고 가정하지 않는다.

1M 컨텍스트는 needle 검색 열화가 거의 없어 RAG 없이 통째로 넣는 편이 낫다. 지식 컷오프는 2025-01이므로 그 이후 사실은 프롬프트로 주거나 검색을 붙인다.

대량 입력은 파일로 넘긴다. 프롬프트에 본문을 붙이면 샌드위치 순서가 깨지고 셸 인용도 위험하다.

```bash
# 데이터 먼저, 지시 마지막 — 6절의 샌드위치를 셸에서 그대로 지킨다
{ cat huge.log; echo; echo 'Based on the preceding log, list the three slowest operations. Output a plain list only.'; } |
  omp --model 'google-antigravity/gemini-3.8-flash:low' -p -
```

여러 파일을 같은 프롬프트로 돌릴 때는 순회한다. 한 호출에 몰아넣으면 파일 경계가 흐려져 출처를 되짚을 수 없다.

```bash
for f in reports/*.md; do
  omp --model 'google-antigravity/gemini-3.8-flash:low' -p "$(cat "$f")

Based on the preceding document, summarize it in three bullets. Bullets only." > "out/$(basename "${f%.md}").txt"
done
```

## 7. 검증

프롬프트를 고쳤다고 끝내지 않는다. 형식 준수가 목적이면 **같은 프롬프트를 `low`와 `high`로 각각 돌려 출력 형식을 대조**한다. 차이가 없으면 수준을 낮춰 지연과 한도를 아낀다.

출력 형식을 지정했으면 매번 확인한다. 파일로 받았으면 `head -5`나 `grep`으로 머리말·코드블록·번호가 섞이지 않았는지 본다. Gemini는 형식 지시를 스스로 "개선"하는 쪽으로 어기므로, 눈으로 보지 않으면 조용히 어긋난 출력을 그대로 쓰게 된다.

### 프롬프트 언어

영어로 바꿀 이유는 없다. 같은 작업을 한국어와 영어 지시로 대조했을 때(2026-09, 3.8 Flash `low`) 단순 추출은 출력이 동일했고, 제약이 다섯 개 겹친 로그 분석에서는 **영어 쪽이 원문 문장을 축약**해 한국어 쪽이 더 충실했다. 표본이 작아 한국어가 우월하다는 결론은 아니지만, 언어보다 지시의 정밀도가 지배적이다.

데이터가 영어면 지시도 영어로 맞춰 용어 번역이 끼어들지 않게 한다. 사람이 읽을 산출물이면 한국어로 쓰고 번역 단계를 없앤다.

## 출처

- [Gemini 3 개발자 가이드](https://ai.google.dev/gemini-api/docs/gemini-3) — 3.1 Pro·3 Flash의 thinking_level 표와 기본값, temperature 권고, 프롬프트 베스트 프랙티스, 지식 컷오프
- [Gemini 3.8 Flash 모델 문서](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-8-flash) — 3.8 Flash는 `low`/`medium`/`high`만 지원하고 기본이 `medium`, `minimal`은 검증 오류
- [Thinking 문서](https://ai.google.dev/gemini-api/docs/thinking) — thinking_level, thought signature
- [Gemini 3.1 Pro가 지시를 무시하는 문제 (Google AI 포럼)](https://discuss.ai.google.dev/t/gemini-3-1-pro-ignores-instructions-thoughts-on-the-thought-process/142075) — 추론 누출, 형식 지시 위반
- [philschmid.de, Gemini 3 프롬프트 실무](https://www.philschmid.de/gemini-3-prompt-practices) — 롱컨텍스트 샌드위치, 출력 장황함 제어

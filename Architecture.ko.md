# Ligand-vue Architecture

## 1. 전체 구조

```mermaid
graph TD
  subgraph 사용자_영역
    APP[App.vue<br/>nodes 스키마 선언<br/>formData 상태 관리]
    AI[adapters/index.ts<br/>어댑터 교체 지점]
  end

  subgraph Ligand_레이아웃
    LL[LigandLayout<br/>nodes 배열 순회]
    LR[LigandRenderer<br/>node.type 분기]
    LC[LigandCard<br/>컨테이너 · 재귀]
    LS[LigandSection<br/>시각적 구분]
    LB[LigandBlock<br/>CSS Grid]
  end

  subgraph Ligand_코어
    SR[LigandResolver<br/>FieldType 분기]
  end

  subgraph 어댑터
    NA[native adapter]
    PA[primevue adapter]
    VA[naive adapter]
  end

  subgraph UI_컴포넌트
    N_CELL[cells/native/*<br/>input · select · textarea ...]
    P_CELL[cells/primevue/*<br/>InputText · Select · DatePicker ...]
  end

  APP --> LL
  LL --> LR
  LR -->|type=card| LC
  LR -->|type=section| LS
  LR -->|type=block| LB
  LR -->|type=text/select/...| SR
  LC -->|children| LR
  LS --> LB
  LB --> SR

  AI --> NA & PA & VA
  SR -->|activeAdapter.cells| NA & PA & VA
  NA --> N_CELL
  PA --> P_CELL
```

---

## 2. 데이터 흐름 (위 → 아래)

```mermaid
sequenceDiagram
  participant App
  participant LigandLayout
  participant LigandRenderer
  participant LigandCard
  participant LigandBlock
  participant LigandResolver
  participant Cell as cells/native/LigandInputText

  App->>LigandLayout: :nodes="nodes"<br/>v-model="formData"
  LigandLayout->>LigandRenderer: :node="node"<br/>:model-value="formData"
  LigandRenderer->>LigandCard: :card="node"<br/>:model-value="formData"
  LigandCard->>LigandRenderer: :node="child"<br/>:model-value="formData"
  LigandRenderer->>LigandBlock: :block="node"<br/>:model-value="formData"
  LigandBlock->>LigandResolver: :schema="field"<br/>:model-value="formData[field.key]"
  LigandResolver->>Cell: :schema="field"<br/>v-model="formData[field.key]"

  Note over Cell: 사용자가 값 입력
```

---

## 3. 이벤트 흐름 (아래 → 위)

```mermaid
sequenceDiagram
  participant Cell as cells/native/LigandInputText
  participant LigandResolver
  participant LigandBlock
  participant LigandRenderer
  participant LigandCard
  participant LigandLayout
  participant App

  Cell->>LigandResolver: emit('update:modelValue', '입력값')
  LigandResolver->>LigandBlock: emit('update:modelValue', '입력값')
  LigandBlock->>LigandBlock: { ...modelValue, [field.key]: '입력값' }
  LigandBlock->>LigandRenderer: emit('update:modelValue', 새객체)
  LigandRenderer->>LigandCard: emit('update:modelValue', 새객체)
  LigandCard->>LigandRenderer: emit('update:modelValue', 새객체)
  LigandRenderer->>LigandLayout: emit('update:modelValue', 새객체)
  LigandLayout->>App: emit('update:modelValue', 새객체)
  App->>App: formData = 새객체

  Note over App: { name: '입력값' } 반영 완료
```

---

## 4. 어댑터 교체 메커니즘

```mermaid
graph LR
  subgraph 교체_전
    SR1[LigandResolver] -->|activeAdapter| NA[native adapter]
    NA --> NC[input · select · textarea]
  end

  subgraph 교체_후
    SR2[LigandResolver] -->|activeAdapter| PA[primevue adapter]
    PA --> PC[InputText · Select · DatePicker]
  end

  IDX[adapters/index.ts<br/>한 줄 교체] -.->|before| NA
  IDX -.->|after| PA

  Note1[스키마, LigandLayout,<br/>LigandRenderer 변경 없음]
```

---

## 핵심 원칙 요약

| 레이어 | 역할 | 교체 가능 여부 |
|---|---|---|
| `LigandLayout / Renderer / Card` | 노드 트리 순회 · 분기 | 교체 불필요 |
| `LigandBlock` | CSS Grid 배치 | 교체 불필요 |
| `LigandResolver` | FieldType → 셀 컴포넌트 선택 | 교체 불필요 |
| `adapters/index.ts` | 어떤 어댑터를 쓸지 결정 | **여기만 교체** |
| `cells/native/*` `cells/primevue/*` | 실제 UI 컴포넌트 래퍼 | 어댑터별 구현 |
| `tokens.css` | `--ligand-*` 디자인 토큰 | 값만 덮어쓰기 |

---

## 6. 주요 이점

### 🎯 프레임워크 독립성
- 스키마, 레이아웃, 렌더링 로직을 건드리지 않고 어댑터만 교체 가능
- Native HTML에서 PrimeVue, Naive UI로 최소한의 변경만으로 전환 가능

### 📦 조합 가능한 아키텍처
- 레이아웃 컴포넌트는 구조를 담당
- Resolver는 필드 타입 로직을 담당
- 어댑터는 프레임워크 통합을 담당
- 명확한 관심사 분리

### ♿ 접근성 및 테마
- `tokens.css`에 집중된 디자인 토큰 관리
- 어댑터 전반에 걸친 일관된 컴포넌트 동작
- CSS 변수를 통한 테마 전환 지원

### 🔄 양방향 바인딩
- 데이터는 최상위 상태에서 하위 컴포넌트로 흘러 내려감
- 사용자 입력은 이벤트 발행을 통해 위로 전달됨
- `App.vue` 또는 부모 컴포넌트가 단일 진실 공급원
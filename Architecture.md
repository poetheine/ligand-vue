# Ligand-vue Architecture

## 1. Overall Architecture

```mermaid
graph TD
  subgraph user_layer["User Layer"]
    APP["App.vue<br/>schema declaration<br/>form state management"]
    AI["adapters/index.ts<br/>adapter injection point"]
  end

  subgraph layout_layer["Layout System"]
    LL["LigandLayout<br/>iterates nodes array"]
    LR["LigandRenderer<br/>type branching"]
    LC["LigandCard<br/>container & recursion"]
    LS["LigandSection<br/>visual grouping"]
    LB["LigandBlock<br/>CSS Grid layout"]
  end

  subgraph core_layer["Core Engine"]
    SR["LigandResolver<br/>field type resolution"]
  end

  subgraph adapters_layer["Adapters"]
    NA["native adapter"]
    PA["primevue adapter"]
    VA["naive adapter"]
  end

  subgraph components_layer["UI Components"]
    N_CELL["cells/native/*<br/>input, select, textarea..."]
    P_CELL["cells/primevue/*<br/>InputText, Select, DatePicker..."]
  end

  APP --> LL
  LL --> LR
  LR -->|type=card| LC
  LR -->|type=section| LS
  LR -->|type=block| LB
  LR -->|field types| SR
  LC -->|children| LR
  LS --> LB
  LB --> SR

  AI --> NA & PA & VA
  SR -->|activeAdapter.cells| NA & PA & VA
  NA --> N_CELL
  PA --> P_CELL
```

---

## 2. Data Flow (Top-Down)

```mermaid
sequenceDiagram
  participant App
  participant LigandLayout
  participant LigandRenderer
  participant LigandCard
  participant LigandBlock
  participant LigandResolver
  participant Cell as cells/native

  App->>LigandLayout: :nodes="nodes"<br/>v-model="formData"
  LigandLayout->>LigandRenderer: :node="node"<br/>:modelValue="formData"
  LigandRenderer->>LigandCard: :card="node"<br/>:modelValue="formData"
  LigandCard->>LigandRenderer: :node="child"<br/>:modelValue="formData"
  LigandRenderer->>LigandBlock: :block="node"<br/>:modelValue="formData"
  LigandBlock->>LigandResolver: :schema="field"<br/>:modelValue="formData[key]"
  LigandResolver->>Cell: :schema="field"<br/>v-model="formData[key]"

  Note over Cell: User input
```

---

## 3. Event Flow (Bottom-Up)

```mermaid
sequenceDiagram
  participant Cell as cells/native
  participant LigandResolver
  participant LigandBlock
  participant LigandRenderer
  participant LigandCard
  participant LigandLayout
  participant App

  Cell->>LigandResolver: emit('update:modelValue', value)
  LigandResolver->>LigandBlock: emit('update:modelValue', value)
  LigandBlock->>LigandBlock: { ...modelValue, [key]: value }
  LigandBlock->>LigandRenderer: emit('update:modelValue', newObject)
  LigandRenderer->>LigandCard: emit('update:modelValue', newObject)
  LigandCard->>LigandRenderer: emit('update:modelValue', newObject)
  LigandRenderer->>LigandLayout: emit('update:modelValue', newObject)
  LigandLayout->>App: emit('update:modelValue', newObject)
  App->>App: formData = newObject

  Note over App: State update complete
```

---

## 4. Adapter Switching Mechanism

```mermaid
graph LR
  subgraph before["Before"]
    SR1["LigandResolver"] -->|activeAdapter| NA["native adapter"]
    NA --> NC["&lt;input&gt;, &lt;select&gt;, &lt;textarea&gt;"]
  end

  subgraph after["After"]
    SR2["LigandResolver"] -->|activeAdapter| PA["primevue adapter"]
    PA --> PC["InputText, Select, DatePicker"]
  end

  IDX["adapters/index.ts<br/>(one-line change)"] -.->|switch| NA
  IDX -.->|switch| PA

  Note1["Schema, Layout, Renderer<br/>remain unchanged"]
```

---

## 5. Core Principles

| Layer | Responsibility | Replaceable |
|-------|---|---|
| `LigandLayout` / `Renderer` / `Card` | Node tree traversal & branching | ❌ Not needed |
| `LigandBlock` | CSS Grid layout & field arrangement | ❌ Not needed |
| `LigandResolver` | Field type → cell component selection | ❌ Not needed |
| `adapters/index.ts` | Adapter selection | ✅ **Change here only** |
| `cells/native/*` `cells/primevue/*` | UI component implementations | Per-adapter |
| `assets/tokens.css` | Design tokens (`--ligand-*`) | Override values |

---

## 6. Key Benefits

### 🎯 Framework Agnostic
- Replace adapters without touching schema, layout, or rendering logic
- Switch from native HTML to PrimeVue to Naive UI with minimal changes

### 📦 Composable Architecture
- Layout components handle structure
- Resolvers handle field type logic
- Adapters handle framework integration
- Clear separation of concerns

### ♿ Accessibility & Theming
- Centralized design tokens in `tokens.css`
- Consistent component behavior across adapters
- Theme switching supported via CSS variables

### 🔄 Two-way Binding
- Data flows from top-level state down through components
- User input bubbles up through event emission
- Single source of truth in `App.vue` or parent component

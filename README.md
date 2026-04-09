# Ligand-vue

> **UI is where data passes through.**

A schema-driven UI library for Vue 3. Define your form structure as a data schema, and Ligand-vue handles rendering, two-way binding, and framework integration — without touching your layout or logic when you swap UI frameworks.

---

## Concept

Ligand-vue is built on a single idea: UI is not a destination, it is a passthrough structure for data. The schema declares *what* to render. The adapter decides *how* to render it. The two never need to meet.

---

## Features

- 📐 **Schema-driven layout** — declare UI structure as plain data
- 🔄 **Two-way binding** — data flows down, events bubble up, single source of truth
- 🔌 **Adapter pattern** — swap between native HTML, PrimeVue, or Naive UI with a one-line change
- 🧩 **Composable architecture** — layout, resolution, and adaptation are fully separated concerns
- 🎨 **Design token system** — centralized `--lig-*` CSS variables, Shadow DOM compatible

---

## Installation

> ⚠️ npm package coming soon.

For now, clone the repository and reference locally:

```bash
git clone https://github.com/poetheine/ligand-vue.git
```

---

## Quick Start

```ts
// Define your schema
const nodes: LigandNode[] = [
  {
    type: 'card',
    key: 'scene',
    title: 'Scene #1',
    children: [
      {
        type: 'block',
        variant: 'table',
        columns: 4,
        fields: [
          { type: 'text', key: 'title', label: 'Scene Title', span: 2 },
          { type: 'date', key: 'shootDate', label: 'Shoot Date', required: true },
          { type: 'select', key: 'sceneType', label: 'Scene Type', required: true,
            options: [
              { label: 'INT', value: 'INT' },
              { label: 'EXT', value: 'EXT' },
            ]
          },
        ],
      },
    ],
  },
]

// Bind in your component
const formData = ref({})
```

```vue
<LigandLayout :nodes="nodes" v-model="formData" />
```

---

## Adapter Switching

All adapter configuration lives in one file:

```ts
// src/ligand/adapters/index.ts
export { adapter } from './primevue'  // ← change this line only
```

Schema, layout, and rendering logic remain untouched.

---

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full diagrams covering:

- Overall component hierarchy
- Top-down data flow
- Bottom-up event propagation
- Adapter switching mechanism
- Core principles and layer responsibilities

---

## Node Hierarchy

```
card → section → block → field
```

`LigandBlock` supports a `table` variant with `subBlocks` for grouped field sections.

---

## Design Tokens

All visual variables follow the `--lig-*` prefix and are declared in `assets/tokens.css`. They penetrate Shadow DOM boundaries, keeping the library compatible with the Web Components roadmap.

---

## License

Copyright (c) 2025 Poetheine Studio

Licensed under the [MIT License](./LICENSE).
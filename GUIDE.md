# Ligand User Guide

Ligand is a Vue 3 component system built around **Schema-Driven UI** and **adapter-based framework switching**.
You can use it with or without schema definitions, and swap the UI framework by changing a single adapter line.


## Core Concept

```
Schema (FieldSchema)         <- describes what to render
      ↓
LigandResolver               <- selects cell component from schema type
      ↓
activeAdapter.cells[type]    <- adapter provides concrete UI component
      ↓
cells/native/ or             <- implementation by UI framework
cells/primevue/ or
cells/naive/ ...
```

UI is the layer that data passes through. Ligand is designed to control that flow.


## Getting Started

```bash
npm install
npm run dev
```

The default adapter is `native` (no external UI dependency).


## Switching Adapters

Swap one line in `src/adapters/index.ts` to switch the entire UI framework.

```ts
// Switch to PrimeVue
import { primevueAdapter } from './primevue.adapter'
export const activeAdapter = primevueAdapter
```

Then install the required package.

```bash
# PrimeVue
npm install primevue

# Naive UI
npm install naive-ui
```

You do not need to modify `main.ts`, `LigandResolver`, or schema type definitions.


## Creating a New Adapter

Add a new adapter file under `src/adapters/`.

```ts
// src/adapters/my-ui.adapter.ts
import { defineAsyncComponent } from 'vue'
import type { LigandAdapter } from '@/types'

export const myAdapter: LigandAdapter = {
  name: 'my-ui',

  install(app) {
    // Framework initialization (leave empty if unnecessary)
  },

  cells: {
    text:     defineAsyncComponent(() => import('@/components/cells/my-ui/LigandInputText.vue')),
    number:   defineAsyncComponent(() => import('@/components/cells/my-ui/LigandInputNumber.vue')),
    select:   defineAsyncComponent(() => import('@/components/cells/my-ui/LigandSelect.vue')),
    checkbox: defineAsyncComponent(() => import('@/components/cells/my-ui/LigandCheckbox.vue')),
    date:     defineAsyncComponent(() => import('@/components/cells/my-ui/LigandDatePicker.vue')),
    textarea: defineAsyncComponent(() => import('@/components/cells/my-ui/LigandTextarea.vue')),
  },
}
```

Implement the `LigandAdapter` interface in `src/types/adapter.types.ts`.


## Schema Types

```ts
import type { FieldSchema } from '@/types'
```

| type | component | notable extra props |
|---|---|---|
| `text` | LigandInputText | `placeholder` |
| `number` | LigandInputNumber | `min`, `max` |
| `select` | LigandSelect | `options: { label, value }[]` |
| `checkbox` | LigandCheckbox | — |
| `date` | LigandDatePicker | `minDate`, `maxDate` |
| `textarea` | LigandTextarea | `rows` |

Common props: `key`, `label`, `placeholder`, `disabled`, `readonly`, `required`


## Using LigandResolver

```vue
<LigandResolver v-model="formData[field.key]" :schema="field" />
```

You can also render cell components directly without schema.

```vue
<LigandInputText v-model="name" :schema="{ type: 'text', key: 'name', label: 'Name' }" />
```


## Using with Nuxt

Initialize the adapter in a Nuxt plugin instead of `main.ts`.

```ts
// plugins/ligand.ts
import { activeAdapter } from '@/adapters'

export default defineNuxtPlugin((nuxtApp) => {
  activeAdapter.install(nuxtApp.vueApp)
})
```

The rest of the structure remains the same.


## i18n (Optional)

A starter configuration is available in `src/i18n/index.ts`.

```bash
npm install vue-i18n
```

Uncomment `src/i18n/index.ts` and register it in `main.ts`.

```ts
import { i18n } from './i18n'
app.use(i18n)
```


## Directory Structure

```
src/
├── adapters/
│   ├── index.ts               <- adapter switch point (main edit point)
│   ├── native.adapter.ts
│   ├── primevue.adapter.ts
│   └── naive.adapter.ts
├── assets/
│   └── tokens.css             <- --ligand-* CSS Custom Properties
├── components/
│   ├── resolver/
│   │   └── LigandResolver.vue <- schema -> cell component routing
│   └── cells/
│       ├── native/            <- native HTML elements
│       ├── primevue/          <- PrimeVue-based
│       └── naive/             <- Naive UI-based
├── i18n/
│   ├── index.ts
│   └── locales/
│       ├── ko.json
│       └── en.json
├── types/
│   ├── schema.types.ts        <- FieldSchema definitions
│   ├── adapter.types.ts       <- LigandAdapter interface
│   └── index.ts
├── App.vue
└── main.ts
```


## License

BUSL-1.1 - see the `LICENSE` file.


## Install as a Package

```bash
npm install ligand
```

**`main.ts` (or a Nuxt plugin)**

```ts
import { createApp } from 'vue'
import { primevueAdapter } from 'ligand'
import App from './App.vue'

const app = createApp(App)
primevueAdapter.install(app)
app.mount('#app')
```

**In a component**

```vue
<script setup lang="ts">
import { LigandLayout } from 'ligand'
import type { LigandSection } from 'ligand'

const sections: LigandSection[] = [
  {
    type: 'section',
    title: 'Basic Information',
    blocks: [
      {
        type: 'block',
        columns: 2,
        fields: [
          { type: 'text',   key: 'name',  label: 'Name' },
          { type: 'select', key: 'grade', label: 'Grade',
            options: [{ label: 'General', value: 'normal' }] },
        ],
      },
    ],
  },
]

const formData = reactive({})
</script>

<template>
  <LigandLayout :sections="sections" v-model="formData" />
</template>
```

**Custom adapter implementation**

```ts
import type { LigandAdapter } from 'ligand'

export const myAdapter: LigandAdapter = {
  name: 'my-ui',
  install(app) { /* ... */ },
  cells: { /* ... */ },
}
```

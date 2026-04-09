// ── Adapter switch point ──────────────────────────────────────
// Changing this single line swaps the entire UI framework.
//
// Built-in adapters:
//   nativeAdapter   — no external dependency, plain HTML elements
//   primevueAdapter — requires primevue
//   naiveAdapter    — requires naive-ui
//
// You can also provide and activate your own adapter:
//   import { myAdapter } from './my.adapter'

import { adapterNative } from '@/ligand/adapters/native.adapter'
// import { primevueAdapter } from '@/ligand/adapters/primevue.adapter'

export const activeAdapter = adapterNative
// export const activeAdapter = primevueAdapter

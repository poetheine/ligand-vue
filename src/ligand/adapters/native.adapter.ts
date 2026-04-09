import { defineAsyncComponent } from 'vue'
import type { LigandAdapter } from '@/ligand/types'

/**
 * Native Adapter
 * Uses only native HTML elements with no external UI dependency.
 * Best for internal testing, lightweight bundles, or early-stage projects.
 */
export const adapterNative: LigandAdapter = {
  name: 'native',

  install(_app) {
    // No framework install step required.
  },

  cells: {
    text:     defineAsyncComponent(() => import('@/ligand/components/cells/native/LigandInputText.vue')),
    number:   defineAsyncComponent(() => import('@/ligand/components/cells/native/LigandInputNumber.vue')),
    select:   defineAsyncComponent(() => import('@/ligand/components/cells/native/LigandSelect.vue')),
    checkbox: defineAsyncComponent(() => import('@/ligand/components/cells/native/LigandCheckbox.vue')),
    'radio-group': defineAsyncComponent(() => import('@/ligand/components/cells/native/LigandRadioGroup.vue')),
    'checkbox-group': defineAsyncComponent(() => import('@/ligand/components/cells/native/LigandCheckboxGroup.vue')),
    date:     defineAsyncComponent(() => import('@/ligand/components/cells/native/LigandDatePicker.vue')),
    textarea: defineAsyncComponent(() => import('@/ligand/components/cells/native/LigandTextarea.vue')),
  },
}

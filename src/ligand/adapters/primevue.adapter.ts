import { defineAsyncComponent } from 'vue'
import type { LigandAdapter } from '@/ligand/types'

/**
 * PrimeVue Adapter
 * Dependency: primevue
 * Runs with `unstyled: true` so styles are controlled by `--ligand-*` tokens.
 */
export const adapterPrimeVue: LigandAdapter = {
  name: 'primevue',

  install(app) {
    // Dynamic import keeps builds valid when primevue is not installed.
    import('primevue/config').then(({ default: PrimeVue }) => {
      app.use(PrimeVue, {
        unstyled: true,
        ripple: false,
      })
    })
  },

  cells: {
    text:     defineAsyncComponent(() => import('@/ligand/components/cells/primevue/LigandInputText.vue')),
    number:   defineAsyncComponent(() => import('@/ligand/components/cells/primevue/LigandInputNumber.vue')),
    select:   defineAsyncComponent(() => import('@/ligand/components/cells/primevue/LigandSelect.vue')),
    checkbox: defineAsyncComponent(() => import('@/ligand/components/cells/primevue/LigandCheckbox.vue')),
    'radio-group': defineAsyncComponent(() => import('@/ligand/components/cells/primevue/LigandRadioGroup.vue')),
    'checkbox-group': defineAsyncComponent(() => import('@/ligand/components/cells/primevue/LigandCheckboxGroup.vue')),
    date:     defineAsyncComponent(() => import('@/ligand/components/cells/primevue/LigandDatePicker.vue')),
    textarea: defineAsyncComponent(() => import('@/ligand/components/cells/primevue/LigandTextarea.vue')),
  },
}

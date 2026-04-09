<script setup lang="ts">
import { computed } from 'vue'
import { activeAdapter } from '@/adapters'
import type { FieldSchema, LigandMode } from '@/ligand/types'

const props = defineProps<{
  schema: FieldSchema
  mode?: LigandMode
}>()

const model = defineModel<unknown>()

const cell = computed(() => activeAdapter.cells[props.schema.type])

// In view mode, map select-like values to their display labels.
const displayValue = computed(() => {
  if (props.schema.type === 'select') {
    const opt = props.schema.options.find(o => o.value === model.value)
    return opt?.label ?? model.value ?? '-'
  }
  if (props.schema.type === 'radio-group') {
    const opt = props.schema.options.find(o => o.value === model.value)
    return opt?.label ?? model.value ?? '-'
  }
  if (props.schema.type === 'checkbox-group') {
    const values = (model.value as (string | number)[]) ?? []
    const labels = values
      .map(v => props.schema.options.find(o => o.value === v)?.label ?? v)
      .filter(Boolean)
    return labels.length > 0 ? labels.join(', ') : '-'
  }
  if (props.schema.type === 'checkbox') {
    return model.value ? 'Y' : 'N'
  }
  return model.value ?? '-'
})
</script>

<template>
  <!-- View mode: display value only -->
  <div v-if="mode === 'view'" class="lig-field-view">
    {{ displayValue }}
  </div>

  <!-- Edit mode: render input component -->
  <component v-else :is="cell" v-model="model" :schema="schema" />
</template>

<style scoped>
.lig-field-view {
  min-height: var(--ligand-field-height);
  display: flex;
  align-items: center;
  font-size: var(--ligand-font-size-md);
  color: var(--ligand-color-text);
  padding: var(--ligand-field-padding-y) 0;
}
</style>
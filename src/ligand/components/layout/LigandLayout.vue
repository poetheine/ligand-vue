<script setup lang="ts">
import LigandRenderer from './LigandRenderer.vue'
import type { LigandNode, LigandMode } from '@/ligand/types'

const props = defineProps<{
  nodes: LigandNode[]
  modelValue?: Record<string, unknown>
  mode?: LigandMode
  fieldModes?: Record<string, LigandMode>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
}>()

function onUpdate(value: Record<string, unknown>) {
  emit('update:modelValue', { ...props.modelValue, ...value })
}
</script>

<template>
  <div class="ligand-layout" :class="`ligand-layout--${mode ?? 'edit'}`">
    <LigandRenderer
      v-for="(node, i) in nodes"
      :key="i"
      :node="node"
      :model-value="modelValue"
      :mode="mode"
      :field-modes="fieldModes"
      @update:model-value="onUpdate"
    >
      <!-- Auto-forward all parent slots downward -->
      <template v-for="(_, slotName) in $slots" #[slotName]>
        <slot :name="slotName" />
      </template>
    </LigandRenderer>
  </div>
</template>

<style scoped>
.ligand-layout {
  display: flex;
  flex-direction: column;
  gap: var(--ligand-spacing-lg);
}

/* Global visual tone for view mode */
.ligand-layout--view :deep(.ligand-block__field-label) {
  color: var(--ligand-color-text-muted);
}
</style>
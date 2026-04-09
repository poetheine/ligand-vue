<script setup lang="ts">
import type { LigandCard, LigandMode } from '@/ligand/types'

// This file and `LigandRenderer` are mutually recursive.
// Use `defineAsyncComponent` to lazy-load and break the cycle.
import { defineAsyncComponent } from 'vue'
const LigandRenderer = defineAsyncComponent(() => import('@/ligand/components/layout/LigandRenderer.vue'))

const props = defineProps<{
  card: LigandCard
  modelValue?: Record<string, unknown>
  mode?: LigandMode
  fieldModes?: Record<string, LigandMode>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
}>()

function onChildUpdate(value: Record<string, unknown>) {
  emit('update:modelValue', { ...props.modelValue, ...value })
}
</script>

<template>
  <div class="ligand-card">
    <div v-if="card.title" class="ligand-card__header">
      {{ card.title }}
    </div>
    <div class="ligand-card__body">
      <!--
        Pass `children` back into `LigandRenderer`.
        This is where recursion is composed:
          LigandCard → LigandRenderer → LigandCard → ...
      -->
      <LigandRenderer
        v-for="(child, i) in card.children"
        :key="i"
        :node="child"
        :model-value="modelValue"
        :mode="mode"
        :field-modes="fieldModes"
        @update:model-value="onChildUpdate"
      >
        <!-- Auto-forward parent slots to children -->
        <template v-for="(_, slotName) in $slots" #[slotName]>
          <slot :name="slotName" />
        </template>
      </LigandRenderer>
    </div>
  </div>
</template>

<style scoped>
.ligand-card {
  border: 1px solid var(--ligand-color-border);
  border-radius: var(--ligand-border-radius-lg);
  overflow: hidden;
}

.ligand-card__header {
  padding: var(--ligand-spacing-sm) var(--ligand-spacing-md);
  font-size: var(--ligand-font-size-md);
  font-weight: var(--ligand-font-weight-bold);
  border-bottom: 1px solid var(--ligand-color-border);
  background: var(--ligand-color-background);
}

.ligand-card__body {
  padding: var(--ligand-spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--ligand-spacing-lg);
}
</style>
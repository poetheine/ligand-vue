<script setup lang="ts">
import LigandBlock from './LigandBlock.vue'
import type { LigandSection, LigandMode } from '@/ligand/types'

const props = defineProps<{
  section: LigandSection
  modelValue?: Record<string, unknown>
  mode?: LigandMode
  fieldModes?: Record<string, LigandMode>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
}>()

function onBlockUpdate(value: Record<string, unknown>) {
  emit('update:modelValue', { ...props.modelValue, ...value })
}
</script>

<template>
  <section class="ligand-section">
    <div v-if="section.title" class="ligand-section__title">
      {{ section.title }}
    </div>
    <div class="ligand-section__body">
      <LigandBlock
        v-for="(block, i) in section.blocks"
        :key="i"
        :block="block"
        :model-value="modelValue"
        :mode="mode"
        :field-modes="fieldModes"
        @update:model-value="onBlockUpdate"
      >
        <!-- Auto-forward parent slots to children -->
        <template v-for="(_, slotName) in $slots" #[slotName]>
          <slot :name="slotName" />
        </template>
      </LigandBlock>
    </div>
  </section>
</template>

<style scoped>
.ligand-section {
  border: 1px solid var(--ligand-color-border);
  border-radius: var(--ligand-border-radius-lg);
  overflow: hidden;
}

.ligand-section__title {
  padding: var(--ligand-spacing-sm) var(--ligand-spacing-md);
  font-size: var(--ligand-font-size-md);
  font-weight: var(--ligand-font-weight-bold);
  border-bottom: 1px solid var(--ligand-color-border);
  background: var(--ligand-color-background);
}

.ligand-section__body {
  padding: var(--ligand-spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--ligand-spacing-lg);
}
</style>
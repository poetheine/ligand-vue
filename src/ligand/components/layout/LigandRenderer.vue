<script setup lang="ts">
import { computed, defineAsyncComponent, useSlots } from 'vue'
import type { Slots } from 'vue'
import { FIELD_TYPES } from '@/ligand/types'
import type { LigandNode, LigandMode, FieldSchema } from '@/ligand/types'

import LigandCard    from './LigandCard.vue'
import LigandSection from './LigandSection.vue'
import LigandBlock   from './LigandBlock.vue'
import LigandResolver   from '@/ligand/components/resolver/LigandResolver.vue'

const LigandTextBlock = defineAsyncComponent(() => import('../content/LigandTextBlock.vue'))
const LigandImage     = defineAsyncComponent(() => import('../content/LigandImage.vue'))
const LigandMarkdown  = defineAsyncComponent(() => import('../content/LigandMarkdown.vue'))
const LigandDivider   = defineAsyncComponent(() => import('../content/LigandDivider.vue'))

const props = defineProps<{
  node: LigandNode
  modelValue?: Record<string, unknown>
  mode?: LigandMode
  fieldModes?: Record<string, LigandMode>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
}>()

const slots = useSlots() as Slots

const currentMode = computed(() => props.mode ?? 'edit')

// If a card has `key`, pass only that scoped slice of data.
const cardModelValue = computed(() => {
  if (props.node.type !== 'card' || !props.node.key) return props.modelValue
  return (props.modelValue?.[props.node.key] ?? {}) as Record<string, unknown>
})

function onCardUpdate(value: Record<string, unknown>) {
  const card = props.node
  if (card.type !== 'card' || !card.key) {
    emit('update:modelValue', { ...props.modelValue, ...value })
  } else {
    emit('update:modelValue', {
      ...props.modelValue,
      [card.key]: { ...(props.modelValue?.[card.key] as object ?? {}), ...value },
    })
  }
}

function onUpdate(value: Record<string, unknown>) {
  emit('update:modelValue', { ...props.modelValue, ...value })
}

function onFieldUpdate(key: string, value: unknown) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const isField = computed(() =>
  (FIELD_TYPES as readonly string[]).includes(props.node.type)
)

// Field mode resolution: prefer `fieldModes`, fall back to `currentMode`.
const resolvedFieldMode = computed<LigandMode>(() => {
  if (!isField.value) return currentMode.value
  const key = (props.node as { key: string }).key
  return props.fieldModes?.[key] ?? currentMode.value
})
</script>

<template>
  <!-- Card: pass scoped `modelValue` when key exists -->
  <LigandCard
    v-if="node.type === 'card'"
    :card="node"
    :model-value="cardModelValue"
    :mode="currentMode"
    :field-modes="fieldModes"
    @update:model-value="onCardUpdate"
  >
    <!-- Auto-forward parent slots to children -->
    <template v-for="(_, slotName) in slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </LigandCard>

  <!-- Section -->
  <LigandSection
    v-else-if="node.type === 'section'"
    :section="node"
    :model-value="modelValue"
    :mode="currentMode"
    :field-modes="fieldModes"
    @update:model-value="onUpdate"
  >
    <!-- Auto-forward parent slots to children -->
    <template v-for="(_, slotName) in slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </LigandSection>

  <!-- Block -->
  <LigandBlock
    v-else-if="node.type === 'block'"
    :block="node"
    :model-value="modelValue"
    :mode="currentMode"
    :field-modes="fieldModes"
    @update:model-value="onUpdate"
  >
    <!-- Auto-forward parent slots to children -->
    <template v-for="(_, slotName) in slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </LigandBlock>

  <!-- Field -->
  <template v-else-if="isField">
    <!-- Render slot when available; otherwise render default field -->
    <slot
      v-if="slots[(node as FieldSchema).key]"
      :name="(node as FieldSchema).key"
      :model-value="modelValue?.[(node as FieldSchema).key]"
      @update:model-value="onFieldUpdate((node as FieldSchema).key, $event)"
    />
    <LigandResolver
      v-else
      :schema="node as FieldSchema"
      :model-value="modelValue?.[(node as FieldSchema).key]"
      :mode="resolvedFieldMode"
      @update:model-value="onFieldUpdate((node as FieldSchema).key, $event)"
    />
  </template>

  <!-- Content nodes -->
  <LigandTextBlock v-else-if="node.type === 'text-block'" :node="node" />
  <LigandImage     v-else-if="node.type === 'image'"      :node="node" />
  <LigandMarkdown  v-else-if="node.type === 'markdown'"   :node="node" />
  <LigandDivider   v-else-if="node.type === 'divider'" />
</template>
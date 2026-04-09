<script setup lang="ts">
import { computed, useSlots } from 'vue'
import LigandResolver from '@/ligand/components/resolver/LigandResolver.vue'
import type { LigandBlock, LigandSubBlock, LigandMode, FieldSchema } from '@/ligand/types'

const props = defineProps<{
  block: LigandBlock
  modelValue?: Record<string, unknown>
  mode?: LigandMode
  /** Permission-based per-field mode override map. */
  fieldModes?: Record<string, LigandMode>
}>()

const slots = useSlots()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
}>()

function onUpdate(key: string, value: unknown, parentKey?: string) {
  if (parentKey) {
    const parentData = (props.modelValue?.[parentKey] as Record<string, unknown>) ?? {}
    emit('update:modelValue', { ...props.modelValue, [parentKey]: { ...parentData, [key]: value } })
  } else {
    emit('update:modelValue', { ...props.modelValue, [key]: value })
  }
}

/**
 * Field mode priority:
 * 1. `field.mode` (schema-level explicit override)
 * 2. `fieldModes[key]` (injected permission map)
 * 3. `props.mode` (parent layout mode)
 * 4. `'edit'` (default)
 */
function resolveFieldMode(fieldKey: string, fieldMode?: LigandMode): LigandMode {
  // When `fieldModes` is injected (permission control active),
  // ignore schema hardcoding and prioritize permission mapping.
  if (props.fieldModes && Object.keys(props.fieldModes).length > 0) {
    return props.fieldModes[fieldKey] ?? props.mode ?? 'edit'
  }
  // Without `fieldModes` (manual mode control),
  // preserve the standard field-first precedence.
  return fieldMode ?? props.mode ?? 'edit'

  
  /*
  return fieldMode
    ?? props.fieldModes?.[fieldKey]
    ?? props.mode
    ?? 'edit' */
}

// Convert flat field list into row groups.
// Fields with `span >= 2` always get their own row.
type FieldRow = { fields: FieldSchema[]; isSingle: boolean }

function toRows(fields: FieldSchema[]): FieldRow[] {
  const rows: FieldRow[] = []
  let i = 0
  while (i < fields.length) {
    const field = fields[i]
    const isFullSpan = (field.span ?? 1) >= 2
    if (isFullSpan) {
      rows.push({ fields: [field], isSingle: true })
      i++
    } else if (i + 1 < fields.length && (fields[i + 1].span ?? 1) < 2) {
      rows.push({ fields: [field, fields[i + 1]], isSingle: false })
      i += 2
    } else {
      rows.push({ fields: [field], isSingle: true })
      i++
    }
  }
  return rows
}

const mainRows = computed(() => toRows(props.block.fields))
const subRows  = computed(() =>
  (props.block.subBlocks ?? []).map(sb => ({
    ...sb,
    rows: toRows(sb.fields),
  }))
)

const labelWidthPx = computed(() => {
  const w = props.block.labelWidth ?? 160
  return typeof w === 'number' ? `${w}px` : w
})

const cssVars = computed(() => ({
  '--label-width':    labelWidthPx.value,
  '--ligand-columns': props.block.columns,
}))
</script>

<template>
  <div
    class="ligand-block"
    :class="block.variant === 'table' ? 'ligand-block--table' : 'ligand-block--default'"
    :style="cssVars"
  >
    <!-- ── Block title ───────────────────────────────── -->
    <div v-if="block.label" class="ligand-block__title">
      {{ block.label }}
    </div>

    <!-- ── Main field rows ───────────────────────────── -->
    <div
      v-for="(row, ri) in mainRows"
      :key="`main-${ri}`"
      class="ligand-block__row"
      :class="{ 'ligand-block__row--single': row.isSingle }"
    >
      <template v-for="field in row.fields" :key="field.key">
        <div
          class="ligand-block__label"
          :class="{ 'ligand-block__label--required': field.required }"
        >
          {{ field.label }}
        </div>
        <div class="ligand-block__value">
          <!-- Render slot when available; otherwise use default field -->
          <slot
            v-if="slots[field.key]"
            :name="field.key"
            :model-value="modelValue?.[field.key]"
            @update:model-value="onUpdate(field.key, $event)"
          />
          <LigandResolver
            v-else
            :schema="field"
            :model-value="modelValue?.[field.key]"
            :mode="resolveFieldMode(field.key, field.mode)"
            @update:model-value="onUpdate(field.key, $event)"
          />
        </div>
      </template>
    </div>

    <!-- ── subBlocks ────────────────────────────────── -->
    <template v-for="(sub, si) in subRows" :key="`sub-${si}`">
      <!-- Subheading row -->
      <div class="ligand-block__sub-title">
        {{ sub.label ?? '' }}
      </div>
      <!-- subBlock field rows -->
      <div
        v-for="(row, ri) in sub.rows"
        :key="`sub-${si}-row-${ri}`"
        class="ligand-block__row"
        :class="{ 'ligand-block__row--single': row.isSingle }"
      >
        <template v-for="field in row.fields" :key="field.key">
          <div
            class="ligand-block__label"
            :class="{ 'ligand-block__label--required': field.required }"
          >
            {{ field.label }}
          </div>
          <div class="ligand-block__value">
            <!-- Render slot when available; otherwise use default field -->
            <slot
              v-if="slots[field.key]"
              :name="field.key"
              :model-value="sub.key ? (modelValue?.[sub.key] as Record<string, unknown>)?.[field.key] : modelValue?.[field.key]"
              @update:model-value="onUpdate(field.key, $event, sub.key)"
            />
            <LigandResolver
              v-else
              :schema="field"
              :model-value="sub.key ? (modelValue?.[sub.key] as Record<string, unknown>)?.[field.key] : modelValue?.[field.key]"
              :mode="resolveFieldMode(field.key, field.mode)"
              @update:model-value="onUpdate(field.key, $event, sub.key)"
            />
          </div>
        </template>
      </div>
    </template>

  </div>
</template>

<style scoped>
/* ── Shared structure ───────────────────────────────────── */
.ligand-block {
  display: flex;
  flex-direction: column;
}

/* Block title */
.ligand-block__title {
  padding: 8px 12px;
  font-size: var(--ligand-font-size-sm);
  font-weight: var(--ligand-font-weight-bold);
  color: var(--ligand-color-text);
  border-bottom: 0.5px solid var(--ligand-color-border);
}

/* Subheading row */
.ligand-block__sub-title {
  padding: 6px 12px;
  font-size: var(--ligand-font-size-sm);
  font-weight: var(--ligand-font-weight-bold);
  color: var(--ligand-color-text);
  border-top: 0.5px solid var(--ligand-color-border);
  border-bottom: 0.5px solid var(--ligand-color-border);
  background: var(--ligand-color-surface);
}

/* Row — 4-column grid (label | value | label | value) */
.ligand-block__row {
  display: grid;
  grid-template-columns: var(--label-width, 160px) 1fr var(--label-width, 160px) 1fr;
  border-bottom: 0.5px solid var(--ligand-color-border);
}

.ligand-block__row:last-child {
  border-bottom: none;
}

/* Single-row mode: value cell spans remaining columns */
.ligand-block__row--single .ligand-block__value {
  grid-column: 2 / -1;
}

.ligand-block__label {
  background: var(--ligand-color-background);
  padding: 8px 12px;
  font-size: var(--ligand-font-size-sm);
  color: var(--ligand-color-text-muted);
  border-right: 0.5px solid var(--ligand-color-border);
  display: flex;
  align-items: center;
  gap: 4px;
}

.ligand-block__label--required::after {
  position: relative;
  top: -0.75rem;
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  /* background: var(--ligand-color-error); */
  flex-shrink: 0;
  margin-bottom: 6px;
  color: var(--ligand-color-error);
  font-size: 1.4rem;
  content: '*';
}

.ligand-block__value {
  background: var(--ligand-color-surface);
  padding: 6px 12px;
  font-size: var(--ligand-font-size-sm);
  border-right: 0.5px solid var(--ligand-color-border);
  display: flex;
  align-items: center;
}

.ligand-block__value:last-child {
  border-right: none;
}

/* ── default variant overrides ──────────────────────────── */
/* `default` uses a pure columns grid with no fixed label width */
.ligand-block--default .ligand-block__row {
  grid-template-columns: repeat(var(--ligand-columns, 2), 1fr);
}

.ligand-block--default .ligand-block__label {
  background: transparent;
  border-right: none;
  padding: 4px 0;
  font-size: var(--ligand-font-size-sm);
}

.ligand-block--default .ligand-block__value {
  border-right: none;
  padding: 4px 0;
}

.ligand-block--default .ligand-block__row {
  border-bottom: none;
  gap: var(--ligand-spacing-md);
}
</style>
<script setup lang="ts">
import type { CheckboxGroupFieldSchema } from '@/ligand/types'

defineProps<{ schema: CheckboxGroupFieldSchema }>()
const model = defineModel<(string | number)[]>({ default: () => [] })

function toggle(value: string | number) {
  const arr = model.value ?? []
  if (arr.includes(value)) {
    model.value = arr.filter(v => v !== value)
  } else {
    model.value = [...arr, value]
  }
}
</script>

<template>
  <div class="ligand-checkbox-group">
    <label
      v-for="option in schema.options"
      :key="option.value"
      class="ligand-checkbox-group__item"
    >
      <input
        :checked="(model ?? []).includes(option.value)"
        type="checkbox"
        :disabled="schema.disabled"
        :required="schema.required"
        @change="toggle(option.value)"
        class="ligand-checkbox-group__input"
      />
      <span class="ligand-checkbox-group__label">{{ option.label }}</span>
    </label>
  </div>
</template>

<style scoped>
.ligand-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ligand-checkbox-group__item {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
}

.ligand-checkbox-group__input {
  cursor: pointer;
  accent-color: var(--ligand-color-primary, #2563eb);
}

.ligand-checkbox-group__label {
  cursor: pointer;
  font-size: var(--ligand-font-size-sm);
  color: var(--ligand-color-text);
}
</style>

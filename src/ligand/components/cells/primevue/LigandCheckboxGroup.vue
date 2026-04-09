<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import type { CheckboxGroupFieldSchema } from '@/ligand/types'

defineProps<{ schema: CheckboxGroupFieldSchema }>()
const model = defineModel<(string | number)[]>({ default: () => [] })
</script>

<template>
  <div class="ligand-checkbox-group">
    <div
      v-for="option in schema.options"
      :key="option.value"
      class="ligand-checkbox-group__item"
    >
      <Checkbox
        :model-value="(model ?? []).includes(option.value)"
        :input-id="`checkbox-${schema.key}-${option.value}`"
        :value="option.value"
        :disabled="schema.disabled"
        @update:model-value="
          $event
            ? (model = [...(model ?? []), option.value])
            : (model = (model ?? []).filter(v => v !== option.value))
        "
      />
      <label :for="`checkbox-${schema.key}-${option.value}`" class="ligand-checkbox-group__label">
        {{ option.label }}
      </label>
    </div>
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
  gap: 8px;
}

.ligand-checkbox-group__label {
  cursor: pointer;
  font-size: var(--ligand-font-size-sm);
  color: var(--ligand-color-text);
}
</style>

<script setup lang="ts">
import RadioButton from 'primevue/radiobutton'
import type { RadioGroupFieldSchema } from '@/ligand/types'

defineProps<{ schema: RadioGroupFieldSchema }>()
const model = defineModel<string | number>()
</script>

<template>
  <div class="ligand-radio-group">
    <div
      v-for="option in schema.options"
      :key="option.value"
      class="ligand-radio-group__item"
    >
      <RadioButton
        :model-value="model"
        :input-id="`radio-${schema.key}-${option.value}`"
        :name="`radio-${schema.key}`"
        :value="option.value"
        :disabled="schema.disabled"
        @update:model-value="model = $event"
      />
      <label :for="`radio-${schema.key}-${option.value}`" class="ligand-radio-group__label">
        {{ option.label }}
      </label>
    </div>
  </div>
</template>

<style scoped>
.ligand-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ligand-radio-group__item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ligand-radio-group__label {
  cursor: pointer;
  font-size: var(--ligand-font-size-sm);
  color: var(--ligand-color-text);
}
</style>

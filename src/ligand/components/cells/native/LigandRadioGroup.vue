<script setup lang="ts">
import type { RadioGroupFieldSchema } from '@/ligand/types'

defineProps<{ schema: RadioGroupFieldSchema }>()
const model = defineModel<string | number>()
</script>

<template>
  <div class="ligand-radio-group">
    <label
      v-for="option in schema.options"
      :key="option.value"
      class="ligand-radio-group__item"
    >
      <input
        :checked="model === option.value"
        type="radio"
        :name="`radio-${schema.key}`"
        :value="option.value"
        :disabled="schema.disabled"
        :required="schema.required"
        @change="model = option.value"
        class="ligand-radio-group__input"
      />
      <span class="ligand-radio-group__label">{{ option.label }}</span>
    </label>
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
  cursor: pointer;
  gap: 8px;
}

.ligand-radio-group__input {
  cursor: pointer;
  accent-color: var(--ligand-color-primary, #2563eb);
}

.ligand-radio-group__label {
  cursor: pointer;
  font-size: var(--ligand-font-size-sm);
  color: var(--ligand-color-text);
}
</style>

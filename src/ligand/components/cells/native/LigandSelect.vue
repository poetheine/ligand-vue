<script setup lang="ts">
import type { SelectFieldSchema } from '@/ligand/types'

defineProps<{ schema: SelectFieldSchema }>()
const model = defineModel<string | number>()
</script>

<template>
  <select
    v-model="model"
    :disabled="schema.disabled"
    :required="schema.required"
    class="ligand-select"
  >
    <option v-if="schema.placeholder" value="" disabled>{{ schema.placeholder }}</option>
    <option
      v-for="opt in schema.options"
      :key="opt.value"
      :value="opt.value"
    >
      {{ opt.label }}
    </option>
  </select>
</template>

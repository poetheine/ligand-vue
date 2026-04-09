<script setup lang="ts">
import Select from 'primevue/select'
import type { SelectFieldSchema } from '@/ligand/types'

defineProps<{ schema: SelectFieldSchema }>()
const model = defineModel<string | number>()
</script>

<template>
  <Select
    v-model="model"
    :options="schema.options"
    option-label="label"
    option-value="value"
    :placeholder="schema.placeholder"
    :disabled="schema.disabled"
    :required="schema.required"
  />
</template>

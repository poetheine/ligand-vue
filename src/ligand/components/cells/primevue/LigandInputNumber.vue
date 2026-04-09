<script setup lang="ts">
import InputNumber from 'primevue/inputnumber'
import type { NumberFieldSchema } from '@/ligand/types'

defineProps<{ schema: NumberFieldSchema }>()
const model = defineModel<number>()
</script>

<template>
  <InputNumber
    v-model="model"
    :min="schema.min"
    :max="schema.max"
    :placeholder="schema.placeholder"
    :disabled="schema.disabled"
    :readonly="schema.readonly"
    :required="schema.required"
  />
</template>

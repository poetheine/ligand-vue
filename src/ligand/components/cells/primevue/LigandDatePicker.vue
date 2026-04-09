<script setup lang="ts">
import DatePicker from 'primevue/datepicker'
import type { DateFieldSchema } from '@/ligand/types'

defineProps<{ schema: DateFieldSchema }>()
const model = defineModel<string>({ default: '' })
</script>

<template>
  <DatePicker
    v-model="model"
    :min-date="schema.minDate ? new Date(schema.minDate) : undefined"
    :max-date="schema.maxDate ? new Date(schema.maxDate) : undefined"
    :placeholder="schema.placeholder"
    :disabled="schema.disabled"
    :readonly="schema.readonly"
    :required="schema.required"
    date-format="yy-mm-dd"
  />
</template>

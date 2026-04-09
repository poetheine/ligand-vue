<script setup lang="ts">
import type { DateFieldSchema } from '@/ligand/types'

defineProps<{ schema: DateFieldSchema }>()
const model = defineModel<string>({ default: '' })
</script>

<template>
  <input
    v-model="model"
    type="date"
    :min="schema.minDate"
    :max="schema.maxDate"
    :disabled="schema.disabled"
    :readonly="schema.readonly"
    :required="schema.required"
    class="ligand-input"
  />
</template>

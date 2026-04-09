<script setup lang="ts">
import type { NumberFieldSchema } from '@/ligand/types'

defineProps<{ schema: NumberFieldSchema }>()
const model = defineModel<number>()
</script>

<template>
  <input
    v-model="model"
    type="number"
    :min="schema.min"
    :max="schema.max"
    :placeholder="schema.placeholder"
    :disabled="schema.disabled"
    :readonly="schema.readonly"
    :required="schema.required"
    class="ligand-input"
  />
</template>

<script setup lang="ts">
import type { TextFieldSchema } from '@/ligand/types'

defineProps<{ schema: TextFieldSchema }>()
const model = defineModel<string>({ default: '' })
</script>

<template>
  <input
    v-model="model"
    type="text"
    :placeholder="schema.placeholder"
    :disabled="schema.disabled"
    :readonly="schema.readonly"
    :required="schema.required"
    class="ligand-input"
  />
</template>

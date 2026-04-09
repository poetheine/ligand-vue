<script setup lang="ts">
import InputText from 'primevue/inputtext'
import type { TextFieldSchema } from '@/ligand/types'

defineProps<{ schema: TextFieldSchema }>()
const model = defineModel<string>({ default: '' })
</script>

<template>
  <InputText
    v-model="model"
    :placeholder="schema.placeholder"
    :disabled="schema.disabled"
    :readonly="schema.readonly"
    :required="schema.required"
  />
</template>

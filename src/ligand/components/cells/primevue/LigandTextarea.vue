<script setup lang="ts">
import Textarea from 'primevue/textarea'
import type { TextareaFieldSchema } from '@/ligand/types'

defineProps<{ schema: TextareaFieldSchema }>()
const model = defineModel<string>({ default: '' })
</script>

<template>
  <Textarea
    v-model="model"
    :rows="schema.rows ?? 3"
    :placeholder="schema.placeholder"
    :disabled="schema.disabled"
    :readonly="schema.readonly"
    :required="schema.required"
  />
</template>

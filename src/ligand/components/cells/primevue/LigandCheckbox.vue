<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import type { CheckboxFieldSchema } from '@/ligand/types'

defineProps<{ schema: CheckboxFieldSchema }>()
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <Checkbox
    v-model="model"
    :binary="true"
    :disabled="schema.disabled"
    :required="schema.required"
  />
</template>

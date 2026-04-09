<script setup lang="ts">
import type { CheckboxFieldSchema } from '@/ligand/types'

defineProps<{ schema: CheckboxFieldSchema }>()
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <input
    v-model="model"
    type="checkbox"
    :disabled="schema.disabled"
    :required="schema.required"
    class="ligand-checkbox"
  />
</template>

<script setup lang="ts">
import type { TextBlockNode } from '@/ligand/types'
defineProps<{ node: TextBlockNode }>()
</script>

<template>
  <h2 v-if="node.variant === 'heading'"    class="ligand-text-block ligand-text-block--heading">{{ node.content }}</h2>
  <h3 v-else-if="node.variant === 'subheading'" class="ligand-text-block ligand-text-block--subheading">{{ node.content }}</h3>
  <p  v-else-if="node.variant === 'caption'"    class="ligand-text-block ligand-text-block--caption">{{ node.content }}</p>
  <p  v-else class="ligand-text-block ligand-text-block--body">{{ node.content }}</p>
</template>

<style scoped>
.ligand-text-block { margin: 0; }
.ligand-text-block--heading    { font-size: var(--ligand-font-size-lg); font-weight: var(--ligand-font-weight-bold); }
.ligand-text-block--subheading { font-size: var(--ligand-font-size-md); font-weight: var(--ligand-font-weight-bold); }
.ligand-text-block--body       { font-size: var(--ligand-font-size-md); color: var(--ligand-color-text); }
.lig-text-block--caption    { font-size: var(--ligand-font-size-sm); color: var(--ligand-color-text-muted); }
</style>
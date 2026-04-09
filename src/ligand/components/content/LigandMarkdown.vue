<script setup lang="ts">
import type { MarkdownNode } from '@/ligand/types'

defineProps<{ node: MarkdownNode }>()

/**
 * Markdown renderer.
 * By default, it displays raw content inside `<pre>`.
 * Consumer projects can replace this with `marked`, `markdown-it`, or inject a custom renderer.
 */
</script>

<template>
  <div class="ligand-markdown">
    <pre class="ligand-markdown__content">{{ node.content }}</pre>
  </div>
</template>

<style scoped>
.ligand-markdown__content {
  font-family: inherit;
  font-size: var(--ligand-font-size-md);
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}
</style>
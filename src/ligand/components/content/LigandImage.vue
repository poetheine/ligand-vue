<script setup lang="ts">
import type { ImageNode } from '@/ligand/types'
defineProps<{ node: ImageNode }>()
</script>

<template>
  <figure class="ligand-image">
    <img
      :src="node.src"
      :alt="node.alt ?? ''"
      :style="node.width ? { width: node.width } : {}"
      class="ligand-image__img"
    />
    <figcaption v-if="node.caption" class="ligand-image__caption">
      {{ node.caption }}
    </figcaption>
  </figure>
</template>

<style scoped>
.ligand-image { margin: 0; }
.ligand-image__img {
  display: block;
  max-width: 100%;
  border-radius: var(--ligand-border-radius-md);
}
.ligand-image__caption {
  margin-top: var(--ligand-spacing-xs);
  font-size: var(--ligand-font-size-sm);
  color: var(--ligand-color-text-muted);
}
</style>
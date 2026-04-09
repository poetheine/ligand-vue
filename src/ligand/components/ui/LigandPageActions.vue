<script setup lang="ts">
import type { ActionButton, LigandMode } from '@/ligand/types'

defineProps<{
  /** Array of action button definitions. */
  actions: ActionButton[]
  /** Current page mode (`edit | view | create`). */
  mode?: LigandMode
}>()

/**
 * Emits an `action` event when a button is clicked.
 * Example: `@action="handleAction"` -> payload is `{ type: 'save', label: 'Save' }`.
 */
const emit = defineEmits<{
  action: [button: ActionButton]
}>()

/**
 * Determines button visibility.
 * - If `visibleIn` is missing: always visible (default: `all`)
 * - If array: visible only in listed modes
 * - If `all`: visible in every mode
 * - If single mode: visible only in that mode
 */
function isVisible(button: ActionButton, currentMode?: LigandMode): boolean {
  const visibleIn = button.visibleIn ?? 'all'
  
  // If current mode is missing, always show.
  if (!currentMode) return true
  
  // Array form: ['edit', 'view', 'create'], etc.
  if (Array.isArray(visibleIn)) {
    return visibleIn.includes(currentMode)
  }
  
  // `all` -> visible in every mode.
  if (visibleIn === 'all') return true
  
  // Single mode: 'edit' | 'view' | 'create'.
  return visibleIn === currentMode
}

function handleClick(button: ActionButton) {
  emit('action', button)
}
</script>

<template>
  <div class="ligand-page-actions">
    <button
      v-for="button in actions"
      v-show="isVisible(button, mode)"
      :key="button.type"
      :disabled="button.disabled ?? false"
      :class="[
        'ligand-action-btn',
        `ligand-action-btn--${button.variant ?? 'secondary'}`,
      ]"
      @click="handleClick(button)"
    >
      {{ button.label }}
    </button>
  </div>
</template>

<style scoped>
.ligand-page-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ligand-action-btn {
  padding: 8px 16px;
  border: 1px solid var(--ligand-color-border);
  border-radius: var(--ligand-border-radius-md);
  background: white;
  color: var(--ligand-color-text);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.ligand-action-btn:hover:not(:disabled) {
  background: var(--ligand-color-surface);
  border-color: var(--ligand-color-text-muted);
}

.ligand-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* variant — primary (emphasized action) */
.ligand-action-btn--primary {
  background: var(--ligand-color-text);
  color: white;
  border-color: var(--ligand-color-text);
}

.ligand-action-btn--primary:hover:not(:disabled) {
  opacity: 0.9;
}

/* variant — danger (destructive/high-risk action) */
.ligand-action-btn--danger {
  border-color: var(--ligand-color-error);
  color: var(--ligand-color-error);
}

.ligand-action-btn--danger:hover:not(:disabled) {
  background: rgba(255, 0, 0, 0.05);
}
</style>

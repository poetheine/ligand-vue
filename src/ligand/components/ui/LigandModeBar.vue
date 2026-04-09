<script setup lang="ts">
/**
 * LigandModeBar
 *
 * UI component that renders Edit/Save/Cancel actions.
 * Designed to work with `useLigandMode`.
 *
 * You can use this as-is in test screens,
 * and place it in a page header or action bar in production.
 *
 * Usage example:
 *   <LigandModeBar
 *     :is-editing="isEditing"
 *     :loading="loading"
 *     @edit="startEdit"
 *     @save="save"
 *     @cancel="cancel"
 *   />
 */
defineProps<{
  isEditing: boolean
  loading?: boolean
  editLabel?: string
  saveLabel?: string
  cancelLabel?: string
}>()

defineEmits<{
  edit: []
  save: []
  cancel: []
}>()
</script>

<template>
  <div class="ligand-mode-bar">
    <!-- View state -->
    <template v-if="!isEditing">
      <button class="ligand-mode-bar__btn ligand-mode-bar__btn--edit" @click="$emit('edit')">
        {{ editLabel ?? 'Edit' }}
      </button>
    </template>

    <!-- Edit state -->
    <template v-else>
      <button
        class="ligand-mode-bar__btn ligand-mode-bar__btn--save"
        :disabled="loading"
        @click="$emit('save')"
      >
        {{ loading ? 'Saving...' : (saveLabel ?? 'Save') }}
      </button>
      <button
        class="ligand-mode-bar__btn ligand-mode-bar__btn--cancel"
        :disabled="loading"
        @click="$emit('cancel')"
      >
        {{ cancelLabel ?? 'Cancel' }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.ligand-mode-bar {
  display: flex;
  gap: var(--ligand-spacing-sm);
  align-items: center;
}

.ligand-mode-bar__btn {
  padding: var(--ligand-field-padding-y) var(--ligand-spacing-md);
  font-size: var(--ligand-font-size-sm);
  border-radius: var(--ligand-border-radius-md);
  border: 1px solid var(--ligand-color-border);
  cursor: pointer;
  transition: opacity 0.15s;
}

.ligand-mode-bar__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ligand-mode-bar__btn--edit {
  background: var(--ligand-color-primary);
  color: #fff;
  border-color: var(--ligand-color-primary);
}

.ligand-mode-bar__btn--save {
  background: var(--ligand-color-primary);
  color: #fff;
  border-color: var(--ligand-color-primary);
}

.ligand-mode-bar__btn--cancel {
  background: var(--ligand-color-surface);
  color: var(--ligand-color-text);
}
</style>
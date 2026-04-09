import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { LigandMode } from '@/ligand/types'

/**
 * useLigandMode
 *
 * Composable for managing `LigandLayout` mode and edit/save/cancel flow.
 * Works for test UIs and production pages with real edit actions.
 *
 * Usage example:
 *   const { mode, isEditing, startEdit, save, cancel } = useLigandMode(formData)
 */
export function useLigandMode(
  modelValue: Ref<Record<string, unknown>>,
  options?: {
    initialMode?: LigandMode
    onSave?: (data: Record<string, unknown>) => Promise<void> | void
    onCancel?: () => void
  }
) {
  const mode = ref<LigandMode>(options?.initialMode ?? 'view')
  const isEditing = computed(() => mode.value === 'edit')

  // Snapshot before editing for cancel rollback.
  let snapshot: Record<string, unknown> = {}

  function startEdit() {
    snapshot = JSON.parse(JSON.stringify(modelValue.value))
    mode.value = 'edit'
  }

  async function save() {
    await options?.onSave?.(modelValue.value)
    mode.value = 'view'
  }

  function cancel() {
    // Roll back to snapshot.
    Object.keys(modelValue.value).forEach(k => delete modelValue.value[k])
    Object.assign(modelValue.value, snapshot)
    options?.onCancel?.()
    mode.value = 'view'
  }

  return {
    mode,
    isEditing,
    startEdit,
    save,
    cancel,
  }
}
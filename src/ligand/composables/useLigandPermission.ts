import { ref, computed } from 'vue'
import type { LigandMode } from '@/ligand/types'

export type LigandRole = 'admin' | 'editor' | 'viewer'

/**
 * useLigandPermission
 *
 * Role-based field access composable.
 * Injects a permission map externally without modifying schema definitions.
 *
 * admin  -> edit on all fields
 * editor -> edit/view by permission map
 * viewer -> view on all fields
 *
 * Example `permissions`:
 *   { name: ['admin', 'editor'], grade: ['admin'] }
 */
export function useLigandPermission(
  permissions: Record<string, LigandRole[]> = {}
) {
  const role = ref<LigandRole>('viewer')

  // Return access mode for current role on a specific field.
  function getFieldMode(fieldKey: string): LigandMode {
    if (role.value === 'admin') return 'edit'
    if (role.value === 'viewer') return 'view'
    // editor: check permission map
    const allowed = permissions[fieldKey] ?? []
    return allowed.includes('editor') ? 'edit' : 'view'
  }

  // `fieldModes` map passed to layout.
  const fieldModes = computed(() => {
    const result: Record<string, LigandMode> = {}
    Object.keys(permissions).forEach(key => {
      result[key] = getFieldMode(key)
    })
    return result
  })

  // Layout mode (`view` for viewer, `edit` potential otherwise).
  const layoutMode = computed<LigandMode>(() =>
    role.value === 'viewer' ? 'view' : 'edit'
  )

  return {
    role,
    fieldModes,
    layoutMode,
    getFieldMode,
  }
}
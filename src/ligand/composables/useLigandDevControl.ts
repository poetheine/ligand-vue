import { ref, computed } from 'vue'
import type { LigandMode } from '@/ligand/types'
import type { LigandRole } from './useLigandPermission'
import type { LigandDevMode } from './useLigandDevMode'

export type DevControlType = 'mode' | 'permission'

/**
 * useLigandDevControl
 *
 * Manages DevBar mode control and permission control as mutually exclusive states.
 *
 * activeControl = 'mode'       -> permission controls are inactive, mode is manual
 * activeControl = 'permission' -> mode controls are inactive, role-based control is active
 */
export function useLigandDevControl(
  permissions: Record<string, LigandRole[]> = {}
) {
  const activeControl = ref<DevControlType>('mode')

  // ── Mode control ───────────────────────────────────
  const devMode = ref<LigandDevMode>('view')

  const modeLigandMode = computed<LigandMode>(() =>
    devMode.value === 'view' ? 'view' : 'edit'
  )

  function setDevMode(m: LigandDevMode) {
    activeControl.value = 'mode'
    devMode.value = m
  }

  // ── Permission control ─────────────────────────────
  const role = ref<LigandRole>('viewer')

  function getFieldMode(fieldKey: string): LigandMode {
    if (role.value === 'admin') return 'edit'
    if (role.value === 'viewer') return 'view'
    const allowed = permissions[fieldKey] ?? []
    return allowed.includes('editor') ? 'edit' : 'view'
  }

  const permLayoutMode = computed<LigandMode>(() =>
    role.value === 'viewer' ? 'view' : 'edit'
  )

  const fieldModes = computed<Record<string, LigandMode>>(() => {
    const result: Record<string, LigandMode> = {}
    Object.keys(permissions).forEach(key => {
      result[key] = getFieldMode(key)
    })
    return result
  })

  function setRole(r: LigandRole) {
    activeControl.value = 'permission'
    role.value = r
  }

  // ── Effective outputs ──────────────────────────────
  // Decide final mode/fieldModes from activeControl.

  const activeLayoutMode = computed<LigandMode>(() =>
    activeControl.value === 'mode'
      ? modeLigandMode.value
      : permLayoutMode.value
  )

  const activeFieldModes = computed<Record<string, LigandMode>>(() =>
    activeControl.value === 'permission' ? fieldModes.value : {}
  )

  return {
    activeControl,
    // mode control
    devMode,
    setDevMode,
    isModeActive: computed(() => activeControl.value === 'mode'),
    // permission control
    role,
    setRole,
    isPermissionActive: computed(() => activeControl.value === 'permission'),
    // effective outputs
    activeLayoutMode,
    activeFieldModes,
  }
}
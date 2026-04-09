import { ref, computed } from 'vue'

export type LigandDevMode = 'create' | 'edit' | 'view'

/**
 * useLigandDevMode
 *
 * Dev-screen mode switching composable.
 * The DevBar is shown only when `?mode=dev` is present.
 *
 * create — initialize an empty form
 * edit   — load server data and allow editing
 * view   — read-only mode
 */
export function useLigandDevMode(
  initial: LigandDevMode = 'create',
  options?: {
    onEnterCreate?: () => void
    onEnterEdit?: () => Promise<void> | void
    onEnterView?: () => Promise<void> | void
  }
) {
  const mode = ref<LigandDevMode>(initial)

  // Detect `?mode=dev` in an SSR-safe way.
  const isDevMode = computed(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).get('mode') === 'dev'
  })

  // Mode passed to `LigandLayout` (`create` behaves like `edit`).
  const ligandMode = computed(() =>
    mode.value === 'view' ? 'view' : 'edit'
  )

  async function toCreate() {
    options?.onEnterCreate?.()
    mode.value = 'create'
  }

  async function toEdit() {
    await options?.onEnterEdit?.()
    mode.value = 'edit'
  }

  async function toView() {
    await options?.onEnterView?.()
    mode.value = 'view'
  }

  return {
    mode,
    ligandMode,
    isDevMode,
    toCreate,
    toEdit,
    toView,
  }
}
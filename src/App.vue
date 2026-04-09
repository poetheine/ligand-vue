<template>
  <main style="max-width: 900px; margin: 40px auto; padding: 0 16px;">

    <!-- Dev bar (visible only with `?mode=dev`) -->
    <LigandDevBar
      v-if="isDevMode"
      :dev-mode="devMode"
      :role="role"
      :active-control="activeControl"
      @set-mode="handleSetDevMode"
      @set-role="setRole"
    />

    <!-- Header + production mode actions -->
    <div style="display: flex; align-items: center; margin-bottom: 24px;">
      <h1 style="font-size: 20px; margin: 0;">Ligand Demo</h1>
      <div style="margin-left: auto;">
        <LigandModeBar
          :is-editing="isEditing"
          :loading="loading"
          @edit="startEdit"
          @save="save"
          @cancel="cancel"
        />
      </div>
    </div>

    <!-- Page action buttons -->
    <LigandPageActions
      :actions="schema.pageActions"
      :mode="finalMode"
      @action="handlePageAction"
      style="margin-bottom: 24px;"
    />

    <LigandLayout
      :nodes="schema.tableNodes"
      v-model="formData"
      :mode="finalMode"
      :field-modes="finalFieldModes"
    />

    <pre style="margin-top: 32px; font-size: 12px; background: #f5f5f5; padding: 12px; border-radius: 6px;">{{ JSON.stringify(formData, null, 2) }}</pre>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  LigandLayout,
  LigandModeBar,
  LigandDevBar,
  LigandPageActions,
  useLigandMode,
  useLigandDevControl,
  type LigandNode,
  type ActionButton,
} from '@/ligand/app'
import { PageSchema as schema } from './App.schema'
import {
  sampleInitialData,
  sampleServerData,
} from './App.mock'

// ── Permission map ──────────────────────────────────
// admin  -> edit on all fields
// editor -> edit/view by this map
// viewer -> view on all fields
const permissions = {
  name:    ['admin', 'editor'],
  grade:   ['admin'],
  zip:     ['admin', 'editor'],
  address: ['admin', 'editor'],
  memo:    ['admin', 'editor'],
  subconPlan: ['admin', 'editor'],
  subconId:   ['admin'],
  class:      ['admin'],
  pjtReqNo:   ['admin', 'editor'],
  itemNo:     ['admin'],
}



const serverData = sampleServerData

const formData = ref<Record<string, unknown>>(
  JSON.parse(JSON.stringify(serverData))
)
const loading = ref(false)

// ── Dev controls (mode vs permission are exclusive) ─
const {
  activeControl,
  devMode, setDevMode, isModeActive,
  role, setRole, isPermissionActive,
  activeLayoutMode, activeFieldModes,
} = useLigandDevControl(permissions)

// Detect `?mode=dev` query parameter.
const isDevMode = computed(() => {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('mode') === 'dev'
})

// Data initialization when entering dev mode.
function handleSetDevMode(m: typeof devMode.value) {
  if (m === 'create') formData.value = {}
  else formData.value = JSON.parse(JSON.stringify(serverData))
  setDevMode(m)
}

// ── Production controls ──────────────────────────────
const { mode, isEditing, startEdit, save, cancel } = useLigandMode(formData, {
  initialMode: 'edit',  // Changed from `view` to `edit`
  onSave: async (data) => {
    loading.value = true
    // Replace with real API call.
    await new Promise(r => setTimeout(r, 800))
    console.log('Saved:', data)
    loading.value = false
  },
})

// Final layout mode priority:
// 1) `activeControl === 'mode'` with manually selected devMode
// 2) URL-based dev mode when `isDevMode === true`
// 3) production mode fallback
const finalMode = computed(() => {
  // Manual dev control (`setDevMode` called).
  if (activeControl.value === 'mode') {
    return activeLayoutMode.value
  }
  // Dev mode from URL parameter.
  if (isDevMode.value) {
    return activeLayoutMode.value
  }
  // Default: production mode.
  return mode.value
})

const finalFieldModes = computed(() =>
  isDevMode.value && isPermissionActive.value ? activeFieldModes.value : {}
)

// ── PageActions handler ───────────────────────────────
function handlePageAction(button: ActionButton) {
  console.log(`[Action] ${button.type}: ${button.label}`, button)
  
  // Handle each action type.
  switch (button.type) {
    case 'list':
      // Navigate to list page.
      console.log('Navigate to list page')
      break
    case 'edit':
      // Enter edit mode.
      startEdit()
      break
    case 'create':
      // Enter create mode (new data).
      formData.value = {}
      // In production, you can also set the initial mode to edit.
      startEdit()
      break
    case 'cancel':
      // Cancel changes.
      cancel()
      break
    case 'save':
      // Save.
      save()
      break
    case 'delete':
      // Delete (confirmation dialog recommended).
      if (confirm('Are you sure you want to delete this item?')) {
        console.log('Delete action confirmed')
      }
      break
    case 'submit':
      // Submit in create mode.
      console.log('Submit payload:', formData.value)
      break
    case 'next':
      // Go to next step.
      console.log('Proceed to next step')
      break
    default:
      console.log('Unhandled action type:', button.type)
  }
}
</script>
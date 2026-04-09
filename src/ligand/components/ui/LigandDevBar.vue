<script lang="ts" setup>
import type { LigandDevMode } from '@/ligand/composables/useLigandDevMode'
import type { LigandRole } from '@/ligand/composables/useLigandPermission'
import type { DevControlType } from '@/ligand/composables/useLigandDevControl'
import { useLigandDevState } from '@/ligand/composables/useLigandDevState'

defineProps<{
  devMode: LigandDevMode
  role: LigandRole
  activeControl: DevControlType
}>()

defineEmits<{
  setMode: [mode: LigandDevMode]
  setRole: [role: LigandRole]
}>()

const modes: { value: LigandDevMode; label: string }[] = [
  { value: 'create', label: 'create' },
  { value: 'edit',   label: 'edit'   },
  { value: 'view',   label: 'view'   },
]

const roles: { value: LigandRole; label: string }[] = [
  { value: 'admin',  label: 'admin'  },
  { value: 'editor', label: 'editor' },
  { value: 'viewer', label: 'viewer' },
]

const { showDevData, toggleShowDevData } = useLigandDevState()
</script>

<template>
  <div class="lig-dev-bar">

    <!-- Mode section -->
    <div class="lig-dev-bar__section" :class="{ 'lig-dev-bar__section--inactive': activeControl === 'permission' }">
      <span class="lig-dev-bar__badge">DEV</span>
      <div class="lig-dev-bar__btns">
        <button
          v-for="m in modes"
          :key="m.value"
          class="lig-dev-bar__btn"
          :class="{ 'lig-dev-bar__btn--active': devMode === m.value && activeControl === 'mode' }"
          @click="$emit('setMode', m.value)"
        >{{ m.label }}</button>
      </div>
    </div>

    <div class="lig-dev-bar__divider" />

    <!-- Permission section -->
    <div class="lig-dev-bar__section" :class="{ 'lig-dev-bar__section--inactive': activeControl === 'mode' }">
      <span class="lig-dev-bar__badge lig-dev-bar__badge--perm">ROLE</span>
      <div class="lig-dev-bar__btns">
        <button
          v-for="r in roles"
          :key="r.value"
          class="lig-dev-bar__btn"
          :class="{ 'lig-dev-bar__btn--active': role === r.value && activeControl === 'permission' }"
          @click="$emit('setRole', r.value)"
        >{{ r.label }}</button>
      </div>
    </div>

    <div class="lig-dev-bar__divider" />

    <!-- Data toggle -->
    <label class="lig-dev-bar__data-toggle">
      <input
        type="checkbox"
        :checked="showDevData"
        @change="toggleShowDevData(($event.target as HTMLInputElement).checked)"
      />
      <span>data</span>
    </label>

    <!-- Current state indicator -->
    <span class="lig-dev-bar__status">
      {{ activeControl === 'mode' ? devMode : role }}
    </span>

  </div>
</template>

<style scoped>
.lig-dev-bar {
  display: flex;
  align-items: center;
  gap: var(--ligand-spacing-sm);
  padding: 6px var(--ligand-spacing-md);
  background: #1a1a2e;
  border-radius: var(--ligand-border-radius-md);
  margin-bottom: var(--ligand-spacing-md);
}

.lig-dev-bar__section {
  display: flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.2s;
}

.lig-dev-bar__section--inactive {
  opacity: 0.35;
}

.lig-dev-bar__badge {
  font-size: 10px;
  font-weight: 700;
  color: #f0c040;
  letter-spacing: 0.08em;
  background: rgba(240, 192, 64, 0.15);
  padding: 2px 6px;
  border-radius: 3px;
  white-space: nowrap;
}

.lig-dev-bar__badge--perm {
  color: #80d8a0;
  background: rgba(128, 216, 160, 0.15);
}

.lig-dev-bar__divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 4px;
}

.lig-dev-bar__btns {
  display: flex;
  gap: 4px;
}

.lig-dev-bar__btn {
  padding: 3px 10px;
  font-size: var(--ligand-font-size-sm);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--ligand-border-radius-sm);
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.15s;
}

.lig-dev-bar__btn:disabled {
  cursor: not-allowed;
}

.lig-dev-bar__btn:not(:disabled):hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
}

.lig-dev-bar__btn--active {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
}

.lig-dev-bar__data-toggle {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);
  font-size: var(--ligand-font-size-sm);
  user-select: none;
  transition: color 0.15s;
}

.lig-dev-bar__data-toggle:hover {
  color: rgba(255, 255, 255, 0.8);
}

.lig-dev-bar__data-toggle input[type='checkbox'] {
  accent-color: #f0c040;
  width: 13px;
  height: 13px;
  cursor: pointer;
}

.lig-dev-bar__status {
  margin-left: auto;
  font-size: var(--ligand-font-size-sm);
  color: rgba(255, 255, 255, 0.4);
  font-family: monospace;
}
</style>
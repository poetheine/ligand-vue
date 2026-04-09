import type { App, Component } from 'vue'
import type { FieldType } from './schema.types'

// Cell component mapping for every `FieldType`.
export type CellMap = Record<FieldType, Component>

// Adapter contract.
export interface LigandAdapter {
  /** Adapter identifier (used for debugging/docs). */
  name: string
  /** UI framework setup. Dependency-free adapters may leave this empty. */
  install: (app: App) => void
  /** `FieldType` -> cell component mapping. */
  cells: CellMap
}

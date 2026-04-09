// ── Field Types ───────────────────────────────────────────────
export const FIELD_TYPES = [
  'text',
  'number',
  'select',
  'checkbox',
  'radio-group',
  'checkbox-group',
  'date',
  'textarea'
] as const
export type FieldType = (typeof FIELD_TYPES)[number]

// ── Render Mode ───────────────────────────────────────────────
// edit: update existing data
// view: read-only display
// create: create new data
export type LigandMode = 'edit' | 'view' | 'create'

// ── Base ──────────────────────────────────────────────────────
interface BaseFieldSchema {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  /** Number of columns occupied inside `LigandBlock` (default: 1). */
  span?: number
  /** Field-level mode override. Inherits parent `LigandLayout` mode when omitted. */
  mode?: LigandMode
}

// ── Per-type ─────────────────────────────────────────────────
export interface TextFieldSchema extends BaseFieldSchema {
  type: 'text'
}
export interface NumberFieldSchema extends BaseFieldSchema {
  type: 'number'
  min?: number
  max?: number
}
export interface SelectFieldSchema extends BaseFieldSchema {
  type: 'select'
  options: { label: string; value: string | number }[]
}
export interface CheckboxFieldSchema extends BaseFieldSchema {
  type: 'checkbox'
}
export interface RadioGroupFieldSchema extends BaseFieldSchema {
  type: 'radio-group'
  options: { label: string; value: string | number }[]
}
export interface CheckboxGroupFieldSchema extends BaseFieldSchema {
  type: 'checkbox-group'
  options: { label: string; value: string | number }[]
}
export interface DateFieldSchema extends BaseFieldSchema {
  type: 'date'
  minDate?: string
  maxDate?: string
}
export interface TextareaFieldSchema extends BaseFieldSchema {
  type: 'textarea'
  rows?: number
}

// ── Field Union ───────────────────────────────────────────────
export type FieldSchema =
  | TextFieldSchema
  | NumberFieldSchema
  | SelectFieldSchema
  | CheckboxFieldSchema
  | RadioGroupFieldSchema
  | CheckboxGroupFieldSchema
  | DateFieldSchema
  | TextareaFieldSchema

// ── Content Nodes ────────────────────────────────────────────
// Informational nodes outside form input, useful for guides and detail pages.

export interface TextBlockNode {
  type: 'text-block'
  content: string
  variant?: 'heading' | 'subheading' | 'body' | 'caption'
}

export interface ImageNode {
  type: 'image'
  src: string
  alt?: string
  caption?: string
  width?: string
}

export interface MarkdownNode {
  type: 'markdown'
  content: string
}

export interface DividerNode {
  type: 'divider'
}

// ── Layout Nodes ─────────────────────────────────────────────
//
// `LigandNode` is the union of all page building units.
// `LigandRenderer` branches to the right component by `type`.
//
//   LigandCard        card/panel container (recursive)
//     └─ LigandSection  visual grouping unit
//          └─ LigandBlock   grid declaration unit (columns)
//               └─ FieldSchema  individual cell (span)
//
// Content nodes (`text-block`, `image`, `markdown`, `divider`) can be mixed into
// `children`/`fields` at any level.

export interface LigandSubBlock {
  /** Subheading label. If omitted, only a separator line is shown. */
  label?: string
  /** Optional data scope key for this sub-block; nests under `formData[key]`. */
  key?: string
  fields: FieldSchema[]
}

export interface LigandBlock {
  type: 'block'
  /** Block title. */
  label?: string
  columns: number
  /** Visual variant; changes styles only, keeping markup structure shared. */
  variant?: 'default' | 'table'
  /** Label column width (default: 160px). */
  labelWidth?: string | number
  fields: FieldSchema[]
  /** Child field groups separated by subheadings. */
  subBlocks?: LigandSubBlock[]
}

export interface LigandSection {
  type: 'section'
  title?: string
  blocks: LigandBlock[]
}

export interface LigandCard {
  /** Optional data scope key for this card; nests data under `formData[key]`. */
  key?: string
  type: 'card'
  title?: string
  children: LigandNode[]
}

// ── Full LigandNode union ─────────────────────────────────────
export type LigandNode =
  | LigandCard
  | LigandSection
  | LigandBlock
  | FieldSchema
  | TextBlockNode
  | ImageNode
  | MarkdownNode
  | DividerNode

// ── Action Types ──────────────────────────────────────────────
export const ACTION_TYPES = ['save', 'delete', 'cancel', 'submit', 'next', 'list', 'create', 'edit'] as const
export type ActionType = (typeof ACTION_TYPES)[number]

export interface ActionButton {
  type: ActionType
  label: string
  /**
   * Visibility mode
   * - Array: `['edit', 'view', 'create']` -> visible only in listed modes
   * - String `'all'`: visible in all modes
   * - Single mode: `'edit' | 'view' | 'create'`
   * Defaults to `'all'` when omitted
   */
  visibleIn?: LigandMode[] | LigandMode | 'all'
  disabled?: boolean
  /** Optional icon/style metadata. */
  variant?: 'primary' | 'secondary' | 'danger'
}

/**
 * Page-level action definitions.
 * Define an `actions` array in page components such as `App.vue`,
 * then render through the `PageActions` component.
 */
export interface PageActions {
  actions: ActionButton[]
}
import type { FieldSchema } from '@/ligand/types'

// ── Table-style page schema ─────────────────────────
export const tableNodes: LigandNode[] = [
  {
    type: 'card',
    key: 'Scene Number',
    title: 'Scene #1',
    children: [
      {
        type: 'block',
        variant: 'table',
        columns: 4,
        fields: [
          { type: 'text', key: 'title', label: 'Scene Title', span: 2 },
          // Render as two field pairs per row.
          { type: 'date', key: 'Shoot Date', label: 'Shoot Date', required: true },
          { type: 'text', key: 'Scene ID', label: 'Scene ID', required: true },
          { type: 'select', key: 'Scene Type', label: 'Scene Type', required: true,
            options: [
              { label: 'INT', value: 'INT' },
              { label: 'EXT', value: 'EXT' }
            ]
          },
          { type: 'text', key: 'Script Ref.', label: 'Script Ref.', required: true },
          { type: 'select', key: 'Shot No.', label: 'Shot No.', required: true,
            options: [{ label: 'PO199999999|DESC', value: 'po1' }] },
          { type: 'text', key: 'Location Name', label: 'Location Name', mode: 'view' },
        ],
      },
    ],
  },
  {
    type: 'card',
    key: 'Location Information',
    title: 'Location Information',
    children: [
      {
        type: 'block',
        variant: 'table',
        columns: 4,
        fields: [
          {
            type: 'select',
            key: 'Set Type',
            label: 'Set Type',
            options: [
              { label: 'ON-LOCATION', value: 'ON-LOCATION' },
              { label: 'STUDIO', value: 'STUDIO' },
              { label: 'BACK-LOT', value: 'BACK-LOT' },
            ]
          },
          { type: 'text', key: 'Zone', label: 'Zone' },
          { type: 'text', key: 'Director\'s Note', label: 'Director\'s Note', span: 2 },
        ],
        subBlocks: [
          {
            label: 'Production Credits',
            key: 'Production Credits',
            fields: [
              { type: 'text', key: 'Director', label: 'Director' },
              { type: 'text', key: 'D.O.P.', label: 'D.O.P.' },
            ],
          },
          {
            label: 'Shoot Conditions',
            key: 'Shoot Conditions',
            fields: [
              {
                type: 'radio-group',
                key: 'Shoot Priority',
                label: 'Shoot Priority',
                options: [
                  { label: 'High', value: 'high' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Low', value: 'low' },
                ],
              },
              {
                type: 'checkbox-group',
                key: 'Lighting Condition',
                label: 'Lighting Condition',
                options: [
                  { label: 'GOLDEN HOUR', value: 'GOLDEN HOUR' },
                  { label: 'NATURAL', value: 'NATURAL' },
                  { label: 'ARTIFICIAL', value: 'ARTIFICIAL' },
                  { label: 'NIGHT EXTERIOR', value: 'NIGHT EXTERIOR' }
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

// ── Page action buttons ─────────────────────────────
export const pageActions: ActionButton[] = [
  {
    type: 'list',
    label: 'Back to List',
    visibleIn: 'all',  // Visible in all modes
    variant: 'secondary',
  },
  {
    type: 'edit',
    label: 'Edit',
    visibleIn: 'view',  // Visible only in view mode
    variant: 'primary',
  },
  {
    type: 'cancel',
    label: 'Cancel',
    visibleIn: ['edit', 'create'],  // Visible in edit and create modes
  },
  {
    type: 'save',
    label: 'Save',
    visibleIn: ['edit', 'create'],  // Visible in edit and create modes
    variant: 'primary',
  },
  {
    type: 'delete',
    label: 'Delete',
    visibleIn: 'view',  // Visible only in view mode
    variant: 'danger',
  },
  {
    type: 'next',
    label: 'Next',
    visibleIn: ['edit', 'view', 'create'],  // Visible in all modes
  },
]

export const PageSchema = {
  tableNodes,
  pageActions
}
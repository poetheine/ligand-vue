# CLAUDE.md

This file is a reference guide for Claude AI when working on the Ligand project.


## Project Overview

Ligand is a Vue 3-based Schema-Driven UI system.
Its core value is the flexibility to switch UI frameworks by swapping adapters.


## Do Not Modify Directly

- `src/types/adapter.types.ts` - `LigandAdapter` is the contract for all adapters; changes impact every adapter.
- `src/components/resolver/LigandResolver.vue` - must remain framework-agnostic despite adapter dependencies.
- `src/assets/tokens.css` `--ligand-*` variable names - these are part of the style contract layer.


## Code Authoring Rules

- Cell components must use both `defineModel()` and `defineProps<{ schema: XxxFieldSchema }>()`.
- Framework-specific logic in adapter files must live only inside `install()`.
- Do not place a `.vue` file with the same basename as a file under `src/types/` in the same directory (Vite resolves `.ts` first).
- When adding a new `FieldType`, work in this order: `schema.types.ts` -> each adapter `cells` map -> each `cells/*/` directory.


## New Adapter Checklist

1. Create `src/adapters/[name].adapter.ts`.
2. Implement `LigandAdapter` (`name`, `install`, `cells` required).
3. Create 6 cell components under `src/components/cells/[name]/`.
4. Add an import in `src/adapters/index.ts` (keep it commented).
5. Add the package to `optionalDependencies` in `package.json`.
6. Update the adapter list in `GUIDE.md`.


## Tech Stack

- Vue 3 + `<script setup lang="ts">`
- Vite (`@` = `src/` alias)
- TypeScript strict mode
- CSS Custom Properties (`--ligand-*`) - style contract layer

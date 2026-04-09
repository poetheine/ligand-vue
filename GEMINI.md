# GEMINI.md

This file is a reference guide for Gemini AI when working on the Ligand project.
It mirrors `CLAUDE.md`, adapted to Gemini's context handling style.


## Project Structure Summary

```
Ligand
├── Adapter layer    src/adapters/             UI framework switch point
├── Resolver         src/components/resolver/  schema -> component routing
├── Cell components  src/components/cells/     framework-specific implementations
├── Types            src/types/                schema/adapter contracts
└── Tokens           src/assets/tokens.css     --ligand-* CSS variables
```


## Key Files

| file | role | update frequency |
|---|---|---|
| `src/adapters/index.ts` | selects active adapter | when switching frameworks |
| `src/types/adapter.types.ts` | `LigandAdapter` interface | rare |
| `src/types/schema.types.ts` | `FieldSchema` union types | when adding field types |
| `src/components/resolver/LigandResolver.vue` | framework-agnostic router | rare |


## Common Task Patterns

**When adding a new field type**
Add type in `schema.types.ts` -> add entries in each adapter `cells` map -> create components in each `cells/*/` folder

**When adding a new adapter**
Create `adapters/[name].adapter.ts` -> add 6 components in `cells/[name]/` -> register in `adapters/index.ts` as a commented option

**When changing styles**
Update `--ligand-*` tokens only in `tokens.css`. Avoid hardcoded values in component files.


## Notes

- Never import framework-specific packages directly inside `LigandResolver.vue`.
- Cell components must use `defineModel()` for `v-model`.
- TypeScript strict mode is enabled.

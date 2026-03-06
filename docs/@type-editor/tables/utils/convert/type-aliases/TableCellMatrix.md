[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/convert](../README.md) / TableCellMatrix

# Type Alias: TableCellMatrix

```ts
type TableCellMatrix = ReadonlyArray<ReadonlyArray<PmNode | null>>;
```

Defined in: [tables/src/utils/convert.ts:10](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/tables/src/utils/convert.ts#L10)

A matrix representation of table cells, where each element is either a Node
(for the top-left cell of a merged region) or null (for continuation cells
that are part of a merged cell spanning from above or left).

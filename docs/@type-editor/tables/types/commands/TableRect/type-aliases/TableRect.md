[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/tables](../../../../README.md) / [types/commands/TableRect](../README.md) / TableRect

# Type Alias: TableRect

```ts
type TableRect = Rect & {
  map: TableMap;
  table: PmNode;
  tableStart: number;
};
```

Defined in: [tables/src/types/commands/TableRect.ts:10](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/types/commands/TableRect.ts#L10)

Represents a rectangular region within a table, extended with table-specific information.
This type combines the basic rectangle coordinates with the table context needed for operations.

## Type Declaration

| Name         | Type                                                            | Description                                                 | Defined in                                                                                                                                                                         |
| ------------ | --------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `map`        | [`TableMap`](../../../../tablemap/TableMap/classes/TableMap.md) | The table map providing cell position information           | [tables/src/types/commands/TableRect.ts:14](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/types/commands/TableRect.ts#L14) |
| `table`      | `PmNode`                                                        | The table node itself                                       | [tables/src/types/commands/TableRect.ts:16](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/types/commands/TableRect.ts#L16) |
| `tableStart` | `number`                                                        | The position where the table content starts in the document | [tables/src/types/commands/TableRect.ts:12](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/types/commands/TableRect.ts#L12) |

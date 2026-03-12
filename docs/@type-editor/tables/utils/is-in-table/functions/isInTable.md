[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/is-in-table](../README.md) / isInTable

# Function: isInTable()

```ts
function isInTable(state): boolean;
```

Defined in: [tables/src/utils/is-in-table.ts:21](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/tables/src/utils/is-in-table.ts#L21)

Checks whether the current selection is inside a table.

This function examines the selection's head position and traverses up
the document tree to determine if any ancestor is a table row.

## Parameters

| Parameter | Type            | Description               |
| --------- | --------------- | ------------------------- |
| `state`   | `PmEditorState` | The current editor state. |

## Returns

`boolean`

True if the selection is inside a table, false otherwise.

## Example

```typescript
if (isInTable(state)) {
  // Enable table-specific commands
}
```

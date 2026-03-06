[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/query](../README.md) / findTable

# Function: findTable()

```ts
function findTable($pos): FindNodeResult;
```

Defined in: [tables/src/utils/query.ts:103](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/utils/query.ts#L103)

Finds the closest table node containing the given position.

This function traverses up the document tree from the resolved position
to find the nearest ancestor node with a `tableRole` of `'table'` in its spec.

## Parameters

| Parameter | Type          | Description                           |
| --------- | ------------- | ------------------------------------- |
| `$pos`    | `ResolvedPos` | The resolved position to search from. |

## Returns

[`FindNodeResult`](../interfaces/FindNodeResult.md)

The [FindNodeResult](../interfaces/FindNodeResult.md) containing the table node and its position info,
or `null` if the position is not inside a table.

## Example

```typescript
const tableResult = findTable(state.selection.$from);
if (tableResult) {
  console.log("Table found at position:", tableResult.pos);
  console.log("Table has", tableResult.node.childCount, "rows");
}
```

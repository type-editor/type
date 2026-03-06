[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/cell-near](../README.md) / cellNear

# Function: cellNear()

```ts
function cellNear($pos): ResolvedPos;
```

Defined in: [tables/src/utils/cell-near.ts:24](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/utils/cell-near.ts#L24)

Finds a cell near the given position by traversing adjacent nodes.

This function first looks forward through nodeAfter and its first children,
then looks backward through nodeBefore and its last children. This is useful
when the position is at a table boundary rather than inside a cell.

## Parameters

| Parameter | Type          | Description                           |
| --------- | ------------- | ------------------------------------- |
| `$pos`    | `ResolvedPos` | The resolved position to search from. |

## Returns

`ResolvedPos`

The resolved position of the nearby cell, or undefined if none found.

## Example

```typescript
const $cell = cellNear($pos);
if ($cell) {
  console.log("Found cell near position");
}
```

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/commands](../../../README.md) / [util/helpers](../README.md) / findCutBefore

# Function: findCutBefore()

```ts
function findCutBefore($pos): ResolvedPos;
```

Defined in: [util/helpers.ts:100](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/commands/src/util/helpers.ts#L100)

Finds the position where a backward cut/join operation should occur.

This function traverses up the document tree from the given position to find
the nearest position where content can be joined or cut backward. It stops at
isolating nodes (nodes marked with `isolating: true` in their spec), which
prevent content from being joined across their boundaries.

The function looks for the first ancestor level where there's a sibling node
before the current position, indicating a valid cut point.

## Parameters

| Parameter | Type          | Description                          |
| --------- | ------------- | ------------------------------------ |
| `$pos`    | `ResolvedPos` | The position to start searching from |

## Returns

`ResolvedPos`

The position where a backward cut can occur, or null if none found

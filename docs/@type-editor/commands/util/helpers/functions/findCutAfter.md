[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/commands](../../../README.md) / [util/helpers](../README.md) / findCutAfter

# Function: findCutAfter()

```ts
function findCutAfter($pos): ResolvedPos;
```

Defined in: [util/helpers.ts:136](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/commands/src/util/helpers.ts#L136)

Finds the position where a forward cut/join operation should occur.

This function traverses up the document tree from the given position to find
the nearest position where content can be joined or cut forward. It stops at
isolating nodes (nodes marked with `isolating: true` in their spec), which
prevent content from being joined across their boundaries.

The function looks for the first ancestor level where there's a sibling node
after the current position, indicating a valid cut point.

## Parameters

| Parameter | Type          | Description                          |
| --------- | ------------- | ------------------------------------ |
| `$pos`    | `ResolvedPos` | The position to start searching from |

## Returns

`ResolvedPos`

The position where a forward cut can occur, or null if none found

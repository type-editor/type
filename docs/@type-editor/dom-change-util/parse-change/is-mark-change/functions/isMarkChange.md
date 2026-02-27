[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [parse-change/is-mark-change](../README.md) / isMarkChange

# Function: isMarkChange()

```ts
function isMarkChange(cur, prev): MarkChangeInfo;
```

Defined in: [parse-change/is-mark-change.ts:34](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/dom-change-util/src/dom-change/parse-change/is-mark-change.ts#L34)

Determines whether one fragment could be created from another by adding or removing
a single mark type. Used to optimize mark changes.

This is an optimization for detecting when a change is just adding or removing
formatting (like bold or italic) without changing the actual text content. When
detected, the change can be applied as a mark operation instead of a full content
replacement, which is more efficient and maintains better edit history.

The detection process:

1. Compares marks on the first child of each fragment
2. Calculates which marks were added and which were removed
3. If exactly one mark was added OR one was removed, it's a mark change
4. Applies the mark operation to all children and verifies it recreates the current fragment

Returns null if:

- Either fragment is empty
- More than one mark changed
- Both marks were added and removed
- Applying the mark change doesn't recreate the current fragment

## Parameters

| Parameter | Type       | Description                                   |
| --------- | ---------- | --------------------------------------------- |
| `cur`     | `Fragment` | The current (new) fragment after the change   |
| `prev`    | `Fragment` | The previous (old) fragment before the change |

## Returns

[`MarkChangeInfo`](../../../types/dom-change/MarkChangeInfo/interfaces/MarkChangeInfo.md)

Mark change information containing the mark and operation type,
or null if this isn't a simple mark change

## See

[MarkChangeInfo](../../../types/dom-change/MarkChangeInfo/interfaces/MarkChangeInfo.md) for return type structure

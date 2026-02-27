[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [diff/find-diff-start](../README.md) / findDiffStart

# Function: findDiffStart()

```ts
function findDiffStart(a, b, pos): number;
```

Defined in: [packages/model/src/diff/find-diff-start.ts:46](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/diff/find-diff-start.ts#L46)

Find the first position at which two fragments differ.

This function performs a deep comparison of two fragments, starting from the
beginning and moving forward until it finds the first difference. It compares
nodes recursively, checking:

- Reference equality (same node object)
- Markup equality (same type and attributes)
- Text content character-by-character for text nodes
- Child content recursively for container nodes

The comparison is optimized to skip identical subtrees by checking reference
equality first. For text nodes, it performs character-by-character comparison
to find the exact position where the text diverges.

## Parameters

| Parameter | Type                                                         | Description                                                                                                                                                             |
| --------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `a`       | [`Fragment`](../../../elements/Fragment/classes/Fragment.md) | The first fragment to compare.                                                                                                                                          |
| `b`       | [`Fragment`](../../../elements/Fragment/classes/Fragment.md) | The second fragment to compare.                                                                                                                                         |
| `pos`     | `number`                                                     | The starting position offset in the document. This is used to calculate absolute positions in the document tree. Should typically start at 0 for top-level comparisons. |

## Returns

`number`

The position where the fragments first differ, or `null` if the
fragments are identical. The position is relative to the start of
fragment `a` and accounts for the initial `pos` offset.

## Example

```typescript
const diff = findDiffStart(oldFragment, newFragment, 0);
if (diff !== null) {
  console.log(`Fragments differ at position ${diff}`);
} else {
  console.log("Fragments are identical");
}
```

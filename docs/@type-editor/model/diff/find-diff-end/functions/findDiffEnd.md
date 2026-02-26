[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [diff/find-diff-end](../README.md) / findDiffEnd

# Function: findDiffEnd()

```ts
function findDiffEnd(a, b, posA, posB): DiffPosition;
```

Defined in: [packages/model/src/diff/find-diff-end.ts:76](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/diff/find-diff-end.ts#L76)

Find the last position at which two fragments differ.

This function performs a deep comparison of two fragments, starting from the
end and moving backward until it finds the last difference. It's the complement
to `findDiffStart` and is used together with it to determine the exact range
of changes between two document states.

The function compares nodes in reverse order, checking:

- Reference equality (same node object)
- Markup equality (same type and attributes)
- Text content character-by-character from the end for text nodes
- Child content recursively for container nodes

Like `findDiffStart`, this function is optimized to skip identical subtrees
by checking reference equality first. For text nodes, it performs reverse
character-by-character comparison to find the exact position where the text
diverges from the end.

## Parameters

| Parameter | Type                                                         | Description                                                                                                                                                                 |
| --------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `a`       | [`Fragment`](../../../elements/Fragment/classes/Fragment.md) | The first fragment to compare.                                                                                                                                              |
| `b`       | [`Fragment`](../../../elements/Fragment/classes/Fragment.md) | The second fragment to compare.                                                                                                                                             |
| `posA`    | `number`                                                     | The ending position in fragment `a`. This should typically be the size of fragment `a` minus 1 for top-level comparisons. The function counts backwards from this position. |
| `posB`    | `number`                                                     | The ending position in fragment `b`. This should typically be the size of fragment `b` minus 1 for top-level comparisons. The function counts backwards from this position. |

## Returns

[`DiffPosition`](../../../types/diff/DiffPosition/interfaces/DiffPosition.md)

A `DiffPosition` object containing the positions where the fragments
last differ (`selfPos` in fragment `a` and `otherPos` in fragment `b`),
or `null` if the fragments are identical. The positions indicate the
end boundary of the differing region.

## Examples

```typescript
const diffEnd = findDiffEnd(
  oldFragment,
  newFragment,
  oldFragment.size,
  newFragment.size,
);
if (diffEnd !== null) {
  console.log(
    `Last difference at positions ${diffEnd.selfPos} and ${diffEnd.otherPos}`,
  );
} else {
  console.log("Fragments are identical");
}
```

```typescript
// Finding the exact range of changes
const start = findDiffStart(oldFragment, newFragment, 0);
const end = findDiffEnd(
  oldFragment,
  newFragment,
  oldFragment.size,
  newFragment.size,
);
if (start !== null && end !== null) {
  console.log(`Changes span from ${start} to ${end.selfPos} in old fragment`);
  console.log(`Changes span from ${start} to ${end.otherPos} in new fragment`);
}
```

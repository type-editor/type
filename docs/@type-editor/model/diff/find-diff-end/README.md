[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/model](../../README.md) / diff/find-diff-end

# diff/find-diff-end

## Functions

<table>
<thead>
<tr>
<th>Function</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[findDiffEnd](functions/findDiffEnd.md)

</td>
<td>

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

**Examples**

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

</td>
</tr>
</tbody>
</table>

[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/model](../../README.md) / diff/find-diff-start

# diff/find-diff-start

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

[findDiffStart](functions/findDiffStart.md)

</td>
<td>

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

**Example**

```typescript
const diff = findDiffStart(oldFragment, newFragment, 0);
if (diff !== null) {
  console.log(`Fragments differ at position ${diff}`);
} else {
  console.log("Fragments are identical");
}
```

</td>
</tr>
</tbody>
</table>

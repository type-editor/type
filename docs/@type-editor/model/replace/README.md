[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/model](../README.md) / replace

# replace

## Classes

<table>
<thead>
<tr>
<th>Class</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[ReplaceError](classes/ReplaceError.md)

</td>
<td>

Error type raised by [`Node.replace`](#model.Node.replace) when
given an invalid replacement.

This error is thrown when:

- The slice's open depth is deeper than the insertion position
- The open depths are inconsistent between start and end positions
- Attempting to join incompatible node types
- The range to remove or replace is not "flat" (spans incompatible node boundaries)

**Example**

```typescript
try {
  node.replace(from, to, slice);
} catch (error) {
  if (error instanceof ReplaceError) {
    console.error("Invalid replacement:", error.message);
  }
}
```

</td>
</tr>
</tbody>
</table>

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

[replace](functions/replace.md)

</td>
<td>

Replace a range of content between two resolved positions with a slice.
This is the main entry point for performing document replacements.

**Throws**

If the slice's open depth is invalid or inconsistent with the positions.

</td>
</tr>
</tbody>
</table>

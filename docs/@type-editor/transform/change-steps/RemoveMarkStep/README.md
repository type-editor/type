[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/transform](../../README.md) / change-steps/RemoveMarkStep

# change-steps/RemoveMarkStep

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

[RemoveMarkStep](classes/RemoveMarkStep.md)

</td>
<td>

A step that removes a mark from all inline content between two positions.

This step is used to remove formatting marks (like bold, italic, links) from a range
of inline content in the document. It only affects inline nodes that have the
specified mark applied.

**Example**

```typescript
// Remove a bold mark from text between positions 5 and 15
const step = new RemoveMarkStep(5, 15, schema.marks.strong.create());
```

</td>
</tr>
</tbody>
</table>

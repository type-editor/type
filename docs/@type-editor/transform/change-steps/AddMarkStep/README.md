[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/transform](../../README.md) / change-steps/AddMarkStep

# change-steps/AddMarkStep

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

[AddMarkStep](classes/AddMarkStep.md)

</td>
<td>

A step that adds a mark to all inline content between two positions.

This step is used to apply formatting marks (like bold, italic, links) to a range
of inline content in the document. It only affects inline nodes (text and inline
elements) and respects the schema's mark type restrictions.

**Example**

```typescript
// Add a bold mark to text between positions 5 and 15
const step = new AddMarkStep(5, 15, schema.marks.strong.create());
```

</td>
</tr>
</tbody>
</table>

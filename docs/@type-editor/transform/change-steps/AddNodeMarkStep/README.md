[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/transform](../../README.md) / change-steps/AddNodeMarkStep

# change-steps/AddNodeMarkStep

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

[AddNodeMarkStep](classes/AddNodeMarkStep.md)

</td>
<td>

A step that adds a mark to a specific node (not its content, but the node itself).

This step is used to apply marks to block-level nodes or other non-inline nodes.
Unlike AddMarkStep which affects inline content within a range, this step
targets a single node at a specific position and adds a mark to that node.

**Example**

```typescript
// Add a mark to the node at position 10
const step = new AddNodeMarkStep(10, schema.marks.highlight.create());
```

</td>
</tr>
</tbody>
</table>

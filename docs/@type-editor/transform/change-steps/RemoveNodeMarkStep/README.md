[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/transform](../../README.md) / change-steps/RemoveNodeMarkStep

# change-steps/RemoveNodeMarkStep

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

[RemoveNodeMarkStep](classes/RemoveNodeMarkStep.md)

</td>
<td>

A step that removes a mark from a specific node (not its content, but the node itself).

This step is used to remove marks from block-level nodes or other non-inline nodes.
Unlike RemoveMarkStep which affects inline content within a range, this step
targets a single node at a specific position and removes a mark from that node.

**Example**

```typescript
// Remove a mark from the node at position 10
const step = new RemoveNodeMarkStep(10, schema.marks.highlight.create());
```

</td>
</tr>
</tbody>
</table>

[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/transform](../../README.md) / change-steps/AttrStep

# change-steps/AttrStep

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

[AttrStep](classes/AttrStep.md)

</td>
<td>

An attribute step represents an update to a specific attribute
of a node at a given position in the document.

This step type is used to modify node attributes without changing the
node's content or structure. When applied, it creates a new version of
the node with the updated attribute value.

**Example**

```typescript
// Create a step that sets the 'align' attribute to 'center' on the node at position 5
const step = new AttrStep(5, "align", "center");
```

</td>
</tr>
</tbody>
</table>

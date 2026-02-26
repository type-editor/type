[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/transform](../../README.md) / change-steps/DocAttrStep

# change-steps/DocAttrStep

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

[DocAttrStep](classes/DocAttrStep.md)

</td>
<td>

A document attribute step represents an update to an attribute
of the document node itself (rather than a node within the document).

This step type is used to modify document-level attributes such as metadata
or configuration settings without affecting the document's content structure.

**Example**

```typescript
// Create a step that sets the 'language' attribute on the document node
const step = new DocAttrStep("language", "en-US");
```

</td>
</tr>
</tbody>
</table>

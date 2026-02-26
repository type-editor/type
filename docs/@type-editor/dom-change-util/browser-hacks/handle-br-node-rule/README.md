[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-change-util](../../README.md) / browser-hacks/handle-br-node-rule

# browser-hacks/handle-br-node-rule

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

[handleBRNodeRule](functions/handleBRNodeRule.md)

</td>
<td>

Handles parsing rules for BR nodes, working around Safari quirks.

Safari has several quirks related to BR elements that require special handling:

1. **List/Table Cell Deletion (issues #708, #862):**
   When deleting the last character in a list item or table cell, Safari
   replaces the list item/cell with a BR directly in the parent list/table node.
   This creates invalid HTML structure (BR as direct child of UL/OL) that needs
   to be corrected during parsing by wrapping it in a proper list item.

2. **Trailing BR in Tables:**
   Safari sometimes adds trailing BR elements in table rows/cells that should
   be ignored during parsing as they're artifacts of the contentEditable behavior.

The function examines the parent node to determine which quirk is occurring
and returns the appropriate parse rule to handle it correctly.

**See**

- https://github.com/ProseMirror/prosemirror/issues/708
- https://github.com/ProseMirror/prosemirror/issues/862

</td>
</tr>
</tbody>
</table>

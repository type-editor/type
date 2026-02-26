[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/decoration](../../README.md) / decoration/view-decorations

# decoration/view-decorations

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

[viewDecorations](functions/viewDecorations.md)

</td>
<td>

Get the decorations associated with the current props of a view.
This function collects decorations from all plugin decorations props
and the cursor wrapper if present.

This is called internally by the view to collect all decorations that
should be rendered. It aggregates decorations from:

- All plugins that provide a `decorations` prop
- The cursor wrapper (for gap cursor, etc.)

</td>
</tr>
</tbody>
</table>

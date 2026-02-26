[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/viewdesc](../README.md) / OuterDecoLevel

# OuterDecoLevel

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

[OuterDecoLevel](classes/OuterDecoLevel.md)

</td>
<td>

Represents a level of outer decoration wrapping, storing HTML attributes
like nodeName, class, style, and other custom attributes as key-value pairs.

Decorations can add multiple wrapper layers around nodes. Each layer can:

- Specify a nodeName to create a new wrapper element
- Add CSS classes
- Add inline styles
- Add custom HTML attributes

For example, a node might be wrapped like:
`<div class="highlight"><span style="color: red">content</span></div>`
This would use two OuterDecoLevel instances.

</td>
</tr>
</tbody>
</table>

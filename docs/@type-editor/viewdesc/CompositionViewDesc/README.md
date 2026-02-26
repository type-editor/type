[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/viewdesc](../README.md) / CompositionViewDesc

# CompositionViewDesc

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

[CompositionViewDesc](classes/CompositionViewDesc.md)

</td>
<td>

A composition view desc is used to handle ongoing composition input,
temporarily representing composed text that hasn't been committed yet.

Composition is the process of entering complex characters (e.g., accented
characters, CJK characters) using an Input Method Editor (IME). During
composition, the browser creates temporary DOM nodes that don't yet
correspond to actual document content. This class protects those nodes
from being removed during updates until composition is complete.

</td>
</tr>
</tbody>
</table>

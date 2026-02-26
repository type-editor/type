[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/state](../../README.md) / editor-state/EditorState

# editor-state/EditorState

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

[EditorState](classes/EditorState.md)

</td>
<td>

The state of a ProseMirror editor is represented by an object of
this type. A state is a persistent data structure—it isn't
updated, but rather a new state value is computed from an old one
using the [`apply`](#state.EditorState.apply) method.

A state holds a number of built-in fields, and plugins can
[define](#state.PluginSpec.state) additional fields.

</td>
</tr>
</tbody>
</table>

## Interfaces

<table>
<thead>
<tr>
<th>Interface</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[EditorStateConfiguration](interfaces/EditorStateConfiguration.md)

</td>
<td>

Configuration object wrapping the part of a state object that stays the same
across transactions. Stored in the state's `config` property.

</td>
</tr>
</tbody>
</table>

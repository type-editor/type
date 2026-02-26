[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/state](../README.md) / Transaction

# Transaction

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

[Transaction](classes/Transaction.md)

</td>
<td>

An editor state transaction, which can be applied to a state to
create an updated state. Use
[`EditorState.tr`](#state.EditorState.tr) to create an instance.

Transactions track changes to the document (they are a subclass of
[`Transform`](#transform.Transform)), but also other state changes,
like selection updates and adjustments of the set of [stored
marks](#state.EditorState.storedMarks). In addition, you can store
metadata properties in a transaction, which are extra pieces of
information that client code or plugins can use to describe what a
transaction represents, so that they can update their [own
state](#state.StateField) accordingly.

The [editor view](#view.EditorView) uses a few metadata
properties: it will attach a property `'pointer'` with the value
`true` to selection transactions directly caused by mouse or touch
input, a `'composition'` property holding an ID identifying the
composition that caused it to transactions caused by composed DOM
input, and a `'uiEvent'` property of that may be `'paste'`,
`'cut'`, or `'drop'`.

</td>
</tr>
</tbody>
</table>

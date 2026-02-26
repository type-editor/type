[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/state](../../README.md) / editor-state/FieldDesc

# editor-state/FieldDesc

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

[FieldDesc](classes/FieldDesc.md)

</td>
<td>

**`Internal`**

Descriptor for a state field that can be initialized and updated.
Wraps the init and apply functions from a StateField specification,
binding them to an optional context object (typically a plugin instance).

This class serves as an adapter that manages the lifecycle of state fields,
ensuring proper initialization and updates when transactions are applied.
It handles function binding when a context object is provided, allowing
StateField methods to maintain their expected `this` context.

</td>
</tr>
</tbody>
</table>

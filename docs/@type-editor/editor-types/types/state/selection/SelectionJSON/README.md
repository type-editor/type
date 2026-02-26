[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/editor-types](../../../../README.md) / types/state/selection/SelectionJSON

# types/state/selection/SelectionJSON

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

[SelectionJSON](interfaces/SelectionJSON.md)

</td>
<td>

JSON representation of a selection for serialization.
Different selection types may use different properties:

- TEXT selections use `anchor` and `head`
- NODE selections use `anchor`
- ALL selections only need `type`

</td>
</tr>
</tbody>
</table>

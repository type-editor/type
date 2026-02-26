[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/collab](../README.md) / receive-transaction

# receive-transaction

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

[receiveTransaction](functions/receiveTransaction.md)

</td>
<td>

Creates a transaction that represents a set of new steps received from
the central authority. Applying this transaction moves the state forward
to adjust to the authority's view of the document.

This function handles three scenarios:

1. Steps that originated from this client are confirmed and removed from unconfirmed.
2. Steps from other clients are applied directly if there are no local changes.
3. If there are local unconfirmed changes, they are rebased over the remote steps.

</td>
</tr>
</tbody>
</table>

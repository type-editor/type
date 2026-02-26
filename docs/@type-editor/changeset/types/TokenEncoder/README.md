[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/changeset](../../README.md) / types/TokenEncoder

# types/TokenEncoder

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

[TokenEncoder](interfaces/TokenEncoder.md)

</td>
<td>

A token encoder can be passed when creating a `ChangeSet` in order
to influence the way the library runs its diffing algorithm. The
encoder determines how document tokens (such as nodes and
characters) are encoded and compared.

Note that both the encoding and the comparison may run a lot, and
doing non-trivial work in these functions could impact
performance.

</td>
</tr>
</tbody>
</table>

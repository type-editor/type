[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / fixtables/fix-tables

# fixtables/fix-tables

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

[fixTables](functions/fixTables.md)

</td>
<td>

Inspects all tables in the given state's document and returns a
transaction that fixes any structural issues, if necessary.

When a previous known-good state is provided, only the changed parts
of the document are scanned, which improves performance for large documents.

</td>
</tr>
</tbody>
</table>

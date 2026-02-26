[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/model](../../README.md) / elements/ResolvedPos

# elements/ResolvedPos

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

[ResolvedPos](classes/ResolvedPos.md)

</td>
<td>

You can [_resolve_](#model.Node.resolve) a position to get more
information about it. Objects of this class represent such a
resolved position, providing various pieces of context
information, and some helper methods.

Throughout this interface, methods that take an optional `depth`
parameter will interpret undefined as `this.depth` and negative
numbers as `this.depth + value`.

**Remarks**

The internal path structure stores nodes and positions in triplets:
[node, index, position] for each level of the document tree.

</td>
</tr>
</tbody>
</table>

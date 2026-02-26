[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/transform](../../README.md) / change-map/StepMap

# change-map/StepMap

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

[StepMap](classes/StepMap.md)

</td>
<td>

A map describing the deletions and insertions made by a step, which
can be used to find the correspondence between positions in the
pre-step version of a document and the same position in the
post-step version.
\<br/\>
This class uses recovery values.
Recovery values encode a range index and an offset. They are
represented as numbers, because tons of them will be created when
mapping, for example, a large number of decorations. The number's
lower 16 bits provide the index, the remaining bits the offset.

Note: We intentionally don't use bit shift operators to en- and
decode these, since those clip to 32 bits, which we might in rare
cases want to overflow. A 64-bit float can represent 48-bit
integers precisely.

</td>
</tr>
</tbody>
</table>

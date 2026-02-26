[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/decoration](../../README.md) / decoration/DecorationGroup

# decoration/DecorationGroup

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

[DecorationGroup](classes/DecorationGroup.md)

</td>
<td>

**`Internal`**

An abstraction that allows the code dealing with decorations to
treat multiple DecorationSet objects as if it were a single object
with (a subset of) the same interface. This is used when multiple
decoration sources need to be combined.

DecorationGroup is used internally when multiple plugins provide
decorations for the same view. It efficiently combines multiple
decoration sets without merging them into a single set, which allows
for better performance when mapping through changes.

</td>
</tr>
</tbody>
</table>

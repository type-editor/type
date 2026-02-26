[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/viewdesc](../README.md) / TrailingHackViewDesc

# TrailingHackViewDesc

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

[TrailingHackViewDesc](classes/TrailingHackViewDesc.md)

</td>
<td>

A dummy desc used to tag trailing BR or IMG nodes created to work
around contentEditable terribleness.

Browsers behave inconsistently with empty block elements or blocks ending
without proper line breaks. These hack nodes ensure proper cursor placement
and visual representation:

- BR: Makes empty blocks or block ends properly display and accept cursor
- IMG: Used as a separator in some cases to work around browser bugs

</td>
</tr>
</tbody>
</table>

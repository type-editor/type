[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/gapcursor](../README.md) / GapCursor

# GapCursor

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

[GapCursor](classes/GapCursor.md)

</td>
<td>

Represents a gap cursor selection - a cursor positioned between block nodes
where regular text selection is not possible.

Gap cursors are used in positions where the document structure doesn't allow
normal text cursors, such as between two adjacent block nodes (e.g., between
two code blocks or between a heading and an image).

Both `$anchor` and `$head` properties point at the same cursor position since
gap cursors don't represent a range but a single point between nodes.

**Example**

```ts
// A gap cursor between two paragraphs:
// <p>First paragraph</p>
// [gap cursor here]
// <p>Second paragraph</p>
```

</td>
</tr>
</tbody>
</table>

[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/schema](../../README.md) / list-commands/split-list-item-keep-marks

# list-commands/split-list-item-keep-marks

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

[splitListItemKeepMarks](functions/splitListItemKeepMarks.md)

</td>
<td>

Build a command that splits a list item while preserving active marks.

Acts like [`splitListItem`](#schema-list.splitListItem), but
without resetting the set of active marks at the cursor. This is useful
when you want to maintain formatting (bold, italic, etc.) when creating
a new list item.

The command preserves marks from either:

- The stored marks in the editor state, or
- The marks at the current cursor position (if the cursor has a parent offset)

**Example**

```typescript
// Create a command that splits list items while keeping marks
const command = splitListItemKeepMarks(schema.nodes.list_item);
command(state, dispatch);
```

</td>
</tr>
</tbody>
</table>

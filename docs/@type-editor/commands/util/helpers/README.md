[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / util/helpers

# util/helpers

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

[atBlockEnd](functions/atBlockEnd.md)

</td>
<td>

Checks if the cursor is at the end of a textblock.

This function determines whether the selection is a cursor positioned at the
very end of a textblock. It uses the view (if provided) for accurate
bidirectional text detection, which is important for languages with right-to-left
text direction.

</td>
</tr>
<tr>
<td>

[atBlockStart](functions/atBlockStart.md)

</td>
<td>

Checks if the cursor is at the start of a textblock.

This function determines whether the selection is a cursor positioned at the
very beginning of a textblock. It uses the view (if provided) for accurate
bidirectional text detection, which is important for languages with right-to-left
text direction.

</td>
</tr>
<tr>
<td>

[deleteBarrier](functions/deleteBarrier.md)

</td>
<td>

Attempts to delete or join nodes separated by a structural barrier.

This is a complex function that implements multiple strategies for handling
deletion or joining when there's a structural barrier (like different node types
or isolating nodes) between content. It tries several approaches in order:

1. **Simple Join**: Try basic joining if nodes are compatible
2. **Wrap and Merge**: Wrap the after node to make it compatible, then merge
3. **Lift**: Lift the after content up in the hierarchy
4. **Join Textblocks**: Find and join inner textblocks across the barrier

This function is used by backward and forward joining commands to handle
complex structural scenarios that simple joining can't handle.

</td>
</tr>
<tr>
<td>

[findCutAfter](functions/findCutAfter.md)

</td>
<td>

Finds the position where a forward cut/join operation should occur.

This function traverses up the document tree from the given position to find
the nearest position where content can be joined or cut forward. It stops at
isolating nodes (nodes marked with `isolating: true` in their spec), which
prevent content from being joined across their boundaries.

The function looks for the first ancestor level where there's a sibling node
after the current position, indicating a valid cut point.

</td>
</tr>
<tr>
<td>

[findCutBefore](functions/findCutBefore.md)

</td>
<td>

Finds the position where a backward cut/join operation should occur.

This function traverses up the document tree from the given position to find
the nearest position where content can be joined or cut backward. It stops at
isolating nodes (nodes marked with `isolating: true` in their spec), which
prevent content from being joined across their boundaries.

The function looks for the first ancestor level where there's a sibling node
before the current position, indicating a valid cut point.

</td>
</tr>
<tr>
<td>

[textblockAt](functions/textblockAt.md)

</td>
<td>

Checks if a node contains a textblock at its start or end.

This function traverses down from the given node to determine if there's a
textblock accessible at the specified side. It navigates through the node
hierarchy following either first or last children depending on the side.

**Example**

```typescript
// Check if a blockquote starts with a textblock
const startsWithText = textblockAt(blockquoteNode, "start");

// Check if a list item ends with a single textblock
const endsWithOnlyText = textblockAt(listItemNode, "end", true);
```

</td>
</tr>
</tbody>
</table>

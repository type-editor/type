[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / join-list-item-backward

# join-list-item-backward

## Variables

<table>
<thead>
<tr>
<th>Variable</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[joinListItemBackward](variables/joinListItemBackward.md)

</td>
<td>

Handles backspace at the start of the first paragraph of a list item when the previous
sibling list item also ends with a paragraph.

In the default `joinBackward` behaviour, pressing backspace at the start of item 2 in:

```
• Hello
• World   ← cursor at start
```

merges the two _list items_, producing a single list item with **two paragraphs**:

```
• Hello
  World
```

This command goes one step further and **also merges the two paragraphs**, inserting a
single space between the text content so the result is:

```
• Hello World   ← cursor placed after the inserted space
```

The command is intentionally narrow: it only fires when

- the cursor is at the very start of a textblock,
- that textblock is the **first** child of its parent node (the list item),
- the list item is **not** the first child of its own parent (a previous sibling exists),
- the previous sibling list item's **last** child is also a textblock (so the merge
  is content-compatible).

All other cursor positions fall through to the normal `joinBackward` / `selectNodeBackward`
commands, so existing behaviour is fully preserved.

**Param**

The current editor state.

**Param**

Optional dispatch function to execute the transaction.

**Param**

Optional editor view for bidirectional-text detection.

</td>
</tr>
</tbody>
</table>

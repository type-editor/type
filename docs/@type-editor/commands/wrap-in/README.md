[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / wrap-in

# wrap-in

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

[wrapIn](functions/wrapIn.md)

</td>
<td>

Creates a command that wraps the selection in a node of the given type.

This command factory creates commands that wrap the selected blocks in a container
node. This is commonly used for:

- Wrapping paragraphs in blockquotes
- Creating lists by wrapping items in list containers
- Adding other structural wrappers (like divs, sections, etc.)
- Increasing indentation levels

The command determines the appropriate wrapping structure by analyzing the schema
and the current document structure. It will find the sequence of nodes needed to
legally wrap the selection in the target node type.

The command will fail if:

- No valid wrapping structure can be found for the selection
- The schema doesn't allow the target node type to wrap the selected content
- The selection cannot be converted to a block range

**Example**

```typescript
// Create commands for common wrapping operations
const wrapInBlockquote = wrapIn(schema.nodes.blockquote);
const wrapInBulletList = wrapIn(schema.nodes.bullet_list);
const wrapInOrderedList = wrapIn(schema.nodes.ordered_list, { order: 1 });

// Use in a keymap
const keymap = {
  "Mod->": wrapInBlockquote,
  "Shift-Ctrl-8": wrapInBulletList,
  "Shift-Ctrl-9": wrapInOrderedList,
};

// Use in a menu
const menuItem = {
  label: "Wrap in blockquote",
  run: wrapIn(schema.nodes.blockquote),
  enable: (state) => wrapIn(schema.nodes.blockquote)(state),
  icon: quoteIcon,
};
```

</td>
</tr>
</tbody>
</table>

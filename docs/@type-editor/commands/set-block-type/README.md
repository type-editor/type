[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / set-block-type

# set-block-type

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

[setBlockType](functions/setBlockType.md)

</td>
<td>

Creates a command that converts selected textblocks to a given node type.

This command factory function returns a command that attempts to change the type
of all textblocks within the selection to the specified node type with the given
attributes. This is commonly used for:

- Converting paragraphs to headings
- Changing heading levels
- Converting blocks to code blocks
- Setting or removing block-level formatting

The command will check each textblock in the selection and only proceed if at least
one block can be converted. Blocks that already have the target type and attributes
are skipped. The command respects schema constraints and will only convert blocks
where the parent node allows the new type.

**Example**

```typescript
// Create commands for different heading levels
const makeH1 = setBlockType(schema.nodes.heading, { level: 1 });
const makeH2 = setBlockType(schema.nodes.heading, { level: 2 });
const makeParagraph = setBlockType(schema.nodes.paragraph);

// Use in a keymap
const keymap = {
  "Mod-Alt-1": makeH1,
  "Mod-Alt-2": makeH2,
  "Mod-Alt-0": makeParagraph,
};

// Use in a menu
const menuItem = {
  label: "Convert to Heading 1",
  run: setBlockType(schema.nodes.heading, { level: 1 }),
  enable: (state) => setBlockType(schema.nodes.heading, { level: 1 })(state),
};
```

</td>
</tr>
</tbody>
</table>

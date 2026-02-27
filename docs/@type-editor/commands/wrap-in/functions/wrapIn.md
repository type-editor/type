[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [wrap-in](../README.md) / wrapIn

# Function: wrapIn()

```ts
function wrapIn(nodeType, attrs?): Command;
```

Defined in: [wrap-in.ts:52](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commands/src/wrap-in.ts#L52)

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

## Parameters

| Parameter  | Type                                              | Default value | Description                                                       |
| ---------- | ------------------------------------------------- | ------------- | ----------------------------------------------------------------- |
| `nodeType` | `NodeType`                                        | `undefined`   | The type of node to wrap the selection in                         |
| `attrs`    | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; | `null`        | Optional attributes to set on the wrapper node (defaults to null) |

## Returns

`Command`

A command that performs the wrapping

## Example

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

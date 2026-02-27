[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/schema](../../../README.md) / [list-commands/sink-list-item](../README.md) / sinkListItem

# Function: sinkListItem()

```ts
function sinkListItem(itemType): Command;
```

Defined in: [list-commands/sink-list-item.ts:22](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/schema/src/list-commands/sink-list-item.ts#L22)

Creates a command to sink (indent) the list item around the selection down
into an inner nested list.

This command moves the selected list item(s) into a sublist of the preceding
sibling list item, effectively increasing the indentation level. The command
will fail if:

- There is no valid block range containing list items
- The selected item is the first item (no preceding sibling to nest under)
- The preceding sibling is not a list item of the same type

## Parameters

| Parameter  | Type       | Description                                                |
| ---------- | ---------- | ---------------------------------------------------------- |
| `itemType` | `NodeType` | The node type of the list item to sink (e.g., `list_item`) |

## Returns

`Command`

A command function that takes the editor state and optional dispatch function.
Returns `true` if the command can be applied, `false` otherwise.

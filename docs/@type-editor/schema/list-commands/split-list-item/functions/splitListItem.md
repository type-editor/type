[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/schema](../../../README.md) / [list-commands/split-list-item](../README.md) / splitListItem

# Function: splitListItem()

```ts
function splitListItem(itemType, itemAttrs?): Command;
```

Defined in: [list-commands/split-list-item.ts:19](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/schema/src/list-commands/split-list-item.ts#L19)

Build a command that splits a list item at the current selection position.

This command handles two scenarios:

1. Regular list item split: Splits the list item at the cursor position,
   creating a new list item below with the content after the cursor.
2. Empty nested list item: When pressing enter in an empty nested list item,
   it lifts the item out of the nested list structure.

## Parameters

| Parameter    | Type       | Description                                                 |
| ------------ | ---------- | ----------------------------------------------------------- |
| `itemType`   | `NodeType` | The node type of the list item to split                     |
| `itemAttrs?` | `Attrs`    | Optional attributes to apply to the newly created list item |

## Returns

`Command`

A command function that can be dispatched to the editor state

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/schema](../../../README.md) / [list-commands/lift-list-item](../README.md) / liftListItem

# Function: liftListItem()

```ts
function liftListItem(itemType): Command;
```

Defined in: [list-commands/lift-list-item.ts:18](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/schema/src/list-commands/lift-list-item.ts#L18)

Create a command to lift the list item around the selection up into
a wrapping list.

This command handles two scenarios:

1. If the selection is inside a nested list item, it lifts the item to the outer list
2. If the selection is in an outer list item, it lifts the item out of the list entirely

## Parameters

| Parameter  | Type       | Description                            |
| ---------- | ---------- | -------------------------------------- |
| `itemType` | `NodeType` | The node type of the list item to lift |

## Returns

`Command`

A command function that can be executed with editor state and optional dispatch

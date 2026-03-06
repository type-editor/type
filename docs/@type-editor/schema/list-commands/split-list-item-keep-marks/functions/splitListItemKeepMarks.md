[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/schema](../../../README.md) / [list-commands/split-list-item-keep-marks](../README.md) / splitListItemKeepMarks

# Function: splitListItemKeepMarks()

```ts
function splitListItemKeepMarks(itemType, itemAttrs?): Command;
```

Defined in: [list-commands/split-list-item-keep-marks.ts:30](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/schema/src/list-commands/split-list-item-keep-marks.ts#L30)

Build a command that splits a list item while preserving active marks.

Acts like [`splitListItem`](#schema-list.splitListItem), but
without resetting the set of active marks at the cursor. This is useful
when you want to maintain formatting (bold, italic, etc.) when creating
a new list item.

The command preserves marks from either:

- The stored marks in the editor state, or
- The marks at the current cursor position (if the cursor has a parent offset)

## Parameters

| Parameter    | Type       | Description                                                 |
| ------------ | ---------- | ----------------------------------------------------------- |
| `itemType`   | `NodeType` | The node type of the list item to split                     |
| `itemAttrs?` | `Attrs`    | Optional attributes to apply to the newly created list item |

## Returns

`Command`

A command function that can be dispatched to the editor state

## Example

```typescript
// Create a command that splits list items while keeping marks
const command = splitListItemKeepMarks(schema.nodes.list_item);
command(state, dispatch);
```

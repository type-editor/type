[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [set-attribute](../README.md) / setAttribute

# Function: setAttribute()

```ts
function setAttribute(attributeName, attribute, ...applyToParent): Command;
```

Defined in: [set-attribute.ts:28](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/commands/src/set-attribute.ts#L28)

Creates a command that sets an attribute on nodes within the current selection.

This command has two modes of operation:

1. **Parent mode** (when `applyToParent` is specified): Finds the outermost ancestor node
   matching one of the specified node types and sets the attribute on it. This is useful
   for setting attributes on block-level containers like paragraphs or headings.

2. **Selection mode** (default): Traverses all nodes within the selection range and
   updates the attribute on any non-text node that supports it.

The command preserves the current selection after applying changes and uses structural
sharing to minimize memory allocations when transforming the document.

## Parameters

| Parameter          | Type         | Description                                                                                                                                                          |
| ------------------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `attributeName`    | `string`     | The name of the attribute to set.                                                                                                                                    |
| `attribute`        | `string`     | The value to set for the attribute.                                                                                                                                  |
| ...`applyToParent` | `NodeType`[] | Optional list of node types. If provided, the attribute will be applied to the outermost ancestor matching one of these types instead of nodes within the selection. |

## Returns

`Command`

A command function that sets the attribute when executed. Returns `true` if
the attribute was changed, `false` if no change was needed.

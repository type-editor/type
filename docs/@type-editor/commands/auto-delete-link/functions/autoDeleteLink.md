[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [auto-delete-link](../README.md) / autoDeleteLink

# Function: autoDeleteLink()

```ts
function autoDeleteLink(keyType, linkMarkType?, fileLinkType?): Command;
```

Defined in: [auto-delete-link.ts:36](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/commands/src/auto-delete-link.ts#L36)

Creates a command that removes link marks from the current selection or cursor position.

If the cursor is positioned within a link (empty selection), the command will automatically
extend the selection to cover the entire linked text range before removing the link mark.
If there's an active selection, it removes the link mark from the entire selected range.

## Parameters

| Parameter      | Type                 | Default value       | Description                                                                        |
| -------------- | -------------------- | ------------------- | ---------------------------------------------------------------------------------- |
| `keyType`      | `AutoLinkTriggerKey` | `undefined`         | -                                                                                  |
| `linkMarkType` | `MarkType`           | `schema.marks.link` | The mark type to remove. Defaults to the link mark from the schema.                |
| `fileLinkType` | `NodeType`           | `schema.nodes.file` | The node type for file links to remove. Defaults to the file node from the schema. |

## Returns

`Command`

A command function that can be executed on an editor state.

## Example

```typescript
// Remove link at cursor position or from selection
const command = autoDeleteLink();
command(editorState, dispatch);

// Use with custom mark type
const customCommand = autoDeleteLink(customLinkMarkType);
```

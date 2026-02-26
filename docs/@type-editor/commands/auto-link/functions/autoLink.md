[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [auto-link](../README.md) / autoLink

# Function: autoLink()

```ts
function autoLink(keyType, linkMarkType?, codeNodeType?): Command;
```

Defined in: [auto-link.ts:56](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/commands/src/auto-link.ts#L56)

Automatically converts URLs to clickable links when Enter or Space is pressed.

This command detects URLs in the editor and automatically wraps them with a link mark
when the user presses Enter or Space. It supports both explicit protocols (http://, https://)
and implicit URLs (example.com).

## Parameters

| Parameter      | Type                                                          | Default value             | Description                                                                                             |
| -------------- | ------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `keyType`      | [`AutoLinkTriggerKey`](../type-aliases/AutoLinkTriggerKey.md) | `undefined`               | The key that triggers the auto-link behavior ('Enter' or 'Space')                                       |
| `linkMarkType` | `MarkType`                                                    | `schema.marks.link`       | The mark type to use for creating links (defaults to schema.marks.link)                                 |
| `codeNodeType` | `NodeType`                                                    | `schema.nodes.code_block` | The node type for code blocks to prevent auto-linking inside them (defaults to schema.nodes.code_block) |

## Returns

`Command`

A command function that can be executed in the editor

## Example

```typescript
// Create an auto-link command for the Enter key
const autoLinkOnEnter = autoLink("Enter");

// Create an auto-link command for the Space key with a custom mark type
const autoLinkOnSpace = autoLink("Space", customLinkMarkType);
```

## Remarks

- The command will not create a link if one already exists at the cursor position
- For Enter key: matches URLs that span the entire line from the start
- for Space key: matches URLs that appear after whitespace or at the start
- URLs are automatically normalized to include the https:// protocol if missing
- Returns `true` for Enter key (to indicate the command handled the event)
- Returns `false` for Space key (to allow default behavior)

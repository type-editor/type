[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [clear-text-formatting](../README.md) / clearTextFormatting

# Function: clearTextFormatting()

```ts
function clearTextFormatting(state, dispatch): boolean;
```

Defined in: [clear-text-formatting.ts:19](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commands/src/clear-text-formatting.ts#L19)

Removes common text formatting marks from the current selection.

This command removes the following mark types if they exist in the schema:

- `strong` (bold)
- `em` (italic)
- `underline`
- `link`

## Parameters

| Parameter  | Type               | Description                                                                                                             |
| ---------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `state`    | `PmEditorState`    | The current editor state.                                                                                               |
| `dispatch` | `DispatchFunction` | The dispatch function to apply the transaction. If provided and marks were removed, the transaction will be dispatched. |

## Returns

`boolean`

`true` if any marks were found in the schema and potentially removed,
`false` otherwise.

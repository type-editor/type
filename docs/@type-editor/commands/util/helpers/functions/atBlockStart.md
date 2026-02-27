[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/commands](../../../README.md) / [util/helpers](../README.md) / atBlockStart

# Function: atBlockStart()

```ts
function atBlockStart(state, view?): ResolvedPos;
```

Defined in: [util/helpers.ts:34](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/commands/src/util/helpers.ts#L34)

Checks if the cursor is at the start of a textblock.

This function determines whether the selection is a cursor positioned at the
very beginning of a textblock. It uses the view (if provided) for accurate
bidirectional text detection, which is important for languages with right-to-left
text direction.

## Parameters

| Parameter | Type            | Description                                           |
| --------- | --------------- | ----------------------------------------------------- |
| `state`   | `PmEditorState` | The current editor state                              |
| `view?`   | `PmEditorView`  | Optional editor view for bidirectional text detection |

## Returns

`ResolvedPos`

The cursor position if at block start, null otherwise

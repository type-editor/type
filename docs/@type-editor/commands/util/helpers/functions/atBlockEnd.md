[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/commands](../../../README.md) / [util/helpers](../README.md) / atBlockEnd

# Function: atBlockEnd()

```ts
function atBlockEnd(state, view?): ResolvedPos;
```

Defined in: [util/helpers.ts:66](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/commands/src/util/helpers.ts#L66)

Checks if the cursor is at the end of a textblock.

This function determines whether the selection is a cursor positioned at the
very end of a textblock. It uses the view (if provided) for accurate
bidirectional text detection, which is important for languages with right-to-left
text direction.

## Parameters

| Parameter | Type            | Description                                           |
| --------- | --------------- | ----------------------------------------------------- |
| `state`   | `PmEditorState` | The current editor state                              |
| `view?`   | `PmEditorView`  | Optional editor view for bidirectional text detection |

## Returns

`ResolvedPos`

The cursor position if at block end, null otherwise

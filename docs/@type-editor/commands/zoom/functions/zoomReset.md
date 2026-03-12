[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [zoom](../README.md) / zoomReset

# Function: zoomReset()

```ts
function zoomReset(_state, _dispatch, view): boolean;
```

Defined in: [zoom.ts:34](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/commands/src/zoom.ts#L34)

Command to reset the editor view zoom to 100%.

## Parameters

| Parameter   | Type               | Description                        |
| ----------- | ------------------ | ---------------------------------- |
| `_state`    | `PmEditorState`    | The current editor state (unused). |
| `_dispatch` | `DispatchFunction` | The dispatch function (unused).    |
| `view`      | `PmEditorView`     | The editor view to reset zoom.     |

## Returns

`boolean`

`true` if the zoom was reset successfully.

[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [zoom](../README.md) / zoomOut

# Function: zoomOut()

```ts
function zoomOut(_state, _dispatch, view): boolean;
```

Defined in: [zoom.ts:23](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/commands/src/zoom.ts#L23)

Command to zoom out the editor view by 10%, down to a minimum of 10%.

## Parameters

| Parameter   | Type               | Description                        |
| ----------- | ------------------ | ---------------------------------- |
| `_state`    | `PmEditorState`    | The current editor state (unused). |
| `_dispatch` | `DispatchFunction` | The dispatch function (unused).    |
| `view`      | `PmEditorView`     | The editor view to zoom.           |

## Returns

`boolean`

`true` if the zoom was applied successfully.

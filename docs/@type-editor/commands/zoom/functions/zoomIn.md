[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [zoom](../README.md) / zoomIn

# Function: zoomIn()

```ts
function zoomIn(_state, _dispatch, view): boolean;
```

Defined in: [zoom.ts:12](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/commands/src/zoom.ts#L12)

Command to zoom in the editor view by 10%, up to a maximum of 200%.

## Parameters

| Parameter   | Type               | Description                        |
| ----------- | ------------------ | ---------------------------------- |
| `_state`    | `PmEditorState`    | The current editor state (unused). |
| `_dispatch` | `DispatchFunction` | The dispatch function (unused).    |
| `view`      | `PmEditorView`     | The editor view to zoom.           |

## Returns

`boolean`

`true` if the zoom was applied successfully.

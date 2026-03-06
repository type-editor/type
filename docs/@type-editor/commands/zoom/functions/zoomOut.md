[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [zoom](../README.md) / zoomOut

# Function: zoomOut()

```ts
function zoomOut(_state, _dispatch, view): boolean;
```

Defined in: [zoom.ts:23](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/commands/src/zoom.ts#L23)

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

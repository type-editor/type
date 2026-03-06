[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [plugin/handle-history-input-event](../README.md) / handleHistoryInputEvent

# Function: handleHistoryInputEvent()

```ts
function handleHistoryInputEvent(view, event): boolean;
```

Defined in: [plugin/handle-history-input-event.ts:15](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/plugin/handle-history-input-event.ts#L15)

Handles browser history input events (undo/redo).

## Parameters

| Parameter | Type           | Description                      |
| --------- | -------------- | -------------------------------- |
| `view`    | `PmEditorView` | The editor view                  |
| `event`   | `InputEvent`   | The input event from the browser |

## Returns

`boolean`

True if the event was handled, false otherwise

[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/input](../../../../../README.md) / [input-handler/keyboard/util/schedule-compose-end](../README.md) / scheduleComposeEnd

# Function: scheduleComposeEnd()

```ts
function scheduleComposeEnd(view, delay): void;
```

Defined in: [input-handler/keyboard/util/schedule-compose-end.ts:12](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/input-handler/keyboard/util/schedule-compose-end.ts#L12)

Schedules the end of composition handling after a delay. Clears any
previously scheduled timeout first.

## Parameters

| Parameter | Type           | Description                                                     |
| --------- | -------------- | --------------------------------------------------------------- |
| `view`    | `PmEditorView` | The editor view                                                 |
| `delay`   | `number`       | Delay in milliseconds before ending composition (-1 to disable) |

## Returns

`void`

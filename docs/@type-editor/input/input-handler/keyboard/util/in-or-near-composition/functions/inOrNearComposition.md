[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/input](../../../../../README.md) / [input-handler/keyboard/util/in-or-near-composition](../README.md) / inOrNearComposition

# Function: inOrNearComposition()

```ts
function inOrNearComposition(view, event): boolean;
```

Defined in: [input-handler/keyboard/util/in-or-near-composition.ts:15](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/input/src/input-handler/keyboard/util/in-or-near-composition.ts#L15)

Determines if the editor is currently in or near a composition event.
This is critical for handling IME (Input Method Editor) input correctly,
particularly on Safari with Japanese IMEs where Enter confirms composition.

## Parameters

| Parameter | Type           | Description       |
| --------- | -------------- | ----------------- |
| `view`    | `PmEditorView` | The editor view   |
| `event`   | `Event`        | The current event |

## Returns

`boolean`

True if composition is active or recently ended

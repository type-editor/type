[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/focus/blur-handler](../README.md) / blurHandler

# Function: blurHandler()

```ts
function blurHandler(view, event): boolean;
```

Defined in: [input-handler/focus/blur-handler.ts:7](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/input-handler/focus/blur-handler.ts#L7)

Handles blur events. Updates focus state, removes focused CSS class,
and clears selection tracking if focus moved to an element within the editor.

## Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |
| `event`   | `FocusEvent`   |

## Returns

`boolean`

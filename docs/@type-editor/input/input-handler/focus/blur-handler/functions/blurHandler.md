[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/focus/blur-handler](../README.md) / blurHandler

# Function: blurHandler()

```ts
function blurHandler(view, event): boolean;
```

Defined in: [input-handler/focus/blur-handler.ts:7](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/input/src/input-handler/focus/blur-handler.ts#L7)

Handles blur events. Updates focus state, removes focused CSS class,
and clears selection tracking if focus moved to an element within the editor.

## Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |
| `event`   | `FocusEvent`   |

## Returns

`boolean`

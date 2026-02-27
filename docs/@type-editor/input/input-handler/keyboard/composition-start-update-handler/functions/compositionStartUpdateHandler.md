[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/keyboard/composition-start-update-handler](../README.md) / compositionStartUpdateHandler

# Function: compositionStartUpdateHandler()

```ts
function compositionStartUpdateHandler(view): boolean;
```

Defined in: [input-handler/keyboard/composition-start-update-handler.ts:18](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/input/src/input-handler/keyboard/composition-start-update-handler.ts#L18)

Handles compositionstart and compositionupdate events from IME input.
Sets up the editor state for composition, handling mark wrapping for
non-inclusive marks and Firefox-specific cursor positioning issues.

## Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |

## Returns

`boolean`

[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/keyboard/composition-start-update-handler](../README.md) / compositionStartUpdateHandler

# Function: compositionStartUpdateHandler()

```ts
function compositionStartUpdateHandler(view): boolean;
```

Defined in: [input-handler/keyboard/composition-start-update-handler.ts:18](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/input/src/input-handler/keyboard/composition-start-update-handler.ts#L18)

Handles compositionstart and compositionupdate events from IME input.
Sets up the editor state for composition, handling mark wrapping for
non-inclusive marks and Firefox-specific cursor positioning issues.

## Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |

## Returns

`boolean`

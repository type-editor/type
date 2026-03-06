[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/keyboard/composition-start-update-handler](../README.md) / compositionStartUpdateHandler

# Function: compositionStartUpdateHandler()

```ts
function compositionStartUpdateHandler(view): boolean;
```

Defined in: [input-handler/keyboard/composition-start-update-handler.ts:18](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/input/src/input-handler/keyboard/composition-start-update-handler.ts#L18)

Handles compositionstart and compositionupdate events from IME input.
Sets up the editor state for composition, handling mark wrapping for
non-inclusive marks and Firefox-specific cursor positioning issues.

## Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |

## Returns

`boolean`

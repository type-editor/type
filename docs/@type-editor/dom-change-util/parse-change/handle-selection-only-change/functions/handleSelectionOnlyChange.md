[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [parse-change/handle-selection-only-change](../README.md) / handleSelectionOnlyChange

# Function: handleSelectionOnlyChange()

```ts
function handleSelectionOnlyChange(view, compositionID): void;
```

Defined in: [parse-change/handle-selection-only-change.ts:29](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/dom-change-util/src/dom-change/parse-change/handle-selection-only-change.ts#L29)

Handles selection-only changes (when no content has changed).

This function is called when a DOM change event indicates a selection change
but no content modification. It reads the current DOM selection, creates a
transaction to update the editor selection, and dispatches it.

The function also:

- Determines the selection origin (pointer, key, or null) based on timing
- Handles Android Chrome Enter key edge cases
- Adds appropriate metadata to the transaction (pointer, scrollIntoView, composition)

If the new selection is identical to the current selection, no action is taken.

## Parameters

| Parameter       | Type           | Description                                                                                                           |
| --------------- | -------------- | --------------------------------------------------------------------------------------------------------------------- |
| `view`          | `PmEditorView` | The editor view containing the DOM and current state                                                                  |
| `compositionID` | `number`       | The current composition ID if in composition mode (0 if not composing). This is used to track IME composition events. |

## Returns

`void`

## See

- selectionFromDOM for how selection is read from DOM
- [shouldHandleAndroidEnterKey](../../../browser-hacks/should-handle-android-enter-key/functions/shouldHandleAndroidEnterKey.md) for Android Enter key handling

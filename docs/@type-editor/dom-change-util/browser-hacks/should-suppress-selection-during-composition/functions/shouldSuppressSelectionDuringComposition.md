[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [browser-hacks/should-suppress-selection-during-composition](../README.md) / shouldSuppressSelectionDuringComposition

# Function: shouldSuppressSelectionDuringComposition()

```ts
function shouldSuppressSelectionDuringComposition(
  view,
  selection,
  change,
  chFrom,
  chTo,
  transaction,
): boolean;
```

Defined in: [browser-hacks/should-suppress-selection-during-composition.ts:40](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/dom-change-util/src/dom-change/browser-hacks/should-suppress-selection-during-composition.ts#L40)

Checks if selection should be suppressed due to Chrome composition issues.

During IME composition and in certain edge cases, Chrome and IE have quirks
where they report incorrect selection positions. This function detects those
cases so that the selection update can be skipped.

**Chrome composition issue:**
During composition, Chrome sometimes reports the selection in the wrong place.
The check detects this by looking for:

- Chrome browser during composition
- Empty (collapsed) selection
- Recent delete operation OR change is not zero-width
- Selection head is at the start of the change or at the mapped end

**IE edge case:**
IE doesn't move the cursor forward when starting to type in an empty block
or between BR nodes. Detected by:

- IE browser
- Empty selection at the start of the change

In both cases, the selection update is skipped to avoid placing the cursor
in the wrong position.

## Parameters

| Parameter     | Type                                                                                      | Description                                                  |
| ------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `view`        | `PmEditorView`                                                                            | The editor view containing composition state                 |
| `selection`   | `PmSelection`                                                                             | The selection to check (from parsed content)                 |
| `change`      | [`DocumentChange`](../../../types/dom-change/DocumentChange/interfaces/DocumentChange.md) | The detected document change                                 |
| `chFrom`      | `number`                                                                                  | Change start position in the current document                |
| `chTo`        | `number`                                                                                  | Change end position in the current document (before mapping) |
| `transaction` | `PmTransaction`                                                                           | The transaction being built, used to map positions           |

## Returns

`boolean`

True if selection should be suppressed (not applied to transaction),
false if selection should be set normally

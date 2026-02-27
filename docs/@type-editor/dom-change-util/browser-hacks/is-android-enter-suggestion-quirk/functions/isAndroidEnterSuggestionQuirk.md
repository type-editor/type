[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [browser-hacks/is-android-enter-suggestion-quirk](../README.md) / isAndroidEnterSuggestionQuirk

# Function: isAndroidEnterSuggestionQuirk()

```ts
function isAndroidEnterSuggestionQuirk(
  $from,
  $to,
  inlineChange,
  parse,
  change,
): boolean;
```

Defined in: [browser-hacks/is-android-enter-suggestion-quirk.ts:41](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/dom-change-util/src/dom-change/browser-hacks/is-android-enter-suggestion-quirk.ts#L41)

Checks if the Android virtual keyboard enter-and-pick-suggestion quirk is happening.

Android's virtual keyboard has a feature where after pressing Enter, it can suggest
words or corrections. During this process, Android sometimes:

1. Fires a DOM mutation that creates the new paragraph
2. THEN moves the selection to the new paragraph

However, ProseMirror cleans up the DOM selection during step 1, causing Android
to give up on step 2, leaving the cursor in the wrong place (issue #1059).

This function detects that specific sequence by checking:

- Running on Android
- Change is not inline (block-level change)
- Start and end are in different blocks ($from.start() !== $to.start())
- End position is at the very start of its parent ($to.parentOffset === 0)
- Both positions are at the same depth
- Selection exists and is collapsed (anchor === head)
- Selection is at the end of the change (head === change.endA)

When detected, the code drops the new paragraph from the change and dispatches
a simulated Enter key event instead.

## Parameters

| Parameter      | Type                                                                                                  | Description                                           |
| -------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `$from`        | `ResolvedPos`                                                                                         | Start position in parsed document (resolved position) |
| `$to`          | `ResolvedPos`                                                                                         | End position in parsed document (resolved position)   |
| `inlineChange` | `boolean`                                                                                             | Whether the change is within inline content           |
| `parse`        | [`ParseBetweenResult`](../../../types/dom-change/ParseBetweenResult/interfaces/ParseBetweenResult.md) | Parsed document information including selection state |
| `change`       | [`DocumentChange`](../../../types/dom-change/DocumentChange/interfaces/DocumentChange.md)             | The detected document change                          |

## Returns

`boolean`

True if this matches the Android enter-suggestion quirk pattern,
false otherwise

## See

https://github.com/ProseMirror/prosemirror/issues/1059

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [parse-change/needs-selection-overwrite-adjustment](../README.md) / needsSelectionOverwriteAdjustment

# Function: needsSelectionOverwriteAdjustment()

```ts
function needsSelectionOverwriteAdjustment(view, change): boolean;
```

Defined in: [parse-change/needs-selection-overwrite-adjustment.ts:29](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/dom-change-util/src/dom-change/parse-change/needs-selection-overwrite-adjustment.ts#L29)

Checks if the change needs adjustment to handle typing over selection edge cases.

When typing over a selection, there's an edge case: if the typed character
matches the character at the start or end of the selection, the diff algorithm
might detect a change that's smaller than the actual selection. This is because
the diff sees matching characters and doesn't include them in the change range.

For example, typing "t" over the selection "test" might be detected as just
replacing "est" because the first "t" matches.

This function detects when such adjustment is needed by checking:

- There's an active range selection (from \< to)
- The change is zero-width (start === endB), indicating a replacement
- The selection is a text selection

## Parameters

| Parameter | Type                                                                                      | Description                                                       |
| --------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `view`    | `PmEditorView`                                                                            | The editor view containing the current selection state            |
| `change`  | [`DocumentChange`](../../../types/dom-change/DocumentChange/interfaces/DocumentChange.md) | The detected document change with start, endA, and endB positions |

## Returns

`boolean`

True if the change needs adjustment to match the full selection range,
false if the change is correctly sized

## See

- shouldAdjustChangeStartToSelection for start adjustment logic
- shouldAdjustChangeEndToSelection for end adjustment logic

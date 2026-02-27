[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [parse-change/should-adjust-change-end-to-selection](../README.md) / shouldAdjustChangeEndToSelection

# Function: shouldAdjustChangeEndToSelection()

```ts
function shouldAdjustChangeEndToSelection(change, selection, parseTo): boolean;
```

Defined in: [parse-change/should-adjust-change-end-to-selection.ts:29](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/dom-change-util/src/dom-change/parse-change/should-adjust-change-end-to-selection.ts#L29)

Checks if change end should be adjusted to selection end.

Similar to start adjustment, when typing at the end of a selection, if the
typed character matches the character at the selection end, the diff algorithm
might place the change end before that matching character. This function
detects that case.

The adjustment is needed when:

- The detected change ends before the selection end
- But is very close (within 2 positions) to the selection end
- And the selection end is within the parsed range

When this condition is met, both endA and endB of the change are adjusted
to match the selection boundary.

## Parameters

| Parameter   | Type                                                                                      | Description                                                                                          |
| ----------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `change`    | [`DocumentChange`](../../../types/dom-change/DocumentChange/interfaces/DocumentChange.md) | The detected document change                                                                         |
| `selection` | `PmSelection`                                                                             | Current editor selection state                                                                       |
| `parseTo`   | `number`                                                                                  | End position of the parsed range in the document. Used to verify selection is within parsed content. |

## Returns

`boolean`

True if the change end should be adjusted to match selection.to,
false if no adjustment is needed

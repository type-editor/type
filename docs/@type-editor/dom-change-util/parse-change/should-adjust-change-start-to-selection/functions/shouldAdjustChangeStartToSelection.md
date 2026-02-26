[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [parse-change/should-adjust-change-start-to-selection](../README.md) / shouldAdjustChangeStartToSelection

# Function: shouldAdjustChangeStartToSelection()

```ts
function shouldAdjustChangeStartToSelection(
  change,
  selection,
  parseFrom,
): boolean;
```

Defined in: [parse-change/should-adjust-change-start-to-selection.ts:28](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/dom-change-util/src/dom-change/parse-change/should-adjust-change-start-to-selection.ts#L28)

Checks if change start should be adjusted to selection start.

When typing at the start of a selection, if the typed character matches the
character at the selection start, the diff algorithm might place the change
start after that matching character. This function detects that case.

The adjustment is needed when:

- The detected change starts after the selection start
- But is very close (within 2 positions) to the selection start
- And the selection start is within the parsed range

The threshold of 2 positions handles multi-byte characters and ensures
we don't over-adjust.

## Parameters

| Parameter   | Type                                                                                      | Description                                                                                            |
| ----------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `change`    | [`DocumentChange`](../../../types/dom-change/DocumentChange/interfaces/DocumentChange.md) | The detected document change                                                                           |
| `selection` | `PmSelection`                                                                             | Current editor selection state                                                                         |
| `parseFrom` | `number`                                                                                  | Start position of the parsed range in the document. Used to verify selection is within parsed content. |

## Returns

`boolean`

True if the change start should be adjusted to match selection.from,
false if no adjustment is needed

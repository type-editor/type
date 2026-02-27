[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [parse-change/should-create-type-over-change](../README.md) / shouldCreateTypeOverChange

# Function: shouldCreateTypeOverChange()

```ts
function shouldCreateTypeOverChange(typeOver, selection, view, parse): boolean;
```

Defined in: [parse-change/should-create-type-over-change.ts:29](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/dom-change-util/src/dom-change/parse-change/should-create-type-over-change.ts#L29)

Checks if a change should be created for typing over a selection.

When typing with a selection active, the editor should replace the selected
content. However, sometimes no DOM change is detected (perhaps because the
browser hasn't yet processed the change). This function detects if we're in
that situation and should create a synthetic change.

The conditions checked are:

- typeOver flag is set (indicates user is typing to replace selection)
- Selection is a text selection (not a node selection)
- Selection is not empty (something is selected)
- Selection is within a single parent node
- Editor is not in composition mode (not using IME)
- Parsed selection is collapsed or undefined (no range in parsed content)

## Parameters

| Parameter   | Type                                                                                                  | Description                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `typeOver`  | `boolean`                                                                                             | Whether typing over mode is active (user started typing with selection) |
| `selection` | `PmSelection`                                                                                         | Current editor selection state                                          |
| `view`      | `PmEditorView`                                                                                        | The editor view containing composition state                            |
| `parse`     | [`ParseBetweenResult`](../../../types/dom-change/ParseBetweenResult/interfaces/ParseBetweenResult.md) | Parsed document information from the DOM                                |

## Returns

`boolean`

True if a synthetic change should be created to replace the selection,
false if the change should be processed normally

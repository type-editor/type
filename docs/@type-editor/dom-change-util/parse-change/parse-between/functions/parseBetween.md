[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [parse-change/parse-between](../README.md) / parseBetween

# Function: parseBetween()

```ts
function parseBetween(view, from_, to_): ParseBetweenResult;
```

Defined in: [parse-change/parse-between.ts:35](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/dom-change-util/src/dom-change/parse-change/parse-between.ts#L35)

Parses a range of DOM content into a ProseMirror document fragment.

This function is the core of DOM change detection. It takes a range of positions
in the document, finds the corresponding DOM nodes, parses them into a ProseMirror
document, and attempts to reconstruct the selection state. It also applies various
browser-specific workarounds during the parsing process.

The parsing process:

1. Determines the DOM range to parse
2. Builds position tracking for selection reconstruction
3. Applies browser-specific adjustments (e.g., Chrome backspace bug)
4. Parses the DOM into a ProseMirror document
5. Reconstructs selection from tracked positions

## Parameters

| Parameter | Type           | Description                                                    |
| --------- | -------------- | -------------------------------------------------------------- |
| `view`    | `PmEditorView` | The editor view containing the document and DOM                |
| `from_`   | `number`       | Start position in the ProseMirror document (absolute position) |
| `to_`     | `number`       | End position in the ProseMirror document (absolute position)   |

## Returns

[`ParseBetweenResult`](../../../types/dom-change/ParseBetweenResult/interfaces/ParseBetweenResult.md)

Parsed document information including the parsed content, selection state,
and the actual from/to positions used (which may differ from input)

## See

[adjustForChromeBackspaceBug](../../../browser-hacks/adjust-for-chrome-backspace-bug/functions/adjustForChromeBackspaceBug.md) for browser-specific adjustments

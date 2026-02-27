[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [parse-change/resolve-selection](../README.md) / resolveSelection

# Function: resolveSelection()

```ts
function resolveSelection(view, doc, parsedSel): PmSelection;
```

Defined in: [parse-change/resolve-selection.ts:24](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/dom-change-util/src/dom-change/parse-change/resolve-selection.ts#L24)

Resolves a selection from parsed anchor/head positions.

This function converts numeric positions from the parsed document into a proper
ProseMirror Selection object. It performs validation and uses the selectionBetween
helper to create the appropriate selection type (TextSelection, NodeSelection, etc.).

The function returns null if the positions are invalid (outside document bounds).
This can happen if the selection was in a part of the document that wasn't parsed
or if parsing failed to find the positions.

## Parameters

| Parameter          | Type                                        | Description                                                                 |
| ------------------ | ------------------------------------------- | --------------------------------------------------------------------------- |
| `view`             | `PmEditorView`                              | The editor view, used for creating the selection via selectionBetween       |
| `doc`              | `Node_2`                                    | The document to resolve positions in (typically the transaction's document) |
| `parsedSel`        | \{ `anchor`: `number`; `head`: `number`; \} | Parsed selection with anchor and head positions (numeric offsets)           |
| `parsedSel.anchor` | `number`                                    | -                                                                           |
| `parsedSel.head`   | `number`                                    | -                                                                           |

## Returns

`PmSelection`

A resolved Selection object, or null if the positions are out of bounds

## See

selectionBetween for selection creation logic

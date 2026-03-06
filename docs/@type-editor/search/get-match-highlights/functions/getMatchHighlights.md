[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/search](../../README.md) / [get-match-highlights](../README.md) / getMatchHighlights

# Function: getMatchHighlights()

```ts
function getMatchHighlights(state): DecorationSet;
```

Defined in: [get-match-highlights.ts:15](https://github.com/type-editor/type/blob/70862bf5e8a5266dfb443941f265014c48842b41/packages/search/src/get-match-highlights.ts#L15)

Access the decoration set holding the currently highlighted search
matches in the document.

## Parameters

| Parameter | Type            | Description                                   |
| --------- | --------------- | --------------------------------------------- |
| `state`   | `PmEditorState` | The editor state to retrieve decorations from |

## Returns

`DecorationSet`

A decoration set containing all highlighted search matches

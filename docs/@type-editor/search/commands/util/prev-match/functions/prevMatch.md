[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/search](../../../../README.md) / [commands/util/prev-match](../README.md) / prevMatch

# Function: prevMatch()

```ts
function prevMatch(search, state, wrap, curFrom, curTo): SearchResult;
```

Defined in: [commands/util/prev-match.ts:19](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/search/src/commands/util/prev-match.ts#L19)

Finds the previous match before the current position, optionally wrapping around
to the end of the search range.

## Parameters

| Parameter | Type                                                            | Description                                            |
| --------- | --------------------------------------------------------------- | ------------------------------------------------------ |
| `search`  | [`SearchState`](../../../../SearchState/classes/SearchState.md) | The current search state                               |
| `state`   | `PmEditorState`                                                 | The editor state                                       |
| `wrap`    | `boolean`                                                       | Whether to wrap around to the end if no match is found |
| `curFrom` | `number`                                                        | The start position of the current selection            |
| `curTo`   | `number`                                                        | The end position of the current selection              |

## Returns

[`SearchResult`](../../../../types/SearchResult/interfaces/SearchResult.md)

The previous search result, or null if no match is found

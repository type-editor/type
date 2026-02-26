[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/search](../../../../README.md) / [commands/util/next-match](../README.md) / nextMatch

# Function: nextMatch()

```ts
function nextMatch(search, state, wrap, curFrom, curTo): SearchResult;
```

Defined in: [commands/util/next-match.ts:19](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/search/src/commands/util/next-match.ts#L19)

Finds the next match after the current position, optionally wrapping around
to the start of the search range.

## Parameters

| Parameter | Type                                                            | Description                                                  |
| --------- | --------------------------------------------------------------- | ------------------------------------------------------------ |
| `search`  | [`SearchState`](../../../../SearchState/classes/SearchState.md) | The current search state                                     |
| `state`   | `PmEditorState`                                                 | The editor state                                             |
| `wrap`    | `boolean`                                                       | Whether to wrap around to the beginning if no match is found |
| `curFrom` | `number`                                                        | The start position of the current selection                  |
| `curTo`   | `number`                                                        | The end position of the current selection                    |

## Returns

[`SearchResult`](../../../../types/SearchResult/interfaces/SearchResult.md)

The next search result, or null if no match is found

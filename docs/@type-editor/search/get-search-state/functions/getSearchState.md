[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/search](../../README.md) / [get-search-state](../README.md) / getSearchState

# Function: getSearchState()

```ts
function getSearchState(state): SearchState;
```

Defined in: [get-search-state.ts:12](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/search/src/get-search-state.ts#L12)

Get the current active search query and searched range.

## Parameters

| Parameter | Type            | Description                                    |
| --------- | --------------- | ---------------------------------------------- |
| `state`   | `PmEditorState` | The editor state to retrieve search state from |

## Returns

[`SearchState`](../../SearchState/classes/SearchState.md)

The current search state, or `undefined` if the search plugin isn't active

[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/search](../../README.md) / [set-search-state](../README.md) / setSearchState

# Function: setSearchState()

```ts
function setSearchState(transaction, query, range?): Transaction;
```

Defined in: [set-search-state.ts:17](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/search/src/set-search-state.ts#L17)

Add metadata to a transaction that updates the active search query
and searched range, when dispatched.

## Parameters

| Parameter     | Type                                                                     | Default value | Description                                                                 |
| ------------- | ------------------------------------------------------------------------ | ------------- | --------------------------------------------------------------------------- |
| `transaction` | `Transaction`                                                            | `undefined`   | The transaction to add metadata to                                          |
| `query`       | [`SearchQuery`](../../SearchQuery/classes/SearchQuery.md)                | `undefined`   | The new search query to set                                                 |
| `range`       | [`DocumentRange`](../../types/DocumentRange/interfaces/DocumentRange.md) | `null`        | Optional range to limit search scope, or null to search the entire document |

## Returns

`Transaction`

The transaction with the search metadata added

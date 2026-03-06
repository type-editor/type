[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/search](../../../README.md) / [types/QueryImpl](../README.md) / QueryImpl

# Interface: QueryImpl

Defined in: [types/QueryImpl.ts:9](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/search/src/types/QueryImpl.ts#L9)

Internal interface for query implementation strategies.
Different implementations handle string search vs. regex search.

## Methods

### findNext()

```ts
findNext(
   state,
   from,
   to): SearchResult;
```

Defined in: [types/QueryImpl.ts:18](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/search/src/types/QueryImpl.ts#L18)

Finds the next occurrence of the query in the document.

#### Parameters

| Parameter | Type            | Description                          |
| --------- | --------------- | ------------------------------------ |
| `state`   | `PmEditorState` | The editor state to search in        |
| `from`    | `number`        | The position to start searching from |
| `to`      | `number`        | The position to search up to         |

#### Returns

[`SearchResult`](../../SearchResult/interfaces/SearchResult.md)

The search result if found, or `null` if no match exists

---

### findPrev()

```ts
findPrev(
   state,
   from,
   to): SearchResult;
```

Defined in: [types/QueryImpl.ts:28](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/search/src/types/QueryImpl.ts#L28)

Finds the previous occurrence of the query in the document.

#### Parameters

| Parameter | Type            | Description                          |
| --------- | --------------- | ------------------------------------ |
| `state`   | `PmEditorState` | The editor state to search in        |
| `from`    | `number`        | The position to start searching from |
| `to`      | `number`        | The position to search back to       |

#### Returns

[`SearchResult`](../../SearchResult/interfaces/SearchResult.md)

The search result if found, or `null` if no match exists

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/search](../../../README.md) / [search-query/NullQuery](../README.md) / NullQuery

# Class: NullQuery

Defined in: [search-query/NullQuery.ts:4](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/search/src/search-query/NullQuery.ts#L4)

Internal interface for query implementation strategies.
Different implementations handle string search vs. regex search.

## Implements

- [`QueryImpl`](../../../types/QueryImpl/interfaces/QueryImpl.md)

## Constructors

### Constructor

```ts
new NullQuery(): NullQuery;
```

#### Returns

`NullQuery`

## Methods

### findNext()

```ts
findNext(): null;
```

Defined in: [search-query/NullQuery.ts:6](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/search/src/search-query/NullQuery.ts#L6)

Finds the next occurrence of the query in the document.

#### Returns

`null`

The search result if found, or `null` if no match exists

#### Implementation of

[`QueryImpl`](../../../types/QueryImpl/interfaces/QueryImpl.md).[`findNext`](../../../types/QueryImpl/interfaces/QueryImpl.md#findnext)

---

### findPrev()

```ts
findPrev(): null;
```

Defined in: [search-query/NullQuery.ts:10](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/search/src/search-query/NullQuery.ts#L10)

Finds the previous occurrence of the query in the document.

#### Returns

`null`

The search result if found, or `null` if no match exists

#### Implementation of

[`QueryImpl`](../../../types/QueryImpl/interfaces/QueryImpl.md).[`findPrev`](../../../types/QueryImpl/interfaces/QueryImpl.md#findprev)

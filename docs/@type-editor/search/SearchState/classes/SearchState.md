[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/search](../../README.md) / [SearchState](../README.md) / SearchState

# Class: SearchState

Defined in: [SearchState.ts:11](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/search/src/SearchState.ts#L11)

Internal state for the search plugin, maintaining the current search query,
optional search range, and decoration set for highlighting matches.

## Constructors

### Constructor

```ts
new SearchState(
   query,
   range,
   deco): SearchState;
```

Defined in: [SearchState.ts:23](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/search/src/SearchState.ts#L23)

Creates a new SearchState instance.

#### Parameters

| Parameter | Type                                                                     | Description                             |
| --------- | ------------------------------------------------------------------------ | --------------------------------------- |
| `query`   | [`SearchQuery`](../../SearchQuery/classes/SearchQuery.md)                | The search query to use                 |
| `range`   | [`DocumentRange`](../../types/DocumentRange/interfaces/DocumentRange.md) | Optional range to limit search scope    |
| `deco`    | `DecorationSet`                                                          | Decoration set for highlighting matches |

#### Returns

`SearchState`

## Accessors

### deco

#### Get Signature

```ts
get deco(): DecorationSet;
```

Defined in: [SearchState.ts:46](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/search/src/SearchState.ts#L46)

Gets the decoration set for highlighting matches.

##### Returns

`DecorationSet`

---

### query

#### Get Signature

```ts
get query(): SearchQuery;
```

Defined in: [SearchState.ts:32](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/search/src/SearchState.ts#L32)

Gets the current search query.

##### Returns

[`SearchQuery`](../../SearchQuery/classes/SearchQuery.md)

---

### range

#### Get Signature

```ts
get range(): DocumentRange;
```

Defined in: [SearchState.ts:39](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/search/src/SearchState.ts#L39)

Gets the current search range, if any.

##### Returns

[`DocumentRange`](../../types/DocumentRange/interfaces/DocumentRange.md)

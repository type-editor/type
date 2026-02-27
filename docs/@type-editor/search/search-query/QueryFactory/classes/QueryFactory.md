[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/search](../../../README.md) / [search-query/QueryFactory](../README.md) / QueryFactory

# Class: QueryFactory

Defined in: [search-query/QueryFactory.ts:7](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/search/src/search-query/QueryFactory.ts#L7)

## Constructors

### Constructor

```ts
new QueryFactory(): QueryFactory;
```

#### Returns

`QueryFactory`

## Methods

### createNullQuery()

```ts
static createNullQuery(): NullQuery;
```

Defined in: [search-query/QueryFactory.ts:25](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/search/src/search-query/QueryFactory.ts#L25)

#### Returns

[`NullQuery`](../../NullQuery/classes/NullQuery.md)

---

### createRegExpQuery()

```ts
static createRegExpQuery(query): RegExpQuery;
```

Defined in: [search-query/QueryFactory.ts:21](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/search/src/search-query/QueryFactory.ts#L21)

#### Parameters

| Parameter | Type                                                         |
| --------- | ------------------------------------------------------------ |
| `query`   | [`SearchQuery`](../../../SearchQuery/classes/SearchQuery.md) |

#### Returns

[`RegExpQuery`](../../RegExpQuery/classes/RegExpQuery.md)

---

### createStringQuery()

```ts
static createStringQuery(query): StringQuery;
```

Defined in: [search-query/QueryFactory.ts:17](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/search/src/search-query/QueryFactory.ts#L17)

#### Parameters

| Parameter | Type                                                         |
| --------- | ------------------------------------------------------------ |
| `query`   | [`SearchQuery`](../../../SearchQuery/classes/SearchQuery.md) |

#### Returns

[`StringQuery`](../../StringQuery/classes/StringQuery.md)

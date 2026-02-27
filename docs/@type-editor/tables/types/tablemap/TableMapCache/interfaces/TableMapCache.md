[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/tables](../../../../README.md) / [types/tablemap/TableMapCache](../README.md) / TableMapCache

# Interface: TableMapCache

Defined in: [tables/src/types/tablemap/TableMapCache.ts:9](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/types/tablemap/TableMapCache.ts#L9)

Cache interface for TableMap storage.
Provides read and write operations for caching computed table maps.

## Properties

| Property                        | Type                                                                                | Description                                          | Defined in                                                                                                                                                                                 |
| ------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="property-get"></a> `get` | (`key`) => [`TableMap`](../../../../tablemap/TableMap/classes/TableMap.md)          | Retrieves a cached TableMap for the given table node | [tables/src/types/tablemap/TableMapCache.ts:11](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/types/tablemap/TableMapCache.ts#L11) |
| <a id="property-set"></a> `set` | (`key`, `value`) => [`TableMap`](../../../../tablemap/TableMap/classes/TableMap.md) | Stores a TableMap in the cache and returns it        | [tables/src/types/tablemap/TableMapCache.ts:13](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/types/tablemap/TableMapCache.ts#L13) |

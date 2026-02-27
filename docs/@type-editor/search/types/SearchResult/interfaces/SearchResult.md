[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/search](../../../README.md) / [types/SearchResult](../README.md) / SearchResult

# Interface: SearchResult

Defined in: [types/SearchResult.ts:4](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/search/src/types/SearchResult.ts#L4)

Represents a matched instance of a search query.

## Properties

| Property                                      | Type               | Description                                                                                                                | Defined in                                                                                                                                                  |
| --------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-from"></a> `from`             | `number`           | The starting position of the match in the document.                                                                        | [types/SearchResult.ts:8](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/search/src/types/SearchResult.ts#L8)   |
| <a id="property-match"></a> `match`           | `RegExpMatchArray` | The regular expression match array. This will be non-null only for regular expression queries and contains capture groups. | [types/SearchResult.ts:19](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/search/src/types/SearchResult.ts#L19) |
| <a id="property-matchstart"></a> `matchStart` | `number`           | The starting position of the text block where the match was found.                                                         | [types/SearchResult.ts:24](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/search/src/types/SearchResult.ts#L24) |
| <a id="property-to"></a> `to`                 | `number`           | The ending position of the match in the document.                                                                          | [types/SearchResult.ts:13](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/search/src/types/SearchResult.ts#L13) |

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/search](../../../README.md) / [types/SearchQueryConfig](../README.md) / SearchQueryConfig

# Interface: SearchQueryConfig

Defined in: [types/SearchQueryConfig.ts:7](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/search/src/types/SearchQueryConfig.ts#L7)

Configuration options for creating a search query.

## Properties

| Property                                             | Type                             | Description                                                                                                                                                                                 | Defined in                                                                                                                                                            |
| ---------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-casesensitive"></a> `caseSensitive?` | `boolean`                        | Controls whether the search should be case-sensitive. **Default** `false`                                                                                                                   | [types/SearchQueryConfig.ts:17](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/search/src/types/SearchQueryConfig.ts#L17) |
| <a id="property-filter"></a> `filter?`               | (`state`, `result`) => `boolean` | Optional filter function that can exclude certain search results. Results for which this function returns false will be ignored.                                                            | [types/SearchQueryConfig.ts:55](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/search/src/types/SearchQueryConfig.ts#L55) |
| <a id="property-literal"></a> `literal?`             | `boolean`                        | By default, string search will replace `\n`, `\r`, and `\t` in the query with newline, return, and tab characters. When this is set to true, that behavior is disabled. **Default** `false` | [types/SearchQueryConfig.ts:25](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/search/src/types/SearchQueryConfig.ts#L25) |
| <a id="property-regexp"></a> `regexp?`               | `boolean`                        | When true, interpret the search string as a regular expression. **Default** `false`                                                                                                         | [types/SearchQueryConfig.ts:31](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/search/src/types/SearchQueryConfig.ts#L31) |
| <a id="property-replace"></a> `replace?`             | `string`                         | The replacement text to use when performing replacements. Supports capture group references like `$1`, `$2`, and `$&` for regex searches. **Default** `''`                                  | [types/SearchQueryConfig.ts:38](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/search/src/types/SearchQueryConfig.ts#L38) |
| <a id="property-search"></a> `search`                | `string`                         | The search string or regular expression pattern.                                                                                                                                            | [types/SearchQueryConfig.ts:11](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/search/src/types/SearchQueryConfig.ts#L11) |
| <a id="property-wholeword"></a> `wholeWord?`         | `boolean`                        | Enable whole-word matching. When enabled, matches that are surrounded by word characters will be ignored. **Default** `false`                                                               | [types/SearchQueryConfig.ts:45](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/search/src/types/SearchQueryConfig.ts#L45) |

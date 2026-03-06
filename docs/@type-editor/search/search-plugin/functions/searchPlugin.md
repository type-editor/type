[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/search](../../README.md) / [search-plugin](../README.md) / searchPlugin

# Function: searchPlugin()

```ts
function searchPlugin(options?): Plugin_2;
```

Defined in: [search-plugin.ts:34](https://github.com/type-editor/type/blob/70862bf5e8a5266dfb443941f265014c48842b41/packages/search/src/search-plugin.ts#L34)

Creates a search plugin that stores a current search query and searched range,
and highlights matches of the query.

## Parameters

| Parameter | Type                                                                                       | Description                                 |
| --------- | ------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `options` | [`SearchPluginOptions`](../../types/SearchPluginOptions/interfaces/SearchPluginOptions.md) | Configuration options for the search plugin |

## Returns

`Plugin_2`

A ProseMirror plugin that manages search state and match highlighting

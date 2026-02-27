[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/search](../../README.md) / [search-plugin](../README.md) / searchPlugin

# Function: searchPlugin()

```ts
function searchPlugin(options?): Plugin_2;
```

Defined in: [search-plugin.ts:34](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/search/src/search-plugin.ts#L34)

Creates a search plugin that stores a current search query and searched range,
and highlights matches of the query.

## Parameters

| Parameter | Type                                                                                       | Description                                 |
| --------- | ------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `options` | [`SearchPluginOptions`](../../types/SearchPluginOptions/interfaces/SearchPluginOptions.md) | Configuration options for the search plugin |

## Returns

`Plugin_2`

A ProseMirror plugin that manages search state and match highlighting

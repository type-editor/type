[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/search](../../README.md) / [search-plugin](../README.md) / searchPlugin

# Function: searchPlugin()

```ts
function searchPlugin(options?): Plugin_2;
```

Defined in: [search-plugin.ts:34](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/search/src/search-plugin.ts#L34)

Creates a search plugin that stores a current search query and searched range,
and highlights matches of the query.

## Parameters

| Parameter | Type                                                                                       | Description                                 |
| --------- | ------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `options` | [`SearchPluginOptions`](../../types/SearchPluginOptions/interfaces/SearchPluginOptions.md) | Configuration options for the search plugin |

## Returns

`Plugin_2`

A ProseMirror plugin that manages search state and match highlighting

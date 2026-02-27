[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/markdown](../../../README.md) / [types/TokenHandler](../README.md) / TokenHandler

# Type Alias: TokenHandler()

```ts
type TokenHandler = (state, token, tokens, i) => void;
```

Defined in: [types/TokenHandler.ts:14](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/markdown/src/types/TokenHandler.ts#L14)

Function type for handling a specific markdown-it token during parsing.

## Parameters

| Parameter | Type                                                                                            | Description                                         |
| --------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `state`   | [`MarkdownParseState`](../../../from-markdown/MarkdownParseState/classes/MarkdownParseState.md) | The current parse state.                            |
| `token`   | `Token`                                                                                         | The token being processed.                          |
| `tokens`  | `Token`[]                                                                                       | The complete array of tokens.                       |
| `i`       | `number`                                                                                        | The index of the current token in the tokens array. |

## Returns

`void`

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/markdown](../../../README.md) / [types/TokenHandler](../README.md) / TokenHandler

# Type Alias: TokenHandler()

```ts
type TokenHandler = (state, token, tokens, i) => void;
```

Defined in: [types/TokenHandler.ts:14](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/markdown/src/types/TokenHandler.ts#L14)

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

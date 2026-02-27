[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/changeset](../../../README.md) / [tokenizer/tokenize-fragment](../README.md) / tokenizeFragment

# Function: tokenizeFragment()

```ts
function tokenizeFragment<T>(fragment, encoder, start, end, target): T[];
```

Defined in: [tokenizer/tokenize-fragment.ts:19](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/changeset/src/tokenizer/tokenize-fragment.ts#L19)

Convert the given range of a fragment to tokens for diff comparison.
Recursively processes the fragment tree, encoding text characters and node boundaries.

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Parameters

| Parameter  | Type                                                                                | Description                                                       |
| ---------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `fragment` | `Fragment`                                                                          | The fragment to tokenize.                                         |
| `encoder`  | [`TokenEncoder`](../../../types/TokenEncoder/interfaces/TokenEncoder.md)&lt;`T`&gt; | The encoder to use for converting nodes and characters to tokens. |
| `start`    | `number`                                                                            | The start offset within the fragment.                             |
| `end`      | `number`                                                                            | The end offset within the fragment.                               |
| `target`   | `T`[]                                                                               | The array to append tokens to.                                    |

## Returns

`T`[]

The target array with all tokens appended.

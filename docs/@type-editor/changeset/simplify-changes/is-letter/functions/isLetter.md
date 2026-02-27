[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/changeset](../../../README.md) / [simplify-changes/is-letter](../README.md) / isLetter

# Function: isLetter()

```ts
function isLetter(code): boolean;
```

Defined in: [simplify-changes/is-letter.ts:45](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/simplify-changes/is-letter.ts#L45)

Determines whether a character code represents a letter or digit.

For ASCII characters, checks if the code is in the alphanumeric range.
For non-ASCII characters, uses Unicode properties if available, otherwise
checks for case changes or single-case script membership.

## Parameters

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `code`    | `number` | The character code to test. |

## Returns

`boolean`

True if the character is a letter or digit, false otherwise.

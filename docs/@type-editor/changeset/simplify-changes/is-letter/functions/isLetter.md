[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/changeset](../../../README.md) / [simplify-changes/is-letter](../README.md) / isLetter

# Function: isLetter()

```ts
function isLetter(code): boolean;
```

Defined in: [simplify-changes/is-letter.ts:45](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/changeset/src/simplify-changes/is-letter.ts#L45)

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

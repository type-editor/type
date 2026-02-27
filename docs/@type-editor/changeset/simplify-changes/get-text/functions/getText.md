[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/changeset](../../../README.md) / [simplify-changes/get-text](../README.md) / getText

# Function: getText()

```ts
function getText(fragment, start, end): string;
```

Defined in: [simplify-changes/get-text.ts:16](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/changeset/src/simplify-changes/get-text.ts#L16)

Extracts text content from a document fragment range.

Converts a range of document nodes into a string representation for
character-level analysis. Non-text elements (images, widgets, etc.) are
represented as spaces to prevent them from being considered part of words.

## Parameters

| Parameter  | Type       | Description                                  |
| ---------- | ---------- | -------------------------------------------- |
| `fragment` | `Fragment` | The document fragment to extract text from.  |
| `start`    | `number`   | The start position of the range (inclusive). |
| `end`      | `number`   | The end position of the range (exclusive).   |

## Returns

`string`

The text content with non-text nodes replaced by spaces.

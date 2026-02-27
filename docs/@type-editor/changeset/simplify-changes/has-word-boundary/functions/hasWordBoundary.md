[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/changeset](../../../README.md) / [simplify-changes/has-word-boundary](../README.md) / hasWordBoundary

# Function: hasWordBoundary()

```ts
function hasWordBoundary(text, textStart, fromPos, toPos, contextEnd): boolean;
```

Defined in: [simplify-changes/has-word-boundary.ts:17](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/changeset/src/simplify-changes/has-word-boundary.ts#L17)

Checks if there's a word boundary between two changes.

A word boundary is detected when there's a transition from non-letter to letter
or vice versa between the end of one change and the start of the next.

## Parameters

| Parameter    | Type     | Description                                                |
| ------------ | -------- | ---------------------------------------------------------- |
| `text`       | `string` | The text to analyze.                                       |
| `textStart`  | `number` | The offset where the analyzed text starts in the document. |
| `fromPos`    | `number` | The start position to check from.                          |
| `toPos`      | `number` | The end position to check to.                              |
| `contextEnd` | `number` | The end of the text context (to avoid out-of-bounds).      |

## Returns

`boolean`

True if a word boundary is found, false otherwise.

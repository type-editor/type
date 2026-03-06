[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/changeset](../../../README.md) / [simplify-changes/expand-to-word-boundaries](../README.md) / expandToWordBoundaries

# Function: expandToWordBoundaries()

```ts
function expandToWordBoundaries(
  text,
  textStart,
  textEnd,
  fromPos,
  toPos,
): [number, number];
```

Defined in: [simplify-changes/expand-to-word-boundaries.ts:17](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/changeset/src/simplify-changes/expand-to-word-boundaries.ts#L17)

Expands a position range to word boundaries.

If the range starts or ends within a word, expands it to include the entire word.
This ensures that changes don't split words in confusing ways.

## Parameters

| Parameter   | Type     | Description                                                |
| ----------- | -------- | ---------------------------------------------------------- |
| `text`      | `string` | The text to analyze.                                       |
| `textStart` | `number` | The offset where the analyzed text starts in the document. |
| `textEnd`   | `number` | The end of the text context.                               |
| `fromPos`   | `number` | The start position to expand.                              |
| `toPos`     | `number` | The end position to expand.                                |

## Returns

\[`number`, `number`\]

A tuple with the expanded [from, to] positions.

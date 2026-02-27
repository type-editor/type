[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/changeset](../../README.md) / [compute-diff](../README.md) / computeDiff

# Function: computeDiff()

```ts
function computeDiff<T>(fragA, fragB, range, encoder?): Change<any>[];
```

Defined in: [compute-diff.ts:24](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/changeset/src/compute-diff.ts#L24)

Compute the difference between two fragments using Myers' diff algorithm.

This implementation optimizes by first scanning from both ends to eliminate
unchanged content, then applies the Myers algorithm to the remaining content.
For performance reasons, the diff computation is limited by MAX_DIFF_SIZE.

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Parameters

| Parameter | Type                                                                             | Description                                                       |
| --------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `fragA`   | `Fragment`                                                                       | The first fragment to compare.                                    |
| `fragB`   | `Fragment`                                                                       | The second fragment to compare.                                   |
| `range`   | [`Change`](../../Change/classes/Change.md)                                       | The change range to analyze.                                      |
| `encoder` | [`TokenEncoder`](../../types/TokenEncoder/interfaces/TokenEncoder.md)&lt;`T`&gt; | The encoder to use for tokenization (defaults to DefaultEncoder). |

## Returns

[`Change`](../../Change/classes/Change.md)&lt;`any`&gt;[]

An array of Change objects representing the differences.

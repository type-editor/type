[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/changeset](../../../README.md) / [myers-diff/run-myers-diff](../README.md) / runMyersDiff

# Function: runMyersDiff()

```ts
function runMyersDiff<T>(
  tokensA,
  tokensB,
  range,
  compareTokens,
  changeRange,
): Change<any>[];
```

Defined in: [myers-diff/run-myers-diff.ts:40](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/changeset/src/myers-diff/run-myers-diff.ts#L40)

Run Myers' diff algorithm to find the optimal sequence of changes.

Myers' algorithm uses dynamic programming to find the shortest edit script
between two sequences. It explores diagonals in the edit graph, maintaining
a frontier of the furthest reaching paths.

See: https://neil.fraser.name/writing/diff/myers.pdf
See: https://blog.jcoglan.com/2017/02/12/the-myers-diff-algorithm-part-1/

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Parameters

| Parameter       | Type                                                                     | Description                                            |
| --------------- | ------------------------------------------------------------------------ | ------------------------------------------------------ |
| `tokensA`       | `T`[]                                                                    | The first token sequence.                              |
| `tokensB`       | `T`[]                                                                    | The second token sequence.                             |
| `range`         | [`TrimmedRange`](../../../types/TrimmedRange/interfaces/TrimmedRange.md) | The trimmed range to process.                          |
| `compareTokens` | (`a`, `b`) => `boolean`                                                  | The function to compare tokens for equality.           |
| `changeRange`   | [`Change`](../../../Change/classes/Change.md)                            | The original change range for creating result changes. |

## Returns

[`Change`](../../../Change/classes/Change.md)&lt;`any`&gt;[]

An array of changes, or null if the algorithm exceeded MAX_DIFF_SIZE.

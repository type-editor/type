[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [replace/replace-range](../README.md) / replaceRange

# Function: replaceRange()

```ts
function replaceRange(transform, from, to, slice): TransformDocument;
```

Defined in: [packages/transform/src/replace/replace-range.ts:24](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/replace/replace-range.ts#L24)

Replace a range in a transform with a slice, trying to find the best way to fit it.

## Parameters

| Parameter   | Type                | Description                               |
| ----------- | ------------------- | ----------------------------------------- |
| `transform` | `TransformDocument` | The transform to apply the replacement to |
| `from`      | `number`            | Start position                            |
| `to`        | `number`            | End position                              |
| `slice`     | `Slice`             | The slice to insert                       |

## Returns

`TransformDocument`

The modified transform

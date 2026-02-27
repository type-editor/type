[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [replace/delete-range](../README.md) / deleteRange

# Function: deleteRange()

```ts
function deleteRange(transform, from, to): TransformDocument;
```

Defined in: [packages/transform/src/replace/delete-range.ts:14](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/replace/delete-range.ts#L14)

Delete a range from the document, expanding to cover appropriate node boundaries.

## Parameters

| Parameter   | Type                | Description               |
| ----------- | ------------------- | ------------------------- |
| `transform` | `TransformDocument` | The transform to apply to |
| `from`      | `number`            | Start position            |
| `to`        | `number`            | End position              |

## Returns

`TransformDocument`

The modified transform

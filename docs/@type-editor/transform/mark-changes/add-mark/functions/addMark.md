[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [mark-changes/add-mark](../README.md) / addMark

# Function: addMark()

```ts
function addMark(transform, from, to, mark): void;
```

Defined in: [packages/transform/src/mark-changes/add-mark.ts:21](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/mark-changes/add-mark.ts#L21)

Add a mark to all inline content between two positions.

When a mark is added, any marks that are incompatible with the new mark
will be removed from the affected range. The function optimizes by merging
consecutive steps that operate on adjacent ranges.

## Parameters

| Parameter   | Type                | Description                        |
| ----------- | ------------------- | ---------------------------------- |
| `transform` | `TransformDocument` | The transform to add steps to.     |
| `from`      | `number`            | The start position of the range.   |
| `to`        | `number`            | The end position of the range.     |
| `mark`      | `Mark`              | The mark to add to inline content. |

## Returns

`void`

## Throws

When from is greater than to.

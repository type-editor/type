[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [mark-changes/remove-mark](../README.md) / removeMark

# Function: removeMark()

```ts
function removeMark(transform, from, to, mark?): void;
```

Defined in: [packages/transform/src/mark-changes/remove-mark.ts:41](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/transform/src/mark-changes/remove-mark.ts#L41)

Remove marks from inline nodes between two positions.

This function can remove specific marks, all marks of a certain type, or all marks
from the range. It optimizes by merging consecutive removal operations on adjacent nodes.

## Parameters

| Parameter   | Type                 | Description                                                                                                                                                   |
| ----------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transform` | `TransformDocument`  | The transform to add steps to.                                                                                                                                |
| `from`      | `number`             | The start position of the range.                                                                                                                              |
| `to`        | `number`             | The end position of the range.                                                                                                                                |
| `mark?`     | `Mark` \| `MarkType` | The mark to remove. Can be: - A Mark instance to remove that specific mark - A MarkType to remove all marks of that type - null/undefined to remove all marks |

## Returns

`void`

## Throws

When from is greater than to.

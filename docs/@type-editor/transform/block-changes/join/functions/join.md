[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [block-changes/join](../README.md) / join

# Function: join()

```ts
function join(transform, pos, depth): TransformDocument;
```

Defined in: [packages/transform/src/block-changes/join.ts:17](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/block-changes/join.ts#L17)

Join two blocks at the given position and depth.

## Parameters

| Parameter   | Type                | Description                         |
| ----------- | ------------------- | ----------------------------------- |
| `transform` | `TransformDocument` | The transform to apply the join to. |
| `pos`       | `number`            | The position where the join occurs. |
| `depth`     | `number`            | The depth of the join.              |

## Returns

`TransformDocument`

The transform with the join applied.

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [block-changes/lift](../README.md) / lift

# Function: lift()

```ts
function lift(transform, range, target): void;
```

Defined in: [packages/transform/src/block-changes/lift.ts:14](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/block-changes/lift.ts#L14)

Lift the content in the given range out of its parent nodes.
Attempts to move the content to a shallower depth level.

## Parameters

| Parameter   | Type                | Description                                   |
| ----------- | ------------------- | --------------------------------------------- |
| `transform` | `TransformDocument` | The transform to apply the lift operation to. |
| `range`     | `NodeRange`         | The range of content to lift.                 |
| `target`    | `number`            | The target depth to lift the content to.      |

## Returns

`void`

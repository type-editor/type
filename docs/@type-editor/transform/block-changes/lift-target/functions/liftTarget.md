[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [block-changes/lift-target](../README.md) / liftTarget

# Function: liftTarget()

```ts
function liftTarget(range): number;
```

Defined in: [packages/transform/src/block-changes/lift-target.ts:10](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/transform/src/block-changes/lift-target.ts#L10)

Try to find a target depth to which the content in the given range
can be lifted. Will not go across isolating parent nodes.

## Parameters

| Parameter | Type        | Description                               |
| --------- | ----------- | ----------------------------------------- |
| `range`   | `NodeRange` | The range of content to potentially lift. |

## Returns

`number`

The target depth, or null if lifting is not possible.

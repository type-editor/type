[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [block-changes/lift-target](../README.md) / liftTarget

# Function: liftTarget()

```ts
function liftTarget(range): number;
```

Defined in: [packages/transform/src/block-changes/lift-target.ts:10](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/transform/src/block-changes/lift-target.ts#L10)

Try to find a target depth to which the content in the given range
can be lifted. Will not go across isolating parent nodes.

## Parameters

| Parameter | Type        | Description                               |
| --------- | ----------- | ----------------------------------------- |
| `range`   | `NodeRange` | The range of content to potentially lift. |

## Returns

`number`

The target depth, or null if lifting is not possible.

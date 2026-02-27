[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [replace/util](../README.md) / coveredDepths

# Function: coveredDepths()

```ts
function coveredDepths($from, $to): number[];
```

Defined in: [packages/transform/src/replace/util.ts:11](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/replace/util.ts#L11)

Returns an array of all depths for which $from - $to spans the
whole content of the nodes at that depth.

## Parameters

| Parameter | Type          | Description             |
| --------- | ------------- | ----------------------- |
| `$from`   | `ResolvedPos` | Resolved start position |
| `$to`     | `ResolvedPos` | Resolved end position   |

## Returns

`number`[]

Array of depths that are fully covered

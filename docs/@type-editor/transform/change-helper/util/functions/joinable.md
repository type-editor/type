[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-helper/util](../README.md) / joinable

# Function: joinable()

```ts
function joinable(beforeNode, afterNode): boolean;
```

Defined in: [packages/transform/src/change-helper/util.ts:12](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-helper/util.ts#L12)

Check if two nodes can be joined together.
Nodes are joinable if both exist, the first is not a leaf,
and the second's content can be appended to the first.

## Parameters

| Parameter    | Type     | Description                     |
| ------------ | -------- | ------------------------------- |
| `beforeNode` | `Node_2` | The node before the join point. |
| `afterNode`  | `Node_2` | The node after the join point.  |

## Returns

`boolean`

True if the nodes can be joined.

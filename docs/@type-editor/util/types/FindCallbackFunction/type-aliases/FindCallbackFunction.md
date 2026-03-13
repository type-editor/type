[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/util](../../../README.md) / [types/FindCallbackFunction](../README.md) / FindCallbackFunction

# Type Alias: FindCallbackFunction()

```ts
type FindCallbackFunction = (node) => boolean;
```

Defined in: [types/FindCallbackFunction.ts:9](https://github.com/type-editor/type/blob/4813813a587dda7eec62dd72332119887ded8d65/packages/util/src/types/FindCallbackFunction.ts#L9)

A callback function used to find nodes in the document tree.

## Parameters

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `node`    | `PmNode` | The node to evaluate. |

## Returns

`boolean`

`true` if the node matches the search criteria, `false` otherwise.

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-helper/can-join](../README.md) / canJoin

# Function: canJoin()

```ts
function canJoin(doc, pos): boolean;
```

Defined in: [packages/transform/src/change-helper/can-join.ts:12](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/transform/src/change-helper/can-join.ts#L12)

Test whether the blocks before and after a given position can be joined.

## Parameters

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `doc`     | `Node_2` | The document to check.             |
| `pos`     | `number` | The position to check for joining. |

## Returns

`boolean`

True if the blocks can be joined, false otherwise.

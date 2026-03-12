[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [clipboard/parse/normalize-siblings](../README.md) / closeRight

# Function: closeRight()

```ts
function closeRight(node, depth): Node_2;
```

Defined in: [clipboard/parse/normalize-siblings.ts:132](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/input/src/clipboard/parse/normalize-siblings.ts#L132)

Close off the rightmost open positions in a node down to `depth` levels.

## Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `node`    | `Node_2` | Node to close                         |
| `depth`   | `number` | The number of wrapper levels to close |

## Returns

`Node_2`

A new node with the specified number of rightmost levels closed

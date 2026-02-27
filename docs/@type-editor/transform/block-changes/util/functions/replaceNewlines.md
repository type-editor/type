[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [block-changes/util](../README.md) / replaceNewlines

# Function: replaceNewlines()

```ts
function replaceNewlines(transform, node, pos, mapFrom): void;
```

Defined in: [packages/transform/src/block-changes/util.ts:17](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/block-changes/util.ts#L17)

Replace all newline characters in text nodes with linebreak replacement nodes.
This is used when joining blocks that should preserve line breaks as nodes.

## Parameters

| Parameter   | Type                | Description                               |
| ----------- | ------------------- | ----------------------------------------- |
| `transform` | `TransformDocument` | The transform to apply replacements to.   |
| `node`      | `Node_2`            | The node to process.                      |
| `pos`       | `number`            | The position of the node.                 |
| `mapFrom`   | `number`            | The starting point for mapping positions. |

## Returns

`void`

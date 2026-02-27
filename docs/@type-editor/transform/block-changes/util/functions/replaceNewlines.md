[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [block-changes/util](../README.md) / replaceNewlines

# Function: replaceNewlines()

```ts
function replaceNewlines(transform, node, pos, mapFrom): void;
```

Defined in: [packages/transform/src/block-changes/util.ts:17](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/block-changes/util.ts#L17)

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

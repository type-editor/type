[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [block-changes/util](../README.md) / replaceLinebreaks

# Function: replaceLinebreaks()

```ts
function replaceLinebreaks(transform, node, pos, mapFrom): void;
```

Defined in: [packages/transform/src/block-changes/util.ts:51](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/block-changes/util.ts#L51)

Replace all linebreak replacement nodes with newline characters.
This is used when joining blocks that should collapse line breaks to text.

## Parameters

| Parameter   | Type                | Description                               |
| ----------- | ------------------- | ----------------------------------------- |
| `transform` | `TransformDocument` | The transform to apply replacements to.   |
| `node`      | `Node_2`            | The node to process.                      |
| `pos`       | `number`            | The position of the node.                 |
| `mapFrom`   | `number`            | The starting point for mapping positions. |

## Returns

`void`

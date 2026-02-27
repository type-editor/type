[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [replace/replace-range-with](../README.md) / replaceRangeWith

# Function: replaceRangeWith()

```ts
function replaceRangeWith(transform, from, to, node): void;
```

Defined in: [packages/transform/src/replace/replace-range-with.ts:14](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/replace/replace-range-with.ts#L14)

Replace a range with a single node.

## Parameters

| Parameter   | Type                | Description               |
| ----------- | ------------------- | ------------------------- |
| `transform` | `TransformDocument` | The transform to apply to |
| `from`      | `number`            | Start position            |
| `to`        | `number`            | End position              |
| `node`      | `Node_2`            | The node to insert        |

## Returns

`void`

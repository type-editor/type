[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [replace/replace-range-with](../README.md) / replaceRangeWith

# Function: replaceRangeWith()

```ts
function replaceRangeWith(transform, from, to, node): void;
```

Defined in: [packages/transform/src/replace/replace-range-with.ts:14](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/transform/src/replace/replace-range-with.ts#L14)

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

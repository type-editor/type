[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [block-changes/set-node-markup](../README.md) / setNodeMarkup

# Function: setNodeMarkup()

```ts
function setNodeMarkup(transform, pos, type, attrs, marks): void;
```

Defined in: [packages/transform/src/block-changes/set-node-markup.ts:16](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/block-changes/set-node-markup.ts#L16)

Change the type, attributes, and/or marks of the node at a given position.
When `type` isn't given, the existing node type is preserved.

## Parameters

| Parameter   | Type                                              | Description                                                  |
| ----------- | ------------------------------------------------- | ------------------------------------------------------------ |
| `transform` | `TransformDocument`                               | The transform to apply the change to.                        |
| `pos`       | `number`                                          | The position of the node to change.                          |
| `type`      | `NodeType`                                        | The new node type (or null/undefined to keep existing type). |
| `attrs`     | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; | The new attributes.                                          |
| `marks`     | readonly `Mark`[]                                 | The new marks (or undefined to keep existing marks).         |

## Returns

`void`

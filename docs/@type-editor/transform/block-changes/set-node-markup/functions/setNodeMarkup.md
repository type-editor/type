[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [block-changes/set-node-markup](../README.md) / setNodeMarkup

# Function: setNodeMarkup()

```ts
function setNodeMarkup(transform, pos, type, attrs, marks): void;
```

Defined in: [packages/transform/src/block-changes/set-node-markup.ts:16](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/block-changes/set-node-markup.ts#L16)

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

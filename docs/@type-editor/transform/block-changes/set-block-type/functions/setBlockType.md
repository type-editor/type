[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [block-changes/set-block-type](../README.md) / setBlockType

# Function: setBlockType()

```ts
function setBlockType(transform, from, to, type, attrs): void;
```

Defined in: [packages/transform/src/block-changes/set-block-type.ts:28](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/transform/src/block-changes/set-block-type.ts#L28)

Change the type of all textblocks in a range to a different type.

## Parameters

| Parameter   | Type                                                                           | Description                                                                        |
| ----------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `transform` | `TransformDocument`                                                            | The transform to apply the changes to.                                             |
| `from`      | `number`                                                                       | Start of the range.                                                                |
| `to`        | `number`                                                                       | End of the range.                                                                  |
| `type`      | `NodeType`                                                                     | The new node type.                                                                 |
| `attrs`     | \| `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; \| (`oldNode`) => `Attrs` | Attributes for the new type (can be a function that computes attrs from old node). |

## Returns

`void`

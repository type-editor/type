[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [block-changes/split](../README.md) / split

# Function: split()

```ts
function split(transform, pos, depth?, typesAfter?): void;
```

Defined in: [packages/transform/src/block-changes/split.ts:15](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/block-changes/split.ts#L15)

Split the node at the given position at the specified depth.
Creates a gap in the document by duplicating ancestor nodes.

## Parameters

| Parameter     | Type                                                                                     | Default value | Description                                                    |
| ------------- | ---------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------- |
| `transform`   | `TransformDocument`                                                                      | `undefined`   | The transform to apply the split to.                           |
| `pos`         | `number`                                                                                 | `undefined`   | The position to split at.                                      |
| `depth`       | `number`                                                                                 | `1`           | How many levels deep to split (default: 1).                    |
| `typesAfter?` | \{ `attrs?`: `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;; `type`: `NodeType`; \}[] | `undefined`   | Optional array of node types to use for nodes after the split. |

## Returns

`void`

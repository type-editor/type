[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [toggle-block-type](../README.md) / toggleBlockType

# Function: toggleBlockType()

```ts
function toggleBlockType(
  nodeType,
  unwrapNodeType,
  attrs?,
  allowUnwrap?,
): Command;
```

Defined in: [toggle-block-type.ts:23](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/commands/src/toggle-block-type.ts#L23)

Creates a command that toggles between two block types.

If the selection is currently inside a node of the specified `nodeType` and unwrapping
is allowed, it will convert the block to `unwrapNodeType`. Otherwise, it will convert
the block to `nodeType`.

This is useful for implementing toggle buttons (e.g., toggling between a heading and
a paragraph).

## Parameters

| Parameter        | Type                                              | Default value | Description                                                             |
| ---------------- | ------------------------------------------------- | ------------- | ----------------------------------------------------------------------- |
| `nodeType`       | `NodeType`                                        | `undefined`   | The node type to toggle to when not already in this type.               |
| `unwrapNodeType` | `NodeType`                                        | `undefined`   | The node type to revert to when already inside `nodeType`.              |
| `attrs`          | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; | `null`        | Optional attributes to apply to the new block node.                     |
| `allowUnwrap`    | `boolean`                                         | `true`        | Whether to allow toggling back to `unwrapNodeType`. Defaults to `true`. |

## Returns

`Command`

A command function that toggles the block type when executed.

[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/util/is-node-active](../README.md) / isNodeActive

# Function: isNodeActive()

```ts
function isNodeActive(
  state,
  nodeType?,
  attrs?,
  defaultTrueIfAttributeNotSet?,
  ...checkParents
): boolean;
```

Defined in: [packages/menu/src/menu-items/util/is-node-active.ts:18](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menu-items/util/is-node-active.ts#L18)

Checks if a node of a specific type is active at the current selection.

For node selections, checks if the selected node matches the type and attributes.
For text selections, checks if the parent node of the cursor position matches
the type and attributes (only when the selection end is within the parent).

## Parameters

| Parameter                       | Type            | Default value | Description                                             |
| ------------------------------- | --------------- | ------------- | ------------------------------------------------------- |
| `state`                         | `PmEditorState` | `undefined`   | The current editor state                                |
| `nodeType?`                     | `NodeType`      | `undefined`   | The node type to check for                              |
| `attrs?`                        | `Attrs`         | `undefined`   | Optional attributes that the node must match            |
| `defaultTrueIfAttributeNotSet?` | `boolean`       | `false`       | If true, returns true when attribute on node is not set |
| ...`checkParents?`              | `NodeType`[]    | `undefined`   | Check given parent node types instead                   |

## Returns

`boolean`

True if a matching node is active, false otherwise

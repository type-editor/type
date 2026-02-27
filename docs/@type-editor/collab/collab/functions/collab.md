[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/collab](../../README.md) / [collab](../README.md) / collab

# Function: collab()

```ts
function collab(config?): Plugin_2;
```

Defined in: [collab.ts:21](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/collab/src/collab.ts#L21)

Creates a plugin that enables the collaborative editing framework for the editor.

This plugin tracks document versions and unconfirmed local changes,
enabling synchronization with a central authority for collaborative editing.

## Parameters

| Parameter | Type                                                                  | Description                           |
| --------- | --------------------------------------------------------------------- | ------------------------------------- |
| `config`  | [`CollabConfig`](../../types/CollabConfig/interfaces/CollabConfig.md) | Configuration options for the plugin. |

## Returns

`Plugin_2`

A ProseMirror plugin that enables collaborative editing.

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/viewdesc](../../../README.md) / [util/replace-nodes](../README.md) / replaceNodes

# Function: replaceNodes()

```ts
function replaceNodes(nodes, from, to, view, replacement?): ViewDesc[];
```

Defined in: [util/replace-nodes.ts:22](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/util/replace-nodes.ts#L22)

Replace range from-to in an array of view descs with replacement
(may be undefined to just delete). This goes very much against the grain
of the rest of this code, which tends to create nodes with the
right shape in one go, rather than messing with them after
creation, but is necessary in the composition hack.

## Parameters

| Parameter      | Type                                                           | Description                            |
| -------------- | -------------------------------------------------------------- | -------------------------------------- |
| `nodes`        | readonly [`ViewDesc`](../../../ViewDesc/classes/ViewDesc.md)[] | The array of view descriptions         |
| `from`         | `number`                                                       | Start position of the range to replace |
| `to`           | `number`                                                       | End position of the range to replace   |
| `view`         | `PmEditorView`                                                 | The editor view                        |
| `replacement?` | [`ViewDesc`](../../../ViewDesc/classes/ViewDesc.md)            | Optional replacement view description  |

## Returns

[`ViewDesc`](../../../ViewDesc/classes/ViewDesc.md)[]

A new array with the replacement applied

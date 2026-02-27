[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/util/is-mark-active](../README.md) / isMarkActive

# Function: isMarkActive()

```ts
function isMarkActive(state, type): boolean;
```

Defined in: [packages/menu/src/menu-items/util/is-mark-active.ts:15](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menu-items/util/is-mark-active.ts#L15)

Checks if a specific mark type is active in the current editor selection.

For empty selections (cursor position), checks if the mark is present in the stored marks
or in the marks at the cursor position. For range selections, checks if the mark
is present anywhere within the selected range.

## Parameters

| Parameter | Type            | Description                |
| --------- | --------------- | -------------------------- |
| `state`   | `PmEditorState` | The current editor state   |
| `type`    | `MarkType`      | The mark type to check for |

## Returns

`boolean`

`true` if the mark is active in the selection, `false` otherwise

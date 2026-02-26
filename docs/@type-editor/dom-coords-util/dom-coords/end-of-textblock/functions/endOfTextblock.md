[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-coords-util](../../../README.md) / [dom-coords/end-of-textblock](../README.md) / endOfTextblock

# Function: endOfTextblock()

```ts
function endOfTextblock(view, state, dir): boolean;
```

Defined in: [dom-coords/end-of-textblock.ts:27](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/dom-coords-util/src/dom-coords/end-of-textblock.ts#L27)

Determine whether the cursor is at the edge of a text block in the given direction.
This function is cached for performance - repeated calls with the same state and
direction will return the cached result.

## Parameters

| Parameter | Type                                                                                  | Description                                                                      |
| --------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `view`    | `PmEditorView`                                                                        | The editor view                                                                  |
| `state`   | `PmEditorState`                                                                       | The editor state containing the current selection                                |
| `dir`     | [`TextblockDir`](../../../types/dom-coords/TextblockDir/type-aliases/TextblockDir.md) | The direction to check ('up', 'down', 'left', 'right', 'forward', or 'backward') |

## Returns

`boolean`

True if the cursor is at the edge of a text block in the given direction

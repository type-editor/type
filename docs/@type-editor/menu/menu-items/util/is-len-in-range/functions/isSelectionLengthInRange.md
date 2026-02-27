[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/util/is-len-in-range](../README.md) / isSelectionLengthInRange

# Function: isSelectionLengthInRange()

```ts
function isSelectionLengthInRange(state, max?, min?): boolean;
```

Defined in: [packages/menu/src/menu-items/util/is-len-in-range.ts:11](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menu-items/util/is-len-in-range.ts#L11)

Checks if the current selection length is within a specified range.

## Parameters

| Parameter | Type            | Default value | Description                                          |
| --------- | --------------- | ------------- | ---------------------------------------------------- |
| `state`   | `PmEditorState` | `undefined`   | The current editor state                             |
| `max`     | `number`        | `1000`        | The maximum allowed selection length (default: 1000) |
| `min`     | `number`        | `0`           | The minimum required selection length (default: 0)   |

## Returns

`boolean`

`true` if the selection length is within the range [min, max], `false` otherwise

[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [clipboard/parse/close-slice](../README.md) / closeSlice

# Function: closeSlice()

```ts
function closeSlice(slice, openStart, openEnd): Slice;
```

Defined in: [clipboard/parse/close-slice.ts:12](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/clipboard/parse/close-slice.ts#L12)

Close a slice's openStart/openEnd to a target start/end.

## Parameters

| Parameter   | Type     | Description            |
| ----------- | -------- | ---------------------- |
| `slice`     | `Slice`  | The slice to close     |
| `openStart` | `number` | Target openStart value |
| `openEnd`   | `number` | Target openEnd value   |

## Returns

`Slice`

A new slice with the specified open values

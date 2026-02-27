[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/input](../../../../../README.md) / [input-handler/keyboard/util/find-direction](../README.md) / findDirection

# Function: findDirection()

```ts
function findDirection(view, pos): "rtl" | "ltr";
```

Defined in: [input-handler/keyboard/util/find-direction.ts:16](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/input/src/input-handler/keyboard/util/find-direction.ts#L16)

Determines the text direction (LTR or RTL) at a specific position in the document.

Uses coordinate-based detection on browsers other than Chrome/Windows to handle
bidirectional text correctly. Falls back to CSS direction property.

## Parameters

| Parameter | Type           | Description                    |
| --------- | -------------- | ------------------------------ |
| `view`    | `PmEditorView` | The EditorView instance        |
| `pos`     | `number`       | The document position to check |

## Returns

`"rtl"` \| `"ltr"`

'ltr' for left-to-right, 'rtl' for right-to-left

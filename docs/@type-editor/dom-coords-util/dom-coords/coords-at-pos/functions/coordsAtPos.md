[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-coords-util](../../../README.md) / [dom-coords/coords-at-pos](../README.md) / coordsAtPos

# Function: coordsAtPos()

```ts
function coordsAtPos(view, pos, side): Rect;
```

Defined in: [dom-coords/coords-at-pos.ts:21](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/dom-coords-util/src/dom-coords/coords-at-pos.ts#L21)

Given a position in the document model, get a bounding box of the
character at that position, relative to the window.

## Parameters

| Parameter | Type           | Description                                             |
| --------- | -------------- | ------------------------------------------------------- |
| `view`    | `PmEditorView` | The editor view                                         |
| `pos`     | `number`       | The document position to get coordinates for            |
| `side`    | `number`       | Direction bias: negative for before, positive for after |

## Returns

[`Rect`](../../../types/dom-coords/Rect/interfaces/Rect.md)

A rectangle representing the character's bounding box

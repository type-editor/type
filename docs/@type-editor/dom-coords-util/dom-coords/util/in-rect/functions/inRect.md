[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/dom-coords-util](../../../../README.md) / [dom-coords/util/in-rect](../README.md) / inRect

# Function: inRect()

```ts
function inRect(coords, rect): boolean;
```

Defined in: [dom-coords/util/in-rect.ts:14](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/dom-coords-util/src/dom-coords/util/in-rect.ts#L14)

Check if coordinates are within a rectangle, with tolerance.

## Parameters

| Parameter | Type                                                                 | Description                    |
| --------- | -------------------------------------------------------------------- | ------------------------------ |
| `coords`  | [`Coords`](../../../../types/dom-coords/Coords/interfaces/Coords.md) | The coordinates to check       |
| `rect`    | [`Rect`](../../../../types/dom-coords/Rect/interfaces/Rect.md)       | The rectangle to check against |

## Returns

`boolean`

True if coordinates are within or near the rectangle

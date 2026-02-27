[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/dom-coords-util](../../../../README.md) / [dom-coords/util/in-rect](../README.md) / inRect

# Function: inRect()

```ts
function inRect(coords, rect): boolean;
```

Defined in: [dom-coords/util/in-rect.ts:14](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/dom-coords-util/src/dom-coords/util/in-rect.ts#L14)

Check if coordinates are within a rectangle, with tolerance.

## Parameters

| Parameter | Type                                                                 | Description                    |
| --------- | -------------------------------------------------------------------- | ------------------------------ |
| `coords`  | [`Coords`](../../../../types/dom-coords/Coords/interfaces/Coords.md) | The coordinates to check       |
| `rect`    | [`Rect`](../../../../types/dom-coords/Rect/interfaces/Rect.md)       | The rectangle to check against |

## Returns

`boolean`

True if coordinates are within or near the rectangle

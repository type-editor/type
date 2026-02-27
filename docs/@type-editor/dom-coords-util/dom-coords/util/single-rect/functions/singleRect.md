[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/dom-coords-util](../../../../README.md) / [dom-coords/util/single-rect](../README.md) / singleRect

# Function: singleRect()

```ts
function singleRect(target, bias): DOMRect;
```

Defined in: [dom-coords/util/single-rect.ts:10](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/dom-coords-util/src/dom-coords/util/single-rect.ts#L10)

Get a single non-zero rectangle from an element or range.
Prefers the first or last rectangle based on bias, falling back to
any non-zero rectangle, or the bounding rect if all are zero-sized.

## Parameters

| Parameter | Type                     | Description                                                |
| --------- | ------------------------ | ---------------------------------------------------------- |
| `target`  | `HTMLElement` \| `Range` | The HTML element or range to get a rectangle from          |
| `bias`    | `number`                 | Direction bias: negative for first rect, positive for last |

## Returns

`DOMRect`

A single DOMRect representing the target's position

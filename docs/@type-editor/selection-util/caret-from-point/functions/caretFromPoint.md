[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/selection-util](../../README.md) / [caret-from-point](../README.md) / caretFromPoint

# Function: caretFromPoint()

```ts
function caretFromPoint(
  doc,
  x,
  y,
): {
  node: Node;
  offset: number;
};
```

Defined in: [caret-from-point.ts:31](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/selection-util/src/selection/caret-from-point.ts#L31)

Gets the caret position from a point in the document.

This function tries browser-specific methods to determine the DOM position
(node and offset) at the given screen coordinates. It handles both Firefox's
`caretPositionFromPoint` and Chrome/Safari's `caretRangeFromPoint`.

The offset is clipped to the node size to handle edge cases where browsers
might return invalid offsets (e.g., text offsets into \<input\> nodes).

## Parameters

| Parameter | Type       | Description                        |
| --------- | ---------- | ---------------------------------- |
| `doc`     | `Document` | The document to query              |
| `x`       | `number`   | The X coordinate in viewport space |
| `y`       | `number`   | The Y coordinate in viewport space |

## Returns

```ts
{
  node: Node;
  offset: number;
}
```

An object containing the node and offset at the point, or undefined if not found

| Name     | Type     | Defined in                                                                                                                                                                |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node`   | `Node`   | [caret-from-point.ts:33](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/selection-util/src/selection/caret-from-point.ts#L33) |
| `offset` | `number` | [caret-from-point.ts:33](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/selection-util/src/selection/caret-from-point.ts#L33) |

## Example

```typescript
const position = caretFromPoint(document, event.clientX, event.clientY);
if (position) {
  console.log("Caret is at:", position.node, position.offset);
}
```

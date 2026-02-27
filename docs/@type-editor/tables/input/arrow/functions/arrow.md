[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [input/arrow](../README.md) / arrow

# Function: arrow()

```ts
function arrow(axis, dir): Command;
```

Defined in: [tables/src/input/arrow.ts:30](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/input/arrow.ts#L30)

Creates a command for arrow key navigation within tables.

When the cursor is within a cell selection, this moves the selection near the head cell.
When at the edge of a cell, it navigates to the adjacent cell.

## Parameters

| Parameter | Type                                                                    | Description                                                        |
| --------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `axis`    | [`Axis`](../../../types/input/Axis/type-aliases/Axis.md)                | The axis of movement ('horiz' for left/right, 'vert' for up/down). |
| `dir`     | [`Direction`](../../../types/input/Direction/type-aliases/Direction.md) | The direction of movement (-1 for left/up, 1 for right/down).      |

## Returns

`Command`

A ProseMirror command that handles arrow key navigation.

## Example

```typescript
// Create a command for moving right
const moveRight = arrow("horiz", 1);
```

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-coords-util](../../../README.md) / [dom-coords/pos-at-coords](../README.md) / posAtCoords

# Function: posAtCoords()

```ts
function posAtCoords(
  view,
  coords,
): {
  inside: number;
  pos: number;
};
```

Defined in: [dom-coords/pos-at-coords.ts:34](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/dom-coords-util/src/dom-coords/pos-at-coords.ts#L34)

Given x,y coordinates on the editor, get the corresponding position in the document.
This function handles various browser quirks and edge cases to accurately determine
the document position from screen coordinates.

## Parameters

| Parameter | Type                                                              | Description                       |
| --------- | ----------------------------------------------------------------- | --------------------------------- |
| `view`    | `PmEditorView`                                                    | The editor view                   |
| `coords`  | [`Coords`](../../../types/dom-coords/Coords/interfaces/Coords.md) | The screen coordinates to convert |

## Returns

```ts
{
  inside: number;
  pos: number;
}
```

Object containing the document position and inside information, or null if outside editor

| Name     | Type     | Defined in                                                                                                                                                                       |
| -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inside` | `number` | [dom-coords/pos-at-coords.ts:34](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/dom-coords-util/src/dom-coords/pos-at-coords.ts#L34) |
| `pos`    | `number` | [dom-coords/pos-at-coords.ts:34](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/dom-coords-util/src/dom-coords/pos-at-coords.ts#L34) |

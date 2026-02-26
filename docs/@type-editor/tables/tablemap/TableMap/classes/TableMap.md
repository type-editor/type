[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [tablemap/TableMap](../README.md) / TableMap

# Class: TableMap

Defined in: [tables/src/tablemap/TableMap.ts:15](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tablemap/TableMap.ts#L15)

A table map describes the structure of a given table. To avoid
recomputing them all the time, they are cached per table node. To
be able to do that, positions saved in the map are relative to the
start of the table, rather than the start of the document.

## Constructors

### Constructor

```ts
new TableMap(
   width,
   height,
   map,
   problems): TableMap;
```

Defined in: [tables/src/tablemap/TableMap.ts:31](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tablemap/TableMap.ts#L31)

#### Parameters

| Parameter  | Type                                                                   | Description                                                                                                        |
| ---------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `width`    | `number`                                                               | The number of columns                                                                                              |
| `height`   | `number`                                                               | The number of rows                                                                                                 |
| `map`      | `number`[]                                                             | A width \* height array with the start position of the cell covering that part of the table in each slot.          |
| `problems` | [`Problem`](../../../types/tablemap/Problem/type-aliases/Problem.md)[] | An optional array of problems (cell overlap or non-rectangular shape) for the table, used by the table normalizer. |

#### Returns

`TableMap`

## Accessors

### height

#### Get Signature

```ts
get height(): number;
```

Defined in: [tables/src/tablemap/TableMap.ts:53](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tablemap/TableMap.ts#L53)

##### Returns

`number`

---

### map

#### Get Signature

```ts
get map(): number[];
```

Defined in: [tables/src/tablemap/TableMap.ts:57](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tablemap/TableMap.ts#L57)

##### Returns

`number`[]

---

### problems

#### Get Signature

```ts
get problems(): Problem[];
```

Defined in: [tables/src/tablemap/TableMap.ts:41](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tablemap/TableMap.ts#L41)

##### Returns

[`Problem`](../../../types/tablemap/Problem/type-aliases/Problem.md)[]

#### Set Signature

```ts
set problems(problems): void;
```

Defined in: [tables/src/tablemap/TableMap.ts:45](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tablemap/TableMap.ts#L45)

##### Parameters

| Parameter  | Type                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| `problems` | [`Problem`](../../../types/tablemap/Problem/type-aliases/Problem.md)[] |

##### Returns

`void`

---

### width

#### Get Signature

```ts
get width(): number;
```

Defined in: [tables/src/tablemap/TableMap.ts:49](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tablemap/TableMap.ts#L49)

##### Returns

`number`

## Methods

### cellsInRect()

```ts
cellsInRect(rect): number[];
```

Defined in: [tables/src/tablemap/TableMap.ts:188](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tablemap/TableMap.ts#L188)

Return the position of all cells that have the top left corner in
the given rectangle.

#### Parameters

| Parameter | Type                                                      | Description                             |
| --------- | --------------------------------------------------------- | --------------------------------------- |
| `rect`    | [`Rect`](../../../types/tablemap/Rect/interfaces/Rect.md) | The rectangular region to search within |

#### Returns

`number`[]

Array of table-relative positions of cells with top-left corners in the rect

---

### colCount()

```ts
colCount(pos): number;
```

Defined in: [tables/src/tablemap/TableMap.ts:117](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tablemap/TableMap.ts#L117)

Find the left side (column index) of the cell at the given position.

#### Parameters

| Parameter | Type     | Description                             |
| --------- | -------- | --------------------------------------- |
| `pos`     | `number` | The table-relative position of the cell |

#### Returns

`number`

The 0-based column index where the cell starts

#### Throws

If no cell exists at the given position

---

### findCell()

```ts
findCell(pos): Rect;
```

Defined in: [tables/src/tablemap/TableMap.ts:80](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tablemap/TableMap.ts#L80)

Find the dimensions of the cell at the given position.

#### Parameters

| Parameter | Type     | Description                             |
| --------- | -------- | --------------------------------------- |
| `pos`     | `number` | The table-relative position of the cell |

#### Returns

[`Rect`](../../../types/tablemap/Rect/interfaces/Rect.md)

A Rect describing the cell's boundaries in the grid

#### Throws

If no cell exists at the given position

---

### nextCell()

```ts
nextCell(
   pos,
   axis,
   dir): number;
```

Defined in: [tables/src/tablemap/TableMap.ts:135](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tablemap/TableMap.ts#L135)

Find the next cell in the given direction, starting from the cell at `pos`, if any.

#### Parameters

| Parameter | Type                  | Description                                                     |
| --------- | --------------------- | --------------------------------------------------------------- |
| `pos`     | `number`              | The table-relative position of the starting cell                |
| `axis`    | `"horiz"` \| `"vert"` | The direction axis: 'horiz' for horizontal, 'vert' for vertical |
| `dir`     | `number`              | The direction: negative for left/up, positive for right/down    |

#### Returns

`number`

The position of the adjacent cell, or null if at table boundary

---

### positionAt()

```ts
positionAt(
   row,
   col,
   table): number;
```

Defined in: [tables/src/tablemap/TableMap.ts:223](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tablemap/TableMap.ts#L223)

Return the position at which the cell at the given row and column
starts, or would start, if a cell started there.

#### Parameters

| Parameter | Type     | Description              |
| --------- | -------- | ------------------------ |
| `row`     | `number` | The 0-based row index    |
| `col`     | `number` | The 0-based column index |
| `table`   | `Node_2` | The table node           |

#### Returns

`number`

The table-relative position where the cell at (row, col) starts

---

### rectBetween()

```ts
rectBetween(a, b): Rect;
```

Defined in: [tables/src/tablemap/TableMap.ts:158](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tablemap/TableMap.ts#L158)

Get the rectangle spanning the two given cells.

#### Parameters

| Parameter | Type     | Description                                    |
| --------- | -------- | ---------------------------------------------- |
| `a`       | `number` | The table-relative position of the first cell  |
| `b`       | `number` | The table-relative position of the second cell |

#### Returns

[`Rect`](../../../types/tablemap/Rect/interfaces/Rect.md)

A Rect that encompasses both cells

---

### get()

```ts
static get(table): TableMap;
```

Defined in: [tables/src/tablemap/TableMap.ts:69](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/tablemap/TableMap.ts#L69)

Find the table map for the given table node.
Results are cached, so subsequent calls with the same node are efficient.

#### Parameters

| Parameter | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `table`   | `Node_2` | The table node to get the map for |

#### Returns

`TableMap`

The TableMap for the given table node

#### Throws

If the provided node is not a table

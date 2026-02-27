[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [cellselection/CellBookmark](../README.md) / CellBookmark

# Class: CellBookmark

Defined in: [tables/src/cellselection/CellBookmark.ts:17](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/cellselection/CellBookmark.ts#L17)

A bookmark for a CellSelection that can survive document changes.

Bookmarks store the raw positions of the anchor and head cells and can
be mapped through document transformations. When resolved, they attempt
to recreate the original CellSelection or fall back to a nearby selection.

## See

[CellSelection.getBookmark](../../CellSelection/classes/CellSelection.md#getbookmark)

## Constructors

### Constructor

```ts
new CellBookmark(anchor, head): CellBookmark;
```

Defined in: [tables/src/cellselection/CellBookmark.ts:30](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/cellselection/CellBookmark.ts#L30)

Creates a new CellBookmark.

#### Parameters

| Parameter | Type     | Description                                        |
| --------- | -------- | -------------------------------------------------- |
| `anchor`  | `number` | The absolute document position of the anchor cell. |
| `head`    | `number` | The absolute document position of the head cell.   |

#### Returns

`CellBookmark`

## Methods

### map()

```ts
map(mapping): CellBookmark;
```

Defined in: [tables/src/cellselection/CellBookmark.ts:41](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/cellselection/CellBookmark.ts#L41)

Maps this bookmark through a document transformation.

#### Parameters

| Parameter | Type       | Description                                 |
| --------- | ---------- | ------------------------------------------- |
| `mapping` | `Mappable` | The mapping describing the document change. |

#### Returns

`CellBookmark`

A new CellBookmark with updated positions.

---

### resolve()

```ts
resolve(doc):
  | CellSelection
  | Selection_2;
```

Defined in: [tables/src/cellselection/CellBookmark.ts:54](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/cellselection/CellBookmark.ts#L54)

Resolves this bookmark to a selection in the given document.

If both positions still point to valid cells within the same table,
a CellSelection is returned. Otherwise, falls back to a nearby selection.

#### Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `doc`     | `Node_2` | The document to resolve positions in. |

#### Returns

\| [`CellSelection`](../../CellSelection/classes/CellSelection.md)
\| `Selection_2`

A CellSelection if valid, or a fallback Selection.

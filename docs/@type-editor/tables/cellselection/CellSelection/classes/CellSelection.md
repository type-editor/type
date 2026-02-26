[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [cellselection/CellSelection](../README.md) / CellSelection

# Class: CellSelection

Defined in: [tables/src/cellselection/CellSelection.ts:33](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L33)

A Selection subclass that represents a cell selection spanning part of a table.
With the plugin enabled, these will be created when the user selects across cells,
and will be drawn by giving selected cells a `selectedCell` CSS class.

## See

[Selection](https://prosemirror.net/docs/ref/#state.Selection|ProseMirror)

## Example

```typescript
// Create a single cell selection
const selection = new CellSelection($cellPos);

// Create a multi-cell selection
const selection = new CellSelection($anchorCell, $headCell);

// Create a full column selection
const colSel = CellSelection.colSelection($anchorCell, $headCell);
```

## Extends

- `Selection_2`

## Implements

- `PmSelection`

## Constructors

### Constructor

```ts
new CellSelection($anchorCell, $headCell?): CellSelection;
```

Defined in: [tables/src/cellselection/CellSelection.ts:52](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L52)

Creates a table cell selection identified by its anchor and head cells.
The positions given to this constructor should point _before_ two
cells in the same table. They may be the same, to select a single cell.

#### Parameters

| Parameter     | Type          | Default value | Description                                                                                                                                                    |
| ------------- | ------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$anchorCell` | `ResolvedPos` | `undefined`   | A resolved position pointing _in front of_ the anchor cell (the one that doesn't move when extending the selection).                                           |
| `$headCell`   | `ResolvedPos` | `$anchorCell` | A resolved position pointing in front of the head cell (the one that moves when extending the selection). Defaults to `$anchorCell` for single cell selection. |

#### Returns

`CellSelection`

#### Throws

If a cell cannot be found at the expected position.

#### Overrides

```ts
Selection.constructor;
```

## Properties

| Property                                                | Modifier    | Type                          | Inherited from              | Defined in                |
| ------------------------------------------------------- | ----------- | ----------------------------- | --------------------------- | ------------------------- |
| <a id="property-anchorpos"></a> `anchorPos`             | `readonly`  | `ResolvedPos`                 | `Selection.anchorPos`       | state/dist/index.d.ts:169 |
| <a id="property-headpos"></a> `headPos`                 | `readonly`  | `ResolvedPos`                 | `Selection.headPos`         | state/dist/index.d.ts:170 |
| <a id="property-isvisible"></a> `isVisible`             | `protected` | `boolean`                     | `Selection.isVisible`       | state/dist/index.d.ts:171 |
| <a id="property-selectionranges"></a> `selectionRanges` | `readonly`  | readonly `PmSelectionRange`[] | `Selection.selectionRanges` | state/dist/index.d.ts:168 |

## Accessors

### $anchor

#### Get Signature

```ts
get $anchor(): ResolvedPos;
```

Defined in: state/dist/index.d.ts:177

##### Returns

`ResolvedPos`

#### Implementation of

```ts
PmSelection.$anchor;
```

#### Inherited from

```ts
Selection.$anchor;
```

---

### $anchorCell

#### Get Signature

```ts
get $anchorCell(): ResolvedPos;
```

Defined in: [tables/src/cellselection/CellSelection.ts:65](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L65)

The resolved position of the anchor cell (the fixed endpoint of the selection).

##### Returns

`ResolvedPos`

The anchor cell's resolved position.

---

### $cursor

#### Get Signature

```ts
get $cursor(): ResolvedPos;
```

Defined in: state/dist/index.d.ts:174

##### Returns

`ResolvedPos`

#### Implementation of

```ts
PmSelection.$cursor;
```

#### Inherited from

```ts
Selection.$cursor;
```

---

### $from

#### Get Signature

```ts
get $from(): ResolvedPos;
```

Defined in: state/dist/index.d.ts:183

##### Returns

`ResolvedPos`

#### Implementation of

```ts
PmSelection.$from;
```

#### Inherited from

```ts
Selection.$from;
```

---

### $head

#### Get Signature

```ts
get $head(): ResolvedPos;
```

Defined in: state/dist/index.d.ts:178

##### Returns

`ResolvedPos`

#### Implementation of

```ts
PmSelection.$head;
```

#### Inherited from

```ts
Selection.$head;
```

---

### $headCell

#### Get Signature

```ts
get $headCell(): ResolvedPos;
```

Defined in: [tables/src/cellselection/CellSelection.ts:73](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L73)

The resolved position of the head cell (the moving endpoint of the selection).

##### Returns

`ResolvedPos`

The head cell's resolved position.

---

### $to

#### Get Signature

```ts
get $to(): ResolvedPos;
```

Defined in: state/dist/index.d.ts:184

##### Returns

`ResolvedPos`

#### Implementation of

```ts
PmSelection.$to;
```

#### Inherited from

```ts
Selection.$to;
```

---

### anchor

#### Get Signature

```ts
get anchor(): number;
```

Defined in: state/dist/index.d.ts:179

##### Returns

`number`

#### Implementation of

```ts
PmSelection.anchor;
```

#### Inherited from

```ts
Selection.anchor;
```

---

### empty

#### Get Signature

```ts
get empty(): boolean;
```

Defined in: state/dist/index.d.ts:185

##### Returns

`boolean`

#### Implementation of

```ts
PmSelection.empty;
```

#### Inherited from

```ts
Selection.empty;
```

---

### from

#### Get Signature

```ts
get from(): number;
```

Defined in: state/dist/index.d.ts:181

##### Returns

`number`

#### Implementation of

```ts
PmSelection.from;
```

#### Inherited from

```ts
Selection.from;
```

---

### head

#### Get Signature

```ts
get head(): number;
```

Defined in: state/dist/index.d.ts:180

##### Returns

`number`

#### Implementation of

```ts
PmSelection.head;
```

#### Inherited from

```ts
Selection.head;
```

---

### node

#### Get Signature

```ts
get node(): Node_2;
```

Defined in: state/dist/index.d.ts:175

##### Returns

`Node_2`

#### Implementation of

```ts
PmSelection.node;
```

#### Inherited from

```ts
Selection.node;
```

---

### ranges

#### Get Signature

```ts
get ranges(): readonly SelectionRange[];
```

Defined in: state/dist/index.d.ts:176

##### Returns

readonly `SelectionRange`[]

#### Implementation of

```ts
PmSelection.ranges;
```

#### Inherited from

```ts
Selection.ranges;
```

---

### to

#### Get Signature

```ts
get to(): number;
```

Defined in: state/dist/index.d.ts:182

##### Returns

`number`

#### Implementation of

```ts
PmSelection.to;
```

#### Inherited from

```ts
Selection.to;
```

---

### type

#### Get Signature

```ts
get type(): string;
```

Defined in: state/dist/index.d.ts:173

##### Returns

`string`

#### Implementation of

```ts
PmSelection.type;
```

#### Inherited from

```ts
Selection.type;
```

---

### visible

#### Get Signature

```ts
get visible(): boolean;
```

Defined in: state/dist/index.d.ts:186

##### Returns

`boolean`

#### Set Signature

```ts
set visible(isVisible): void;
```

Defined in: state/dist/index.d.ts:187

##### Parameters

| Parameter   | Type      |
| ----------- | --------- |
| `isVisible` | `boolean` |

##### Returns

`void`

#### Implementation of

```ts
PmSelection.visible;
```

#### Inherited from

```ts
Selection.visible;
```

## Methods

### content()

```ts
content(): Slice;
```

Defined in: [tables/src/cellselection/CellSelection.ts:356](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L356)

Returns a rectangular slice of table rows containing the selected cells.

If cells span beyond the selection rectangle, their colspan/rowspan
attributes are adjusted accordingly. If the entire table is selected,
the complete table node is returned.

#### Returns

`Slice`

A Slice containing the selected cells organized in rows.

#### Throws

If a cell cannot be found at an expected position.

#### Implementation of

```ts
PmSelection.content;
```

#### Overrides

```ts
Selection.content;
```

---

### eq()

```ts
eq(other): boolean;
```

Defined in: [tables/src/cellselection/CellSelection.ts:522](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L522)

Compares this selection with another for equality.

Two CellSelections are equal if they have the same anchor and head positions.

#### Parameters

| Parameter | Type      | Description                 |
| --------- | --------- | --------------------------- |
| `other`   | `unknown` | The object to compare with. |

#### Returns

`boolean`

`true` if the selections are equal, `false` otherwise.

#### Implementation of

```ts
PmSelection.eq;
```

#### Overrides

```ts
Selection.eq;
```

---

### forEachCell()

```ts
forEachCell(callbackFunc): void;
```

Defined in: [tables/src/cellselection/CellSelection.ts:439](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L439)

Iterates over all cells in the selection, calling the provided callback
for each cell with the cell node and its absolute document position.

#### Parameters

| Parameter      | Type                      | Description                                                                       |
| -------------- | ------------------------- | --------------------------------------------------------------------------------- |
| `callbackFunc` | (`node`, `pos`) => `void` | Function to call for each cell. Receives the cell node and its document position. |

#### Returns

`void`

#### Example

```typescript
selection.forEachCell((cell, pos) => {
  console.log(`Cell at ${pos} has ${cell.childCount} children`);
});
```

---

### getBookmark()

```ts
getBookmark(): CellBookmark;
```

Defined in: [tables/src/cellselection/CellSelection.ts:548](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L548)

Returns a bookmark that can be used to recreate this selection after document changes.

#### Returns

[`CellBookmark`](../../CellBookmark/classes/CellBookmark.md)

A CellBookmark representing this selection's position.

#### Implementation of

```ts
PmSelection.getBookmark;
```

#### Overrides

```ts
Selection.getBookmark;
```

---

### isAllSelection()

```ts
isAllSelection(): boolean;
```

Defined in: state/dist/index.d.ts:201

#### Returns

`boolean`

#### Implementation of

```ts
PmSelection.isAllSelection;
```

#### Inherited from

```ts
Selection.isAllSelection;
```

---

### isColSelection()

```ts
isColSelection(): boolean;
```

Defined in: [tables/src/cellselection/CellSelection.ts:467](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L467)

Checks whether this selection spans entire columns (from top to bottom of the table).

A selection is a column selection if both the anchor and head cells
together span from the first row to the last row of the table.

#### Returns

`boolean`

`true` if this selection spans complete columns, `false` otherwise.

---

### isNodeSelection()

```ts
isNodeSelection(): boolean;
```

Defined in: state/dist/index.d.ts:200

#### Returns

`boolean`

#### Implementation of

```ts
PmSelection.isNodeSelection;
```

#### Inherited from

```ts
Selection.isNodeSelection;
```

---

### isRowSelection()

```ts
isRowSelection(): boolean;
```

Defined in: [tables/src/cellselection/CellSelection.ts:492](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L492)

Checks whether this selection spans entire rows (from left to right of the table).

A selection is a row selection if both the anchor and head cells
together span from the first column to the last column of the table.

#### Returns

`boolean`

`true` if this selection spans complete rows, `false` otherwise.

---

### isTextSelection()

```ts
isTextSelection(): boolean;
```

Defined in: state/dist/index.d.ts:199

#### Returns

`boolean`

#### Implementation of

```ts
PmSelection.isTextSelection;
```

#### Inherited from

```ts
Selection.isTextSelection;
```

---

### map()

```ts
map(doc, mapping): CellSelection | Selection_2;
```

Defined in: [tables/src/cellselection/CellSelection.ts:324](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L324)

Maps this selection through a document change.

If the anchor and head cells are still valid after the mapping and remain
in the same table, a new CellSelection is returned. For row or column
selections where the table structure changed, the selection is recreated
to maintain the correct boundaries.

#### Parameters

| Parameter | Type       | Description                                 |
| --------- | ---------- | ------------------------------------------- |
| `doc`     | `Node_2`   | The new document after the change.          |
| `mapping` | `Mappable` | The mapping describing the document change. |

#### Returns

`CellSelection` \| `Selection_2`

A new CellSelection if cells are still valid, or a TextSelection fallback.

#### Implementation of

```ts
PmSelection.map;
```

#### Overrides

```ts
Selection.map;
```

---

### replace()

```ts
replace(transaction, content?): void;
```

Defined in: [tables/src/cellselection/CellSelection.ts:384](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L384)

Replaces the content of all selected cells with the given content.

The first cell receives the provided content, while all other cells
are cleared. After replacement, the selection is updated to point
to a valid position.

#### Parameters

| Parameter     | Type            | Default value | Description                                                   |
| ------------- | --------------- | ------------- | ------------------------------------------------------------- |
| `transaction` | `PmTransaction` | `undefined`   | The transaction to apply changes to.                          |
| `content`     | `Slice`         | `Slice.empty` | The content to insert into the first cell. Defaults to empty. |

#### Returns

`void`

#### Implementation of

```ts
PmSelection.replace;
```

#### Overrides

```ts
Selection.replace;
```

---

### replaceWith()

```ts
replaceWith(tr, node): void;
```

Defined in: [tables/src/cellselection/CellSelection.ts:421](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L421)

Replaces the content of all selected cells with the given node.

#### Parameters

| Parameter | Type            | Description                             |
| --------- | --------------- | --------------------------------------- |
| `tr`      | `PmTransaction` | The transaction to apply changes to.    |
| `node`    | `Node_2`        | The node to insert into the first cell. |

#### Returns

`void`

#### Implementation of

```ts
PmSelection.replaceWith;
```

#### Overrides

```ts
Selection.replaceWith;
```

---

### toJSON()

```ts
toJSON(): CellSelectionJSON;
```

Defined in: [tables/src/cellselection/CellSelection.ts:535](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L535)

Converts this selection to a JSON-serializable object.

#### Returns

[`CellSelectionJSON`](../../../types/cellselection/CellSelectionJSON/interfaces/CellSelectionJSON.md)

A CellSelectionJSON object representing this selection.

#### Implementation of

```ts
PmSelection.toJSON;
```

#### Overrides

```ts
Selection.toJSON;
```

---

### atEnd()

```ts
static atEnd(doc): Selection_2;
```

Defined in: state/dist/index.d.ts:190

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `doc`     | `Node_2` |

#### Returns

`Selection_2`

#### Inherited from

```ts
Selection.atEnd;
```

---

### atStart()

```ts
static atStart(doc): Selection_2;
```

Defined in: state/dist/index.d.ts:189

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `doc`     | `Node_2` |

#### Returns

`Selection_2`

#### Inherited from

```ts
Selection.atStart;
```

---

### between()

```ts
static between(
   $anchor,
   $head,
   bias?): Selection_2;
```

Defined in: state/dist/index.d.ts:194

#### Parameters

| Parameter | Type          |
| --------- | ------------- |
| `$anchor` | `ResolvedPos` |
| `$head`   | `ResolvedPos` |
| `bias?`   | `number`      |

#### Returns

`Selection_2`

#### Inherited from

```ts
Selection.between;
```

---

### colSelection()

```ts
static colSelection($anchorCell, $headCell?): CellSelection;
```

Defined in: [tables/src/cellselection/CellSelection.ts:93](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L93)

Creates the smallest column selection that covers the given anchor and head cells.

This method expands the selection to span from the top row to the bottom row
of the table for the columns containing the anchor and head cells.

#### Parameters

| Parameter     | Type          | Default value | Description                                                               |
| ------------- | ------------- | ------------- | ------------------------------------------------------------------------- |
| `$anchorCell` | `ResolvedPos` | `undefined`   | A resolved position pointing to the anchor cell.                          |
| `$headCell`   | `ResolvedPos` | `$anchorCell` | A resolved position pointing to the head cell. Defaults to `$anchorCell`. |

#### Returns

`CellSelection`

A new CellSelection spanning complete columns.

#### Example

```typescript
// Select the entire column containing the cell at $cellPos
const colSelection = CellSelection.colSelection($cellPos);
```

---

### create()

```ts
static create(
   doc,
   anchorCell,
   headCell?): CellSelection;
```

Defined in: [tables/src/cellselection/CellSelection.ts:178](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L178)

Factory method to create a CellSelection from anchor and head cell positions.

#### Parameters

| Parameter    | Type     | Default value | Description                                                       |
| ------------ | -------- | ------------- | ----------------------------------------------------------------- |
| `doc`        | `Node_2` | `undefined`   | The document containing the cells.                                |
| `anchorCell` | `number` | `undefined`   | The absolute position of the anchor cell.                         |
| `headCell`   | `number` | `anchorCell`  | The absolute position of the head cell. Defaults to `anchorCell`. |

#### Returns

`CellSelection`

A new CellSelection instance.

---

### findFrom()

```ts
static findFrom(
   $pos,
   dir,
   textOnly?): Selection_2;
```

Defined in: state/dist/index.d.ts:191

#### Parameters

| Parameter   | Type          |
| ----------- | ------------- |
| `$pos`      | `ResolvedPos` |
| `dir`       | `number`      |
| `textOnly?` | `boolean`     |

#### Returns

`Selection_2`

#### Inherited from

```ts
Selection.findFrom;
```

---

### fromJSON()

```ts
static fromJSON(doc, json): CellSelection;
```

Defined in: [tables/src/cellselection/CellSelection.ts:166](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L166)

Creates a CellSelection from a JSON representation.

#### Parameters

| Parameter | Type                                                                                                  | Description                                 |
| --------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `doc`     | `Node_2`                                                                                              | The document to resolve positions in.       |
| `json`    | [`CellSelectionJSON`](../../../types/cellselection/CellSelectionJSON/interfaces/CellSelectionJSON.md) | The JSON object representing the selection. |

#### Returns

`CellSelection`

A new CellSelection instance.

#### Overrides

```ts
Selection.fromJSON;
```

---

### isNodeSelectable()

```ts
static isNodeSelectable(node): boolean;
```

Defined in: state/dist/index.d.ts:192

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `node`    | `Node_2` |

#### Returns

`boolean`

#### Inherited from

```ts
Selection.isNodeSelectable;
```

---

### jsonID()

```ts
static jsonID(jsonId, jsonDeserializerClass): void;
```

Defined in: state/dist/index.d.ts:166

#### Parameters

| Parameter               | Type                          |
| ----------------------- | ----------------------------- |
| `jsonId`                | `string`                      |
| `jsonDeserializerClass` | `JSONToSelectionDeserializer` |

#### Returns

`void`

#### Inherited from

```ts
Selection.jsonID;
```

---

### near()

```ts
static near($pos, bias?): Selection_2;
```

Defined in: state/dist/index.d.ts:188

#### Parameters

| Parameter | Type          |
| --------- | ------------- |
| `$pos`    | `ResolvedPos` |
| `bias?`   | `number`      |

#### Returns

`Selection_2`

#### Inherited from

```ts
Selection.near;
```

---

### registerAllSelectionHandler()

```ts
protected static registerAllSelectionHandler(handler): void;
```

Defined in: state/dist/index.d.ts:165

#### Parameters

| Parameter | Type                          |
| --------- | ----------------------------- |
| `handler` | (...`param`) => `PmSelection` |

#### Returns

`void`

#### Inherited from

```ts
Selection.registerAllSelectionHandler;
```

---

### registerJsonDeserializerClass()

```ts
static registerJsonDeserializerClass(jsonId, jsonDeserializerClass): void;
```

Defined in: state/dist/index.d.ts:167

#### Parameters

| Parameter               | Type                          |
| ----------------------- | ----------------------------- |
| `jsonId`                | `string`                      |
| `jsonDeserializerClass` | `JSONToSelectionDeserializer` |

#### Returns

`void`

#### Inherited from

```ts
Selection.registerJsonDeserializerClass;
```

---

### registerNodeSelectionHandler()

```ts
protected static registerNodeSelectionHandler(handler): void;
```

Defined in: state/dist/index.d.ts:164

#### Parameters

| Parameter | Type                          |
| --------- | ----------------------------- |
| `handler` | (...`param`) => `PmSelection` |

#### Returns

`void`

#### Inherited from

```ts
Selection.registerNodeSelectionHandler;
```

---

### registerTextSelectionHandler()

```ts
protected static registerTextSelectionHandler(handler): void;
```

Defined in: state/dist/index.d.ts:163

#### Parameters

| Parameter | Type                          |
| --------- | ----------------------------- |
| `handler` | (...`param`) => `PmSelection` |

#### Returns

`void`

#### Inherited from

```ts
Selection.registerTextSelectionHandler;
```

---

### rowSelection()

```ts
static rowSelection($anchorCell, $headCell?): CellSelection;
```

Defined in: [tables/src/cellselection/CellSelection.ts:134](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/cellselection/CellSelection.ts#L134)

Creates the smallest row selection that covers the given anchor and head cells.

This method expands the selection to span from the leftmost column to the
rightmost column of the table for the rows containing the anchor and head cells.

#### Parameters

| Parameter     | Type          | Default value | Description                                                               |
| ------------- | ------------- | ------------- | ------------------------------------------------------------------------- |
| `$anchorCell` | `ResolvedPos` | `undefined`   | A resolved position pointing to the anchor cell.                          |
| `$headCell`   | `ResolvedPos` | `$anchorCell` | A resolved position pointing to the head cell. Defaults to `$anchorCell`. |

#### Returns

`CellSelection`

A new CellSelection spanning complete rows.

#### Example

```typescript
// Select the entire row containing the cell at $cellPos
const rowSelection = CellSelection.rowSelection($cellPos);
```

---

### textSelectionBetween()

```ts
static textSelectionBetween(
   $anchor,
   $head,
   bias?): Selection_2;
```

Defined in: state/dist/index.d.ts:195

#### Parameters

| Parameter | Type          |
| --------- | ------------- |
| `$anchor` | `ResolvedPos` |
| `$head`   | `ResolvedPos` |
| `bias?`   | `number`      |

#### Returns

`Selection_2`

#### Inherited from

```ts
Selection.textSelectionBetween;
```

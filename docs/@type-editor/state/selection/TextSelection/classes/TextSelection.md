[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/state](../../../README.md) / [selection/TextSelection](../README.md) / TextSelection

# Class: TextSelection

Defined in: [state/src/selection/TextSelection.ts:24](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/TextSelection.ts#L24)

A text selection represents a classical editor selection, with a
head (the moving side) and anchor (immobile side), both of which
point into textblock nodes. It can be empty (a regular cursor
position).

This is the most common selection type, representing standard text
editing selections. When anchor equals head, it represents a cursor
position. When they differ, it represents a range of selected text.

Both anchor and head must point into nodes with inline content
(text blocks). A warning will be logged in development mode if
this constraint is violated.

## Extends

- [`Selection`](../../Selection/classes/Selection.md)

## Implements

- `PmSelection`

## Constructors

### Constructor

```ts
new TextSelection($anchor, $head?): TextSelection;
```

Defined in: [state/src/selection/TextSelection.ts:58](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/TextSelection.ts#L58)

Creates a text selection between the given points.
If only anchor is provided, creates a cursor selection at that position.

#### Parameters

| Parameter | Type          | Default value | Description                                                                      |
| --------- | ------------- | ------------- | -------------------------------------------------------------------------------- |
| `$anchor` | `ResolvedPos` | `undefined`   | The resolved anchor position (immobile end of the selection)                     |
| `$head`   | `ResolvedPos` | `$anchor`     | The resolved head position (mobile end), defaults to anchor for cursor selection |

#### Returns

`TextSelection`

#### Overrides

[`Selection`](../../Selection/classes/Selection.md).[`constructor`](../../Selection/classes/Selection.md#constructor)

## Properties

| Property                                                | Modifier    | Type                          | Default value | Description                                                                                                                      | Inherited from                                                                                                                         | Defined in                                                                                                                                                               |
| ------------------------------------------------------- | ----------- | ----------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="property-anchorpos"></a> `anchorPos`             | `readonly`  | `ResolvedPos`                 | `undefined`   | The resolved position of the selection's anchor (the immobile end).                                                              | [`Selection`](../../Selection/classes/Selection.md).[`anchorPos`](../../Selection/classes/Selection.md#property-anchorpos)             | [state/src/selection/Selection.ts:92](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L92)   |
| <a id="property-headpos"></a> `headPos`                 | `readonly`  | `ResolvedPos`                 | `undefined`   | The resolved position of the selection's head (the mobile end).                                                                  | [`Selection`](../../Selection/classes/Selection.md).[`headPos`](../../Selection/classes/Selection.md#property-headpos)                 | [state/src/selection/Selection.ts:98](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L98)   |
| <a id="property-isvisible"></a> `isVisible`             | `protected` | `boolean`                     | `true`        | Controls whether the selection should be visible in the browser. Some selection types (like node selections) may be invisible.   | [`Selection`](../../Selection/classes/Selection.md).[`isVisible`](../../Selection/classes/Selection.md#property-isvisible)             | [state/src/selection/Selection.ts:105](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L105) |
| <a id="property-selectionranges"></a> `selectionRanges` | `readonly`  | readonly `PmSelectionRange`[] | `undefined`   | The array of selection ranges covered by this selection. Most selections have a single range, but some may span multiple ranges. | [`Selection`](../../Selection/classes/Selection.md).[`selectionRanges`](../../Selection/classes/Selection.md#property-selectionranges) | [state/src/selection/Selection.ts:86](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L86)   |

## Accessors

### $anchor

#### Get Signature

```ts
get $anchor(): ResolvedPos;
```

Defined in: [state/src/selection/Selection.ts:167](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L167)

The resolved anchor position of the selection.
The anchor is the immobile end of the selection - it stays in place
when the user extends the selection by moving the head.

##### Returns

`ResolvedPos`

The resolved anchor position

#### Implementation of

```ts
PmSelection.$anchor;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`$anchor`](../../Selection/classes/Selection.md#anchor)

---

### $cursor

#### Get Signature

```ts
get $cursor(): ResolvedPos;
```

Defined in: [state/src/selection/TextSelection.ts:83](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/TextSelection.ts#L83)

Returns a resolved position if this is a cursor selection (an
empty text selection), and null otherwise.

When the anchor and head are at the same position, this selection
represents a cursor rather than a range. This getter provides
convenient access to that position.

##### Returns

`ResolvedPos`

The cursor position if this is a cursor selection, null if it's a range

#### Implementation of

```ts
PmSelection.$cursor;
```

#### Overrides

[`Selection`](../../Selection/classes/Selection.md).[`$cursor`](../../Selection/classes/Selection.md#cursor)

---

### $from

#### Get Signature

```ts
get $from(): ResolvedPos;
```

Defined in: [state/src/selection/Selection.ts:234](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L234)

The resolved lower bound of the selection's main range.
This provides access to the document structure at the start of the selection,
allowing you to query the context and perform position-based operations.

##### Throws

If the selection has no ranges

##### Returns

`ResolvedPos`

The resolved starting position

#### Implementation of

```ts
PmSelection.$from;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`$from`](../../Selection/classes/Selection.md#from)

---

### $head

#### Get Signature

```ts
get $head(): ResolvedPos;
```

Defined in: [state/src/selection/Selection.ts:178](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L178)

The resolved head position of the selection.
The head is the mobile end of the selection - it moves when
the user extends or modifies the selection.

##### Returns

`ResolvedPos`

The resolved head position

#### Implementation of

```ts
PmSelection.$head;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`$head`](../../Selection/classes/Selection.md#head)

---

### $to

#### Get Signature

```ts
get $to(): ResolvedPos;
```

Defined in: [state/src/selection/Selection.ts:249](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L249)

The resolved upper bound of the selection's main range.
This provides access to the document structure at the end of the selection,
allowing you to query the context and perform position-based operations.

##### Throws

If the selection has no ranges

##### Returns

`ResolvedPos`

The resolved ending position

#### Implementation of

```ts
PmSelection.$to;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`$to`](../../Selection/classes/Selection.md#to)

---

### anchor

#### Get Signature

```ts
get anchor(): number;
```

Defined in: [state/src/selection/Selection.ts:189](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L189)

The selection's anchor, as an unresolved position.
This is the integer position in the document where the anchor is located.
The anchor is the immobile end of the selection.

##### Returns

`number`

The anchor position as a number

#### Implementation of

```ts
PmSelection.anchor;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`anchor`](../../Selection/classes/Selection.md#anchor-1)

---

### empty

#### Get Signature

```ts
get empty(): boolean;
```

Defined in: [state/src/selection/Selection.ts:263](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L263)

Indicates whether the selection contains any content.
A selection is empty when all its ranges have identical from and to positions,
which typically represents a cursor position rather than a content selection.

##### Returns

`boolean`

True if the selection is empty (cursor), false if it spans content

#### Implementation of

```ts
PmSelection.empty;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`empty`](../../Selection/classes/Selection.md#empty)

---

### from

#### Get Signature

```ts
get from(): number;
```

Defined in: [state/src/selection/Selection.ts:211](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L211)

The lower bound of the selection's main range.
This is always the smaller position value, regardless of which end is
the anchor or head. For a cursor selection, this equals `to`.

##### Returns

`number`

The starting position of the selection

#### Implementation of

```ts
PmSelection.from;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`from`](../../Selection/classes/Selection.md#from-1)

---

### head

#### Get Signature

```ts
get head(): number;
```

Defined in: [state/src/selection/Selection.ts:200](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L200)

The selection's head, as an unresolved position.
This is the integer position in the document where the head is located.
The head is the mobile end of the selection that moves when extending it.

##### Returns

`number`

The head position as a number

#### Implementation of

```ts
PmSelection.head;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`head`](../../Selection/classes/Selection.md#head-1)

---

### node

#### Get Signature

```ts
get node(): Node_2;
```

Defined in: [state/src/selection/Selection.ts:145](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L145)

The selected node if this is a node selection, null otherwise

##### Returns

`Node_2`

#### Implementation of

```ts
PmSelection.node;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`node`](../../Selection/classes/Selection.md#node)

---

### ranges

#### Get Signature

```ts
get ranges(): readonly SelectionRange[];
```

Defined in: [state/src/selection/Selection.ts:156](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L156)

The ranges covered by the selection.
For most selections, this will be a single range. Multiple ranges
are used for selections that span non-contiguous parts of the document.

##### Returns

readonly [`SelectionRange`](../../SelectionRange/classes/SelectionRange.md)[]

A readonly array of selection ranges

#### Implementation of

```ts
PmSelection.ranges;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`ranges`](../../Selection/classes/Selection.md#ranges)

---

### to

#### Get Signature

```ts
get to(): number;
```

Defined in: [state/src/selection/Selection.ts:222](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L222)

The upper bound of the selection's main range.
This is always the larger position value, regardless of which end is
the anchor or head. For a cursor selection, this equals `from`.

##### Returns

`number`

The ending position of the selection

#### Implementation of

```ts
PmSelection.to;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`to`](../../Selection/classes/Selection.md#to-1)

---

### type

#### Get Signature

```ts
get type(): string;
```

Defined in: [state/src/selection/TextSelection.ts:69](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/TextSelection.ts#L69)

The type identifier for this selection.

##### Returns

`string`

Always returns SelectionType.TEXT

#### Implementation of

```ts
PmSelection.type;
```

#### Overrides

[`Selection`](../../Selection/classes/Selection.md).[`type`](../../Selection/classes/Selection.md#type)

---

### visible

#### Get Signature

```ts
get visible(): boolean;
```

Defined in: [state/src/selection/Selection.ts:274](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L274)

Controls whether the selection should be visible to the user in the browser.
Most selections are visible (highlighted), but some selection types like
node selections may choose to be invisible.

##### Returns

`boolean`

True if the selection should be visible, false otherwise

#### Set Signature

```ts
set visible(isVisible): void;
```

Defined in: [state/src/selection/Selection.ts:283](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L283)

Sets whether the selection should be visible to the user in the browser.

##### Parameters

| Parameter   | Type      | Description                                          |
| ----------- | --------- | ---------------------------------------------------- |
| `isVisible` | `boolean` | True to make the selection visible, false to hide it |

##### Returns

`void`

#### Implementation of

```ts
PmSelection.visible;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`visible`](../../Selection/classes/Selection.md#visible)

## Methods

### content()

```ts
content(): Slice;
```

Defined in: [state/src/selection/Selection.ts:601](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L601)

Get the content of this selection as a slice.
This extracts the document fragment that falls within the selection's range,
preserving the structure and allowing it to be inserted elsewhere.

#### Returns

`Slice`

A slice containing the selected content

#### Implementation of

```ts
PmSelection.content;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`content`](../../Selection/classes/Selection.md#content)

---

### eq()

```ts
eq(other): boolean;
```

Defined in: [state/src/selection/TextSelection.ts:145](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/TextSelection.ts#L145)

Test whether this selection is equal to another selection.
Text selections are equal if they have the same anchor and head positions.

#### Parameters

| Parameter | Type          | Description                   |
| --------- | ------------- | ----------------------------- |
| `other`   | `PmSelection` | The selection to compare with |

#### Returns

`boolean`

True if both are text selections with matching anchor and head

#### Implementation of

```ts
PmSelection.eq;
```

#### Overrides

[`Selection`](../../Selection/classes/Selection.md).[`eq`](../../Selection/classes/Selection.md#eq)

---

### getBookmark()

```ts
getBookmark(): TextBookmark;
```

Defined in: [state/src/selection/TextSelection.ts:159](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/TextSelection.ts#L159)

Create a bookmark for this selection.
The bookmark stores the anchor and head positions and can be used
to restore this selection after document changes by mapping the
positions through those changes.

#### Returns

[`TextBookmark`](../../bookmarks/TextBookmark/classes/TextBookmark.md)

A TextBookmark instance that can recreate this selection

#### Implementation of

```ts
PmSelection.getBookmark;
```

#### Overrides

[`Selection`](../../Selection/classes/Selection.md).[`getBookmark`](../../Selection/classes/Selection.md#getbookmark)

---

### isAllSelection()

```ts
isAllSelection(): boolean;
```

Defined in: [state/src/selection/Selection.ts:590](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L590)

Check if this is an all selection.

#### Returns

`boolean`

True if this is an AllSelection instance

#### Implementation of

```ts
PmSelection.isAllSelection;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`isAllSelection`](../../Selection/classes/Selection.md#isallselection)

---

### isNodeSelection()

```ts
isNodeSelection(): boolean;
```

Defined in: [state/src/selection/Selection.ts:581](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L581)

Check if this is a node selection.

#### Returns

`boolean`

True if this is a NodeSelection instance

#### Implementation of

```ts
PmSelection.isNodeSelection;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`isNodeSelection`](../../Selection/classes/Selection.md#isnodeselection)

---

### isTextSelection()

```ts
isTextSelection(): boolean;
```

Defined in: [state/src/selection/Selection.ts:572](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L572)

Check if this is a text selection.

#### Returns

`boolean`

True if this is a TextSelection instance

#### Implementation of

```ts
PmSelection.isTextSelection;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`isTextSelection`](../../Selection/classes/Selection.md#istextselection)

---

### map()

```ts
map(doc, mapping): Selection;
```

Defined in: [state/src/selection/Selection.ts:640](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L640)

Map this selection through a mappable transformation.
This updates the selection to reflect changes made to the document,
adjusting positions and potentially changing the selection type if
the mapped positions are no longer valid for the current type.

For example, if a text selection's positions are mapped to non-inline
content, this will find a nearby valid selection instead.

#### Parameters

| Parameter | Type       | Description                                            |
| --------- | ---------- | ------------------------------------------------------ |
| `doc`     | `Node_2`   | The new document after the transformation              |
| `mapping` | `Mappable` | The mappable transformation (e.g., from a transaction) |

#### Returns

[`Selection`](../../Selection/classes/Selection.md)

A new selection mapped to the new document

#### Implementation of

```ts
PmSelection.map;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`map`](../../Selection/classes/Selection.md#map)

---

### replace()

```ts
replace(transaction, content?): void;
```

Defined in: [state/src/selection/Selection.ts:672](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L672)

Replace the selection with a slice or, if no slice is given,
delete the selection. Will append to the given transaction.

#### Parameters

| Parameter     | Type            | Default value |
| ------------- | --------------- | ------------- |
| `transaction` | `PmTransaction` | `undefined`   |
| `content`     | `Slice`         | `Slice.empty` |

#### Returns

`void`

#### Implementation of

```ts
PmSelection.replace;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`replace`](../../Selection/classes/Selection.md#replace)

---

### replaceWith()

```ts
replaceWith(transaction, node): void;
```

Defined in: [state/src/selection/Selection.ts:754](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L754)

Replace the selection with the given node, appending the changes
to the given transaction.

For multi-range selections, the first range is replaced with the node,
and subsequent ranges are deleted. The selection is then positioned
after the inserted node.

#### Parameters

| Parameter     | Type            | Description                                  |
| ------------- | --------------- | -------------------------------------------- |
| `transaction` | `PmTransaction` | The transaction to append the replacement to |
| `node`        | `Node_2`        | The node to insert in place of the selection |

#### Returns

`void`

#### Implementation of

```ts
PmSelection.replaceWith;
```

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`replaceWith`](../../Selection/classes/Selection.md#replacewith)

---

### toJSON()

```ts
toJSON(): SelectionJSON;
```

Defined in: [state/src/selection/TextSelection.ts:168](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/TextSelection.ts#L168)

Convert this selection to a JSON-serializable representation.

#### Returns

`SelectionJSON`

A JSON object containing the type, anchor, and head positions

#### Implementation of

```ts
PmSelection.toJSON;
```

#### Overrides

[`Selection`](../../Selection/classes/Selection.md).[`toJSON`](../../Selection/classes/Selection.md#tojson)

---

### atEnd()

```ts
static atEnd(doc): Selection;
```

Defined in: [state/src/selection/Selection.ts:335](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L335)

Find the cursor or leaf node selection closest to the end of the
given document. Will return an AllSelection if no valid position
exists.

This is commonly used to position the cursor at the end of a document.

#### Parameters

| Parameter | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `doc`     | `Node_2` | The document node to find a selection in |

#### Returns

[`Selection`](../../Selection/classes/Selection.md)

A selection at the end of the document

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`atEnd`](../../Selection/classes/Selection.md#atend)

---

### atStart()

```ts
static atStart(doc): Selection;
```

Defined in: [state/src/selection/Selection.ts:320](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L320)

Find the cursor or leaf node selection closest to the start of
the given document. Will return an AllSelection if no valid
position exists.

This is commonly used to position the cursor at the beginning
of a document.

#### Parameters

| Parameter | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `doc`     | `Node_2` | The document node to find a selection in |

#### Returns

[`Selection`](../../Selection/classes/Selection.md)

A selection at the start of the document

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`atStart`](../../Selection/classes/Selection.md#atstart)

---

### between()

```ts
static between(
   $anchor,
   $head,
   bias?): Selection;
```

Defined in: [state/src/selection/Selection.ts:412](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L412)

#### Parameters

| Parameter | Type          |
| --------- | ------------- |
| `$anchor` | `ResolvedPos` |
| `$head`   | `ResolvedPos` |
| `bias?`   | `number`      |

#### Returns

[`Selection`](../../Selection/classes/Selection.md)

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`between`](../../Selection/classes/Selection.md#between)

---

### create()

Create a text selection. Overloaded to accept either resolved positions
or a document with integer positions.

#### Param

Either a resolved anchor position or a document node

#### Param

Either a resolved head position (if first arg is ResolvedPos) or anchor position number (if first arg is Node)

#### Param

Optional head position number (only used if first arg is Node)

#### Call Signature

```ts
static create(
   node,
   anchor,
   head?): TextSelection;
```

Defined in: [state/src/selection/TextSelection.ts:180](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/TextSelection.ts#L180)

Create a text selection from a document node and integer positions.

##### Parameters

| Parameter | Type     | Description                                                           |
| --------- | -------- | --------------------------------------------------------------------- |
| `node`    | `Node_2` | The document node containing the selection                            |
| `anchor`  | `number` | The anchor position as an integer offset                              |
| `head?`   | `number` | The head position as an integer offset (optional, defaults to anchor) |

##### Returns

`TextSelection`

A new EditorSelection wrapping a TextSelection

#### Call Signature

```ts
static create(anchor, head?): TextSelection;
```

Defined in: [state/src/selection/TextSelection.ts:189](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/TextSelection.ts#L189)

Create a text selection from resolved positions.

##### Parameters

| Parameter | Type          | Description                                               |
| --------- | ------------- | --------------------------------------------------------- |
| `anchor`  | `ResolvedPos` | The resolved anchor position                              |
| `head?`   | `ResolvedPos` | The resolved head position (optional, defaults to anchor) |

##### Returns

`TextSelection`

A new EditorSelection wrapping a TextSelection

---

### findFrom()

```ts
static findFrom(
   $pos,
   dir,
   textOnly?): Selection;
```

Defined in: [state/src/selection/Selection.ts:354](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L354)

Find a valid cursor or leaf node selection starting at the given
position and searching in the specified direction. When `textOnly`
is true, only consider cursor selections (no node selections).
Will return null when no valid selection position is found.

This method searches both within the current parent node and up
the document tree to find a valid selection position.

#### Parameters

| Parameter  | Type          | Default value | Description                                                       |
| ---------- | ------------- | ------------- | ----------------------------------------------------------------- |
| `$pos`     | `ResolvedPos` | `undefined`   | The resolved position to start searching from                     |
| `dir`      | `number`      | `undefined`   | The search direction: negative for backward, positive for forward |
| `textOnly` | `boolean`     | `false`       | If true, only return text/cursor selections (default: false)      |

#### Returns

[`Selection`](../../Selection/classes/Selection.md)

A valid selection, or null if none found

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`findFrom`](../../Selection/classes/Selection.md#findfrom)

---

### from()

```ts
static from(
   doc,
   anchor,
   head?): TextSelection;
```

Defined in: [state/src/selection/TextSelection.ts:111](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/TextSelection.ts#L111)

Create a text selection from non-resolved positions.
This is a convenience method that resolves the positions for you.

#### Parameters

| Parameter | Type     | Default value | Description                                                            |
| --------- | -------- | ------------- | ---------------------------------------------------------------------- |
| `doc`     | `Node_2` | `undefined`   | The document node in which to create the selection                     |
| `anchor`  | `number` | `undefined`   | The anchor position as an integer offset                               |
| `head`    | `number` | `anchor`      | The head position as an integer offset (defaults to anchor for cursor) |

#### Returns

`TextSelection`

A new TextSelection instance

---

### fromJSON()

```ts
static fromJSON(doc, json): TextSelection;
```

Defined in: [state/src/selection/TextSelection.ts:95](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/TextSelection.ts#L95)

Deserialize a text selection from its JSON representation.

#### Parameters

| Parameter | Type            | Description                                            |
| --------- | --------------- | ------------------------------------------------------ |
| `doc`     | `Node_2`        | The document node containing the selection             |
| `json`    | `SelectionJSON` | The JSON representation with anchor and head positions |

#### Returns

`TextSelection`

A new TextSelection instance

#### Throws

If the JSON does not contain valid anchor and head positions

#### Overrides

[`Selection`](../../Selection/classes/Selection.md).[`fromJSON`](../../Selection/classes/Selection.md#fromjson)

---

### isNodeSelectable()

```ts
static isNodeSelectable(node): boolean;
```

Defined in: [state/src/selection/Selection.ts:384](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L384)

Determines whether the given node may be selected as a node selection.
A node is selectable if it's not a text node and its type specification
has not explicitly set `selectable` to false.

#### Parameters

| Parameter | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `node`    | `Node_2` | The node to check for selectability |

#### Returns

`boolean`

True if the node can be selected as a node selection, false otherwise

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`isNodeSelectable`](../../Selection/classes/Selection.md#isnodeselectable)

---

### jsonID()

```ts
static jsonID(jsonId, jsonDeserializerClass): void;
```

Defined in: [state/src/selection/Selection.ts:72](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L72)

#### Parameters

| Parameter               | Type                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| `jsonId`                | `string`                                                                                   |
| `jsonDeserializerClass` | [`JSONToSelectionDeserializer`](../../Selection/interfaces/JSONToSelectionDeserializer.md) |

#### Returns

`void`

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`jsonID`](../../Selection/classes/Selection.md#jsonid)

---

### near()

```ts
static near($pos, bias?): Selection;
```

Defined in: [state/src/selection/Selection.ts:303](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L303)

Find a valid cursor or leaf node selection near the given position.
Searches in the direction specified by `bias` first, then tries the
opposite direction if nothing is found. Falls back to an all-selection
if no valid position exists.

This is useful for finding a valid selection position after document
changes that may have invalidated the previous selection.

#### Parameters

| Parameter | Type          | Default value | Description                                                         |
| --------- | ------------- | ------------- | ------------------------------------------------------------------- |
| `$pos`    | `ResolvedPos` | `undefined`   | The resolved position to search from                                |
| `bias`    | `number`      | `1`           | The search direction bias: 1 for forward (default), -1 for backward |

#### Returns

[`Selection`](../../Selection/classes/Selection.md)

A valid selection near the given position, or an all-selection

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`near`](../../Selection/classes/Selection.md#near)

---

### registerAllSelectionHandler()

```ts
protected static registerAllSelectionHandler(handler): void;
```

Defined in: [state/src/selection/Selection.ts:68](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L68)

#### Parameters

| Parameter | Type                          |
| --------- | ----------------------------- |
| `handler` | (...`param`) => `PmSelection` |

#### Returns

`void`

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`registerAllSelectionHandler`](../../Selection/classes/Selection.md#registerallselectionhandler)

---

### registerJsonDeserializerClass()

```ts
static registerJsonDeserializerClass(jsonId, jsonDeserializerClass): void;
```

Defined in: [state/src/selection/Selection.ts:76](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L76)

#### Parameters

| Parameter               | Type                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| `jsonId`                | `string`                                                                                   |
| `jsonDeserializerClass` | [`JSONToSelectionDeserializer`](../../Selection/interfaces/JSONToSelectionDeserializer.md) |

#### Returns

`void`

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`registerJsonDeserializerClass`](../../Selection/classes/Selection.md#registerjsondeserializerclass)

---

### registerNodeSelectionHandler()

```ts
protected static registerNodeSelectionHandler(handler): void;
```

Defined in: [state/src/selection/Selection.ts:63](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L63)

#### Parameters

| Parameter | Type                          |
| --------- | ----------------------------- |
| `handler` | (...`param`) => `PmSelection` |

#### Returns

`void`

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`registerNodeSelectionHandler`](../../Selection/classes/Selection.md#registernodeselectionhandler)

---

### registerTextSelectionHandler()

```ts
protected static registerTextSelectionHandler(handler): void;
```

Defined in: [state/src/selection/Selection.ts:58](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L58)

#### Parameters

| Parameter | Type                          |
| --------- | ----------------------------- |
| `handler` | (...`param`) => `PmSelection` |

#### Returns

`void`

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`registerTextSelectionHandler`](../../Selection/classes/Selection.md#registertextselectionhandler)

---

### textSelectionBetween()

```ts
static textSelectionBetween(
   $anchor,
   $head,
   bias?): Selection;
```

Defined in: [state/src/selection/Selection.ts:432](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/selection/Selection.ts#L432)

Return a text selection that spans the given positions or, if
they aren't text positions, find a text selection near them.
`bias` determines whether the method searches forward (default)
or backwards (negative number) first. Will fall back to calling
`Selection.near` when the document doesn't contain a valid text position.

This method ensures that both anchor and head are positioned in inline
content, adjusting them if necessary while maintaining the intended
selection direction.

#### Parameters

| Parameter | Type          | Description                                                                 |
| --------- | ------------- | --------------------------------------------------------------------------- |
| `$anchor` | `ResolvedPos` | The desired anchor position (may be adjusted if not in inline content)      |
| `$head`   | `ResolvedPos` | The desired head position (may be adjusted if not in inline content)        |
| `bias?`   | `number`      | Optional search direction bias: positive for forward, negative for backward |

#### Returns

[`Selection`](../../Selection/classes/Selection.md)

A text selection between valid positions

#### Inherited from

[`Selection`](../../Selection/classes/Selection.md).[`textSelectionBetween`](../../Selection/classes/Selection.md#textselectionbetween)

[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/gapcursor](../../README.md) / [GapCursor](../README.md) / GapCursor

# Class: GapCursor

Defined in: [gapcursor/src/GapCursor.ts:51](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/gapcursor/src/GapCursor.ts#L51)

Represents a gap cursor selection - a cursor positioned between block nodes
where regular text selection is not possible.

Gap cursors are used in positions where the document structure doesn't allow
normal text cursors, such as between two adjacent block nodes (e.g., between
two code blocks or between a heading and an image).

Both `$anchor` and `$head` properties point at the same cursor position since
gap cursors don't represent a range but a single point between nodes.

## Example

```ts
// A gap cursor between two paragraphs:
// <p>First paragraph</p>
// [gap cursor here]
// <p>Second paragraph</p>
```

## Extends

- `Selection_2`

## Implements

- `PmSelection`

## Constructors

### Constructor

```ts
new GapCursor($pos): GapCursor;
```

Defined in: [gapcursor/src/GapCursor.ts:61](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/gapcursor/src/GapCursor.ts#L61)

Creates a new gap cursor at the given position.

#### Parameters

| Parameter | Type          | Description                                                                                                     |
| --------- | ------------- | --------------------------------------------------------------------------------------------------------------- |
| `$pos`    | `ResolvedPos` | The resolved position where the gap cursor should be placed. Both anchor and head will be set to this position. |

#### Returns

`GapCursor`

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

Defined in: [gapcursor/src/GapCursor.ts:66](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/gapcursor/src/GapCursor.ts#L66)

##### Returns

`string`

#### Implementation of

```ts
PmSelection.type;
```

#### Overrides

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

Defined in: [gapcursor/src/GapCursor.ts:544](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/gapcursor/src/GapCursor.ts#L544)

Returns the content covered by this selection.

Gap cursors don't contain any content since they represent a position
between nodes rather than a selection of content.

#### Returns

`Slice`

An empty slice.

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

Defined in: [gapcursor/src/GapCursor.ts:556](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/gapcursor/src/GapCursor.ts#L556)

Tests whether this gap cursor is equal to another selection.

Two gap cursors are equal if they're both gap cursors at the same position.

#### Parameters

| Parameter | Type          | Description                    |
| --------- | ------------- | ------------------------------ |
| `other`   | `PmSelection` | The selection to compare with. |

#### Returns

`boolean`

True if both selections are gap cursors at the same position, false otherwise.

#### Implementation of

```ts
PmSelection.eq;
```

#### Overrides

```ts
Selection.eq;
```

---

### getBookmark()

```ts
getBookmark(): SelectionBookmark;
```

Defined in: [gapcursor/src/GapCursor.ts:580](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/gapcursor/src/GapCursor.ts#L580)

Creates a bookmark for this gap cursor.

Bookmarks can be used to preserve cursor positions across document transformations.
They're more lightweight than selections and can be efficiently mapped through changes.

#### Returns

`SelectionBookmark`

A GapBookmark that can recreate this gap cursor after document changes.

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
map(doc, mapping): Selection_2;
```

Defined in: [gapcursor/src/GapCursor.ts:531](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/gapcursor/src/GapCursor.ts#L531)

Maps this gap cursor through a document transformation.

When the document is transformed (e.g., by insertions or deletions), this method
updates the gap cursor position to reflect the changes. If the mapped position is
no longer valid for a gap cursor, it returns the nearest valid selection instead.

#### Parameters

| Parameter | Type       | Description                                       |
| --------- | ---------- | ------------------------------------------------- |
| `doc`     | `Node_2`   | The document after the transformation.            |
| `mapping` | `Mappable` | The mapping object describing the transformation. |

#### Returns

`Selection_2`

A new selection at the mapped position (gap cursor if valid, or nearest selection).

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
replace(): void;
```

Defined in: [gapcursor/src/GapCursor.ts:595](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/gapcursor/src/GapCursor.ts#L595)

Replaces the content covered by this selection.

Gap cursors represent a position between nodes rather than a content selection,
so this method is a no-op. To insert content at a gap cursor position, use
the transaction's `insert` method at the cursor's position instead.

#### Returns

`void`

#### Example

```ts
// To insert content at a gap cursor:
// tr.insert(gapCursor.from, newNode);
```

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
replaceWith(): void;
```

Defined in: [gapcursor/src/GapCursor.ts:610](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/gapcursor/src/GapCursor.ts#L610)

Replaces the selection with a node.

Gap cursors represent a position between nodes rather than a content selection,
so this method is a no-op. To insert a node at a gap cursor position, use
the transaction's `insert` method at the cursor's position instead.

#### Returns

`void`

#### Example

```ts
// To insert a node at a gap cursor:
// tr.insert(gapCursor.from, nodeToInsert);
```

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
toJSON(): SelectionJSON;
```

Defined in: [gapcursor/src/GapCursor.ts:568](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/gapcursor/src/GapCursor.ts#L568)

Serializes this gap cursor to a JSON representation.

The JSON format includes the type identifier and the cursor position,
which can be used to recreate the gap cursor later via fromJSON.

#### Returns

`SelectionJSON`

A JSON object representing this gap cursor.

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

### findGapCursorFrom()

```ts
static findGapCursorFrom(
   $pos,
   dir,
   mustMove?): ResolvedPos;
```

Defined in: [gapcursor/src/GapCursor.ts:139](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/gapcursor/src/GapCursor.ts#L139)

Searches for a valid gap cursor position starting from the given position.

This method performs a depth-first search through the document tree to find
the nearest valid gap cursor position in the specified direction. It first
scans up through ancestor nodes, then down into sibling nodes, checking each
position for gap cursor validity.

The algorithm works in two phases:

1. **Scan up**: Traverse up the tree to find a sibling node, checking positions along the way
2. **Scan down**: Traverse down into the sibling node to find valid gap positions

#### Parameters

| Parameter  | Type          | Default value | Description                                                                                 |
| ---------- | ------------- | ------------- | ------------------------------------------------------------------------------------------- |
| `$pos`     | `ResolvedPos` | `undefined`   | The starting resolved position for the search.                                              |
| `dir`      | `number`      | `undefined`   | The search direction: positive values move forward, negative values move backward.          |
| `mustMove` | `boolean`     | `false`       | If true, the search will not return the starting position even if valid. Defaults to false. |

#### Returns

`ResolvedPos`

The resolved position of a valid gap cursor, or null if none is found.

#### Example

```ts
// Find the next gap cursor position moving forward
const nextGap = GapCursor.findGapCursorFrom($currentPos, 1, true);
```

---

### fromJSON()

```ts
static fromJSON(doc, json): GapCursor;
```

Defined in: [gapcursor/src/GapCursor.ts:78](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/gapcursor/src/GapCursor.ts#L78)

Deserializes a gap cursor from its JSON representation.

#### Parameters

| Parameter | Type            | Description                                             |
| --------- | --------------- | ------------------------------------------------------- |
| `doc`     | `Node_2`        | The document to resolve the position in.                |
| `json`    | `SelectionJSON` | The serialized gap cursor data containing the position. |

#### Returns

`GapCursor`

A new GapCursor instance at the deserialized position.

#### Throws

If the JSON doesn't contain a valid numeric position.

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

---

### valid()

```ts
static valid($pos): boolean;
```

Defined in: [gapcursor/src/GapCursor.ts:97](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/gapcursor/src/GapCursor.ts#L97)

Checks whether a gap cursor is valid at the given position.

A gap cursor is valid when:

1. The parent is not a text block (gap cursors can't exist within text)
2. There's a "closed" node before the position (block or atom node)
3. There's a "closed" node after the position (block or atom node)
4. The parent allows gap cursors (via allowGapCursor spec or default content type)

#### Parameters

| Parameter | Type          | Description                     |
| --------- | ------------- | ------------------------------- |
| `$pos`    | `ResolvedPos` | The resolved position to check. |

#### Returns

`boolean`

True if a gap cursor can be placed at this position, false otherwise.

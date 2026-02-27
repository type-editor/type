[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/state](../../../README.md) / [selection/Selection](../README.md) / Selection

# Class: Selection

Defined in: [state/src/selection/Selection.ts:46](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L46)

Superclass for editor selections. Every selection type should
extend this. Should not be instantiated directly.

This abstract class provides the foundation for all selection types in the editor,
including text selections, node selections, and all-document selections.
It manages the selection's anchor, head, and ranges, along with methods to
query and manipulate the selection state.

Note: made this class non-abstract due to issues with the compat module.

## Extended by

- [`AllSelection`](../../AllSelection/classes/AllSelection.md)
- [`NodeSelection`](../../NodeSelection/classes/NodeSelection.md)
- [`TextSelection`](../../TextSelection/classes/TextSelection.md)

## Implements

- `PmSelection`

## Constructors

### Constructor

```ts
new Selection(
   $anchor,
   $head,
   ranges?): Selection;
```

Defined in: [state/src/selection/Selection.ts:120](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L120)

Initialize a selection with the head and anchor and ranges. If no
ranges are given, constructs a single range across `$anchor` and
`$head`.

#### Parameters

| Parameter | Type                          | Description                                                                                                                      |
| --------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `$anchor` | `ResolvedPos`                 | The resolved anchor of the selection (the side that stays in place when the selection is modified).                              |
| `$head`   | `ResolvedPos`                 | The resolved head of the selection (the side that moves when the selection is modified).                                         |
| `ranges?` | readonly `PmSelectionRange`[] | Optional array of selection ranges. If not provided, a single range spanning from min to max of anchor and head will be created. |

#### Returns

`Selection`

## Properties

| Property                                                | Modifier    | Type                          | Default value | Description                                                                                                                      | Defined in                                                                                                                                                               |
| ------------------------------------------------------- | ----------- | ----------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="property-anchorpos"></a> `anchorPos`             | `readonly`  | `ResolvedPos`                 | `undefined`   | The resolved position of the selection's anchor (the immobile end).                                                              | [state/src/selection/Selection.ts:92](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L92)   |
| <a id="property-headpos"></a> `headPos`                 | `readonly`  | `ResolvedPos`                 | `undefined`   | The resolved position of the selection's head (the mobile end).                                                                  | [state/src/selection/Selection.ts:98](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L98)   |
| <a id="property-isvisible"></a> `isVisible`             | `protected` | `boolean`                     | `true`        | Controls whether the selection should be visible in the browser. Some selection types (like node selections) may be invisible.   | [state/src/selection/Selection.ts:105](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L105) |
| <a id="property-selectionranges"></a> `selectionRanges` | `readonly`  | readonly `PmSelectionRange`[] | `undefined`   | The array of selection ranges covered by this selection. Most selections have a single range, but some may span multiple ranges. | [state/src/selection/Selection.ts:86](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L86)   |

## Accessors

### $anchor

#### Get Signature

```ts
get $anchor(): ResolvedPos;
```

Defined in: [state/src/selection/Selection.ts:167](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L167)

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

---

### $cursor

#### Get Signature

```ts
get $cursor(): ResolvedPos;
```

Defined in: [state/src/selection/Selection.ts:138](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L138)

The cursor position if this is an empty text selection, null otherwise

##### Returns

`ResolvedPos`

#### Implementation of

```ts
PmSelection.$cursor;
```

---

### $from

#### Get Signature

```ts
get $from(): ResolvedPos;
```

Defined in: [state/src/selection/Selection.ts:234](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L234)

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

---

### $head

#### Get Signature

```ts
get $head(): ResolvedPos;
```

Defined in: [state/src/selection/Selection.ts:178](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L178)

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

---

### $to

#### Get Signature

```ts
get $to(): ResolvedPos;
```

Defined in: [state/src/selection/Selection.ts:249](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L249)

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

---

### anchor

#### Get Signature

```ts
get anchor(): number;
```

Defined in: [state/src/selection/Selection.ts:189](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L189)

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

---

### empty

#### Get Signature

```ts
get empty(): boolean;
```

Defined in: [state/src/selection/Selection.ts:263](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L263)

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

---

### from

#### Get Signature

```ts
get from(): number;
```

Defined in: [state/src/selection/Selection.ts:211](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L211)

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

---

### head

#### Get Signature

```ts
get head(): number;
```

Defined in: [state/src/selection/Selection.ts:200](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L200)

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

---

### node

#### Get Signature

```ts
get node(): Node_2;
```

Defined in: [state/src/selection/Selection.ts:145](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L145)

The selected node if this is a node selection, null otherwise

##### Returns

`Node_2`

#### Implementation of

```ts
PmSelection.node;
```

---

### ranges

#### Get Signature

```ts
get ranges(): readonly SelectionRange[];
```

Defined in: [state/src/selection/Selection.ts:156](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L156)

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

---

### to

#### Get Signature

```ts
get to(): number;
```

Defined in: [state/src/selection/Selection.ts:222](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L222)

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

---

### type

#### Get Signature

```ts
get type(): string;
```

Defined in: [state/src/selection/Selection.ts:131](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L131)

The type identifier for this selection.

##### Returns

`string`

Always returns SelectionType.ALL

#### Implementation of

```ts
PmSelection.type;
```

---

### visible

#### Get Signature

```ts
get visible(): boolean;
```

Defined in: [state/src/selection/Selection.ts:274](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L274)

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

Defined in: [state/src/selection/Selection.ts:283](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L283)

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

## Methods

### content()

```ts
content(): Slice;
```

Defined in: [state/src/selection/Selection.ts:601](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L601)

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

---

### eq()

```ts
eq(_selection): boolean;
```

Defined in: [state/src/selection/Selection.ts:612](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L612)

Test whether this selection is equal to another selection.
Selections are equal if they have the same type and positions.

#### Parameters

| Parameter    | Type          | Description                   |
| ------------ | ------------- | ----------------------------- |
| `_selection` | `PmSelection` | The selection to compare with |

#### Returns

`boolean`

True if the selections are equal, false otherwise

#### Implementation of

```ts
PmSelection.eq;
```

---

### getBookmark()

```ts
getBookmark(): SelectionBookmark;
```

Defined in: [state/src/selection/Selection.ts:623](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L623)

Create a bookmark for this selection.
The bookmark stores the selection's position information and can be used
to restore the selection after document changes by mapping through those changes.

#### Returns

`SelectionBookmark`

A bookmark that can recreate this selection

#### Implementation of

```ts
PmSelection.getBookmark;
```

---

### isAllSelection()

```ts
isAllSelection(): boolean;
```

Defined in: [state/src/selection/Selection.ts:590](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L590)

Check if this is an all selection.

#### Returns

`boolean`

True if this is an AllSelection instance

#### Implementation of

```ts
PmSelection.isAllSelection;
```

---

### isNodeSelection()

```ts
isNodeSelection(): boolean;
```

Defined in: [state/src/selection/Selection.ts:581](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L581)

Check if this is a node selection.

#### Returns

`boolean`

True if this is a NodeSelection instance

#### Implementation of

```ts
PmSelection.isNodeSelection;
```

---

### isTextSelection()

```ts
isTextSelection(): boolean;
```

Defined in: [state/src/selection/Selection.ts:572](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L572)

Check if this is a text selection.

#### Returns

`boolean`

True if this is a TextSelection instance

#### Implementation of

```ts
PmSelection.isTextSelection;
```

---

### map()

```ts
map(doc, mapping): Selection;
```

Defined in: [state/src/selection/Selection.ts:640](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L640)

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

`Selection`

A new selection mapped to the new document

#### Implementation of

```ts
PmSelection.map;
```

---

### replace()

```ts
replace(transaction, content?): void;
```

Defined in: [state/src/selection/Selection.ts:672](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L672)

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

---

### replaceWith()

```ts
replaceWith(transaction, node): void;
```

Defined in: [state/src/selection/Selection.ts:754](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L754)

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

---

### toJSON()

```ts
toJSON(): SelectionJSON;
```

Defined in: [state/src/selection/Selection.ts:779](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L779)

Convert this selection to a JSON-serializable representation.
The JSON includes the selection type and position information.

#### Returns

`SelectionJSON`

A JSON object representing this selection

#### Implementation of

```ts
PmSelection.toJSON;
```

---

### atEnd()

```ts
static atEnd(doc): Selection;
```

Defined in: [state/src/selection/Selection.ts:335](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L335)

Find the cursor or leaf node selection closest to the end of the
given document. Will return an AllSelection if no valid position
exists.

This is commonly used to position the cursor at the end of a document.

#### Parameters

| Parameter | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `doc`     | `Node_2` | The document node to find a selection in |

#### Returns

`Selection`

A selection at the end of the document

---

### atStart()

```ts
static atStart(doc): Selection;
```

Defined in: [state/src/selection/Selection.ts:320](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L320)

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

`Selection`

A selection at the start of the document

---

### between()

```ts
static between(
   $anchor,
   $head,
   bias?): Selection;
```

Defined in: [state/src/selection/Selection.ts:412](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L412)

#### Parameters

| Parameter | Type          |
| --------- | ------------- |
| `$anchor` | `ResolvedPos` |
| `$head`   | `ResolvedPos` |
| `bias?`   | `number`      |

#### Returns

`Selection`

---

### findFrom()

```ts
static findFrom(
   $pos,
   dir,
   textOnly?): Selection;
```

Defined in: [state/src/selection/Selection.ts:354](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L354)

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

`Selection`

A valid selection, or null if none found

---

### fromJSON()

```ts
static fromJSON(doc, json): Selection;
```

Defined in: [state/src/selection/Selection.ts:398](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L398)

Deserialize the JSON representation of a selection.
This factory method delegates to the appropriate selection type's
fromJSON method based on the type field in the JSON.

#### Parameters

| Parameter | Type            | Description                                                           |
| --------- | --------------- | --------------------------------------------------------------------- |
| `doc`     | `Node_2`        | The document node in which to create the selection                    |
| `json`    | `SelectionJSON` | The JSON representation of the selection, must include a 'type' field |

#### Returns

`Selection`

A new EditorSelection instance of the appropriate type

#### Throws

If the JSON is invalid or contains an unknown selection type

---

### isNodeSelectable()

```ts
static isNodeSelectable(node): boolean;
```

Defined in: [state/src/selection/Selection.ts:384](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L384)

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

---

### jsonID()

```ts
static jsonID(jsonId, jsonDeserializerClass): void;
```

Defined in: [state/src/selection/Selection.ts:72](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L72)

#### Parameters

| Parameter               | Type                                                                          |
| ----------------------- | ----------------------------------------------------------------------------- |
| `jsonId`                | `string`                                                                      |
| `jsonDeserializerClass` | [`JSONToSelectionDeserializer`](../interfaces/JSONToSelectionDeserializer.md) |

#### Returns

`void`

---

### near()

```ts
static near($pos, bias?): Selection;
```

Defined in: [state/src/selection/Selection.ts:303](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L303)

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

`Selection`

A valid selection near the given position, or an all-selection

---

### registerAllSelectionHandler()

```ts
protected static registerAllSelectionHandler(handler): void;
```

Defined in: [state/src/selection/Selection.ts:68](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L68)

#### Parameters

| Parameter | Type                          |
| --------- | ----------------------------- |
| `handler` | (...`param`) => `PmSelection` |

#### Returns

`void`

---

### registerJsonDeserializerClass()

```ts
static registerJsonDeserializerClass(jsonId, jsonDeserializerClass): void;
```

Defined in: [state/src/selection/Selection.ts:76](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L76)

#### Parameters

| Parameter               | Type                                                                          |
| ----------------------- | ----------------------------------------------------------------------------- |
| `jsonId`                | `string`                                                                      |
| `jsonDeserializerClass` | [`JSONToSelectionDeserializer`](../interfaces/JSONToSelectionDeserializer.md) |

#### Returns

`void`

---

### registerNodeSelectionHandler()

```ts
protected static registerNodeSelectionHandler(handler): void;
```

Defined in: [state/src/selection/Selection.ts:63](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L63)

#### Parameters

| Parameter | Type                          |
| --------- | ----------------------------- |
| `handler` | (...`param`) => `PmSelection` |

#### Returns

`void`

---

### registerTextSelectionHandler()

```ts
protected static registerTextSelectionHandler(handler): void;
```

Defined in: [state/src/selection/Selection.ts:58](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L58)

#### Parameters

| Parameter | Type                          |
| --------- | ----------------------------- |
| `handler` | (...`param`) => `PmSelection` |

#### Returns

`void`

---

### textSelectionBetween()

```ts
static textSelectionBetween(
   $anchor,
   $head,
   bias?): Selection;
```

Defined in: [state/src/selection/Selection.ts:432](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L432)

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

`Selection`

A text selection between valid positions

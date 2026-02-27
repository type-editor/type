[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/view/view-desc/PmViewDesc](../README.md) / PmViewDesc

# Interface: PmViewDesc

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:11](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L11)

## Extended by

- [`PmNodeViewDesc`](../../PmNodeViewDesc/interfaces/PmNodeViewDesc.md)

## Properties

| Property                                                      | Modifier   | Type                                                                                  | Defined in                                                                                                                                                                                                            |
| ------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-border"></a> `border`                         | `readonly` | `number`                                                                              | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:27](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L27) |
| <a id="property-children"></a> `children`                     | `public`   | `PmViewDesc`[]                                                                        | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:15](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L15) |
| <a id="property-contentdom"></a> `contentDOM`                 | `readonly` | `HTMLElement`                                                                         | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:17](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L17) |
| <a id="property-contentlost"></a> `contentLost`               | `readonly` | `boolean`                                                                             | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:21](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L21) |
| <a id="property-dirty"></a> `dirty`                           | `public`   | [`ViewDirtyState`](../../../../../view/ViewDirtyState/enumerations/ViewDirtyState.md) | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:12](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L12) |
| <a id="property-dom"></a> `dom`                               | `readonly` | `Node`                                                                                | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:16](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L16) |
| <a id="property-domatom"></a> `domAtom`                       | `readonly` | `boolean`                                                                             | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:18](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L18) |
| <a id="property-ignoreforcoords"></a> `ignoreForCoords`       | `readonly` | `boolean`                                                                             | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:19](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L19) |
| <a id="property-ignoreforselection"></a> `ignoreForSelection` | `readonly` | `boolean`                                                                             | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:20](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L20) |
| <a id="property-node"></a> `node`                             | `readonly` | `Node_2`                                                                              | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:13](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L13) |
| <a id="property-nodedom"></a> `nodeDOM`                       | `readonly` | `Node`                                                                                | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:29](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L29) |
| <a id="property-parent"></a> `parent`                         | `public`   | `PmViewDesc`                                                                          | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:14](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L14) |
| <a id="property-posafter"></a> `posAfter`                     | `readonly` | `number`                                                                              | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:24](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L24) |
| <a id="property-posatend"></a> `posAtEnd`                     | `readonly` | `number`                                                                              | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:25](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L25) |
| <a id="property-posatstart"></a> `posAtStart`                 | `readonly` | `number`                                                                              | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:23](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L23) |
| <a id="property-posbefore"></a> `posBefore`                   | `readonly` | `number`                                                                              | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:22](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L22) |
| <a id="property-side"></a> `side`                             | `readonly` | `number`                                                                              | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:28](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L28) |
| <a id="property-size"></a> `size`                             | `readonly` | `number`                                                                              | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:26](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L26) |

## Methods

### descAt()

```ts
descAt(pos): PmViewDesc;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:137](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L137)

Find the desc for the node after the given pos, if any. (When a
parent node overrode rendering, there might not be one.)

#### Parameters

| Parameter | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `pos`     | `number` | The document position to search for |

#### Returns

`PmViewDesc`

The view description at that position, or undefined

---

### destroy()

```ts
destroy(): void;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:88](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L88)

Destroys this view description and all its children, cleaning up references.

This method ensures proper cleanup even if exceptions occur during child destruction.

#### Returns

`void`

---

### domAfterPos()

```ts
domAfterPos(pos): Node;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:186](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L186)

Gets the DOM node immediately after a given document position.

#### Parameters

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `pos`     | `number` | The document position |

#### Returns

`Node`

The DOM node after the position

#### Throws

RangeError if there's no node after the position

---

### domFromPos()

```ts
domFromPos(pos, side): {
  atom?: number;
  node: Node;
  offset: number;
};
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:152](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L152)

Converts a document position to a DOM position.

The algorithm:

1. For leaf nodes: return the DOM node itself with atom marker
2. For container nodes: find which child contains the position
3. If inside a child: recurse into that child
4. If at boundary: adjust for zero-width widgets and find DOM position

#### Parameters

| Parameter | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| `pos`     | `number` | The document position (relative to this view's start)          |
| `side`    | `number` | Direction to favor (-1 for before, 0 for neutral, 1 for after) |

#### Returns

```ts
{
  atom?: number;
  node: Node;
  offset: number;
}
```

Object containing the DOM node, offset, and optionally an atom marker

| Name     | Type     | Defined in                                                                                                                                                                                                              |
| -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `atom?`  | `number` | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:153](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L153) |
| `node`   | `Node`   | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:153](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L153) |
| `offset` | `number` | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:153](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L153) |

---

### emptyChildAt()

```ts
emptyChildAt(side): boolean;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:177](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L177)

Checks if there's an empty child at the start or end of this view.

#### Parameters

| Parameter | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `side`    | `number` | Direction to check (-1 for start, 1 for end) |

#### Returns

`boolean`

True if there's an empty child at the specified side

---

### getDesc()

```ts
getDesc(dom): PmViewDesc;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:118](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L118)

Gets a view description from a DOM node if it's a descendant of this description.

#### Parameters

| Parameter | Type   | Description           |
| --------- | ------ | --------------------- |
| `dom`     | `Node` | The DOM node to check |

#### Returns

`PmViewDesc`

The view description if it's a descendant, undefined otherwise

---

### getType()

```ts
getType(): ViewDescType;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:31](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L31)

#### Returns

[`ViewDescType`](../../../../../view/ViewDescType/enumerations/ViewDescType.md)

---

### ignoreMutation()

```ts
ignoreMutation(mutation): boolean;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:214](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L214)

Determines if a mutation can be safely ignored.

#### Parameters

| Parameter  | Type                                                                                | Description                  |
| ---------- | ----------------------------------------------------------------------------------- | ---------------------------- |
| `mutation` | [`ViewMutationRecord`](../../ViewMutationRecord/type-aliases/ViewMutationRecord.md) | The mutation record to check |

#### Returns

`boolean`

True if the mutation can be ignored, false if it needs processing

---

### isText()

```ts
isText(_text): boolean;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:235](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L235)

Checks if this view represents text with a specific content.

#### Parameters

| Parameter | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `_text`   | `string` | The text content to check against |

#### Returns

`boolean`

True if this is a text view with the given content

---

### localPosFromDOM()

```ts
localPosFromDOM(
   dom,
   offset,
   bias): number;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:110](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L110)

Converts a DOM position within this view to a document position.

Uses two strategies:

1. If position is inside contentDOM: scans through children to find nearest view desc
2. If position is outside contentDOM: uses heuristics based on DOM structure

#### Parameters

| Parameter | Type     | Description                                                         |
| --------- | -------- | ------------------------------------------------------------------- |
| `dom`     | `Node`   | The DOM node where the position is                                  |
| `offset`  | `number` | The offset within the DOM node                                      |
| `bias`    | `number` | Direction bias for ambiguous positions (-1 for before, 1 for after) |

#### Returns

`number`

The document position corresponding to the DOM position

---

### markDirty()

```ts
markDirty(from, to): void;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:227](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L227)

Marks a subtree that has been touched by a DOM change for redrawing.

The algorithm walks through children to find which ones overlap with
the dirty range, then either:

- Recursively marks the child if range is fully contained
- Marks the child for full recreation if range partially overlaps

#### Parameters

| Parameter | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `from`    | `number` | Start position of the dirty range |
| `to`      | `number` | End position of the dirty range   |

#### Returns

`void`

---

### markParentsDirty()

```ts
markParentsDirty(): void;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:241](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L241)

Marks this description and its parents as dirty, propagating the dirty state up the tree.
Sets the dirty level to CONTENT_DIRTY for the immediate parent and CHILD_DIRTY for ancestors.

#### Returns

`void`

---

### matchesHack()

```ts
matchesHack(_nodeName): boolean;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:65](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L65)

Checks if this description matches a hack node with a specific name.

#### Parameters

| Parameter   | Type     | Description                    |
| ----------- | -------- | ------------------------------ |
| `_nodeName` | `string` | The node name to check against |

#### Returns

`boolean`

True if this is a hack node with the given name

---

### matchesMark()

```ts
matchesMark(_mark): boolean;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:47](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L47)

Checks if this description matches a given mark.

#### Parameters

| Parameter | Type   | Description               |
| --------- | ------ | ------------------------- |
| `_mark`   | `Mark` | The mark to check against |

#### Returns

`boolean`

True if this description represents the given mark

---

### matchesNode()

```ts
matchesNode(
   _node,
   _outerDeco,
   _innerDeco): boolean;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:57](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L57)

Checks if this description matches a given node with decorations.

#### Parameters

| Parameter    | Type                                                                                      | Description                          |
| ------------ | ----------------------------------------------------------------------------------------- | ------------------------------------ |
| `_node`      | `Node_2`                                                                                  | The node to check against            |
| `_outerDeco` | readonly [`PmDecoration`](../../../decoration/PmDecoration/interfaces/PmDecoration.md)[]  | The outer decorations to check       |
| `_innerDeco` | [`DecorationSource`](../../../decoration/DecorationSource/interfaces/DecorationSource.md) | The inner decoration source to check |

#### Returns

`boolean`

True if this description represents the given node with matching decorations

---

### matchesWidget()

```ts
matchesWidget(_widget): boolean;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:39](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L39)

Checks if this description matches a given widget decoration.

#### Parameters

| Parameter | Type                                                                          | Description                            |
| --------- | ----------------------------------------------------------------------------- | -------------------------------------- |
| `_widget` | [`PmDecoration`](../../../decoration/PmDecoration/interfaces/PmDecoration.md) | The widget decoration to check against |

#### Returns

`boolean`

True if this description represents the given widget

---

### parseRange()

```ts
parseRange(
   from,
   to,
   base?): {
  from: number;
  fromOffset: number;
  node: Node;
  to: number;
  toOffset: number;
};
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:167](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L167)

Finds a DOM range in a single parent for a given changed range.

This method maps document positions to DOM child indices, which is needed
for parsing changed content. It tries to optimize by recursing into a single
child when the entire range fits inside it.

#### Parameters

| Parameter | Type     | Description                                        |
| --------- | -------- | -------------------------------------------------- |
| `from`    | `number` | Start position of the range                        |
| `to`      | `number` | End position of the range                          |
| `base?`   | `number` | Base offset for position calculations (default: 0) |

#### Returns

```ts
{
  from: number;
  fromOffset: number;
  node: Node;
  to: number;
  toOffset: number;
}
```

Object containing the DOM node and offsets for the range

| Name         | Type     | Defined in                                                                                                                                                                                                              |
| ------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`       | `number` | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:169](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L169) |
| `fromOffset` | `number` | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:169](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L169) |
| `node`       | `Node`   | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:169](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L169) |
| `to`         | `number` | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:169](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L169) |
| `toOffset`   | `number` | [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:169](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L169) |

---

### parseRule()

```ts
parseRule(): Omit<TagParseRule, "tag">;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:72](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L72)

When parsing in-editor content (in domchange.js), we allow
descriptions to determine the parse rules that should be used to
parse them.

#### Returns

`Omit`&lt;`TagParseRule`, `"tag"`&gt;

---

### posBeforeChild()

```ts
posBeforeChild(child): number;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:96](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L96)

Calculates the document position just before a given child view.

#### Parameters

| Parameter | Type         | Description              |
| --------- | ------------ | ------------------------ |
| `child`   | `PmViewDesc` | The child view to locate |

#### Returns

`number`

The document position before the child

---

### posFromDOM()

```ts
posFromDOM(
   dom,
   offset,
   bias): number;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:128](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L128)

Converts a DOM position to a document position.

#### Parameters

| Parameter | Type     | Description                            |
| --------- | -------- | -------------------------------------- |
| `dom`     | `Node`   | The DOM node containing the position   |
| `offset`  | `number` | The offset within the DOM node         |
| `bias`    | `number` | Direction bias for ambiguous positions |

#### Returns

`number`

The document position, or -1 if not found

---

### setSelection()

```ts
setSelection(
   anchor,
   head,
   view,
   force?): void;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:203](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L203)

Sets a selection within this view description or delegates to a child.

View descs are responsible for setting selections that fall entirely inside them,
allowing custom node views to implement specialized selection behavior.

Strategy:

1. If selection is entirely within a child → delegate to that child
2. Otherwise → convert positions to DOM and apply selection

#### Parameters

| Parameter | Type                                                               | Description                                                        |
| --------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `anchor`  | `number`                                                           | The anchor position of the selection                               |
| `head`    | `number`                                                           | The head position of the selection                                 |
| `view`    | [`PmEditorView`](../../../PmEditorView/interfaces/PmEditorView.md) | The editor view                                                    |
| `force?`  | `boolean`                                                          | Whether to force the selection update even if it appears unchanged |

#### Returns

`void`

---

### stopEvent()

```ts
stopEvent(_event): boolean;
```

Defined in: [packages/editor-types/src/types/view/view-desc/PmViewDesc.ts:81](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/PmViewDesc.ts#L81)

Used by the editor's event handler to ignore events that come
from certain descs.

#### Parameters

| Parameter | Type    | Description            |
| --------- | ------- | ---------------------- |
| `_event`  | `Event` | The DOM event to check |

#### Returns

`boolean`

True if the event should be stopped/ignored

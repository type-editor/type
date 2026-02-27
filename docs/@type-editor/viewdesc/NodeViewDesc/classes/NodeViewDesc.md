[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/viewdesc](../../README.md) / [NodeViewDesc](../README.md) / NodeViewDesc

# Class: NodeViewDesc

Defined in: [NodeViewDesc.ts:18](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L18)

Node view descs are the main, most common type of view desc, and
correspond to an actual node in the document. Unlike mark descs,
they populate their child array themselves.

## Extends

- [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)

## Extended by

- [`CustomNodeViewDesc`](../../CustomNodeViewDesc/classes/CustomNodeViewDesc.md)
- [`TextViewDesc`](../../TextViewDesc/classes/TextViewDesc.md)

## Implements

- `PmNodeViewDesc`

## Constructors

### Constructor

```ts
new NodeViewDesc(
   parent,
   node,
   outerDeco,
   innerDeco,
   dom,
   contentDOM,
   nodeDOM): NodeViewDesc;
```

Defined in: [NodeViewDesc.ts:35](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L35)

Creates a new NodeViewDesc.

#### Parameters

| Parameter    | Type                                             | Description                               |
| ------------ | ------------------------------------------------ | ----------------------------------------- |
| `parent`     | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md) | The parent view description               |
| `node`       | `Node_2`                                         | The ProseMirror node this represents      |
| `outerDeco`  | readonly `PmDecoration`[]                        | Decorations wrapping this node            |
| `innerDeco`  | `DecorationSource`                               | Decorations inside this node              |
| `dom`        | `Node`                                           | The outer DOM node                        |
| `contentDOM` | `HTMLElement`                                    | The DOM node that holds content           |
| `nodeDOM`    | `Node`                                           | The DOM node representing the actual node |

#### Returns

`NodeViewDesc`

#### Overrides

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`constructor`](../../ViewDesc/classes/ViewDesc.md#constructor)

## Properties

| Property                                        | Modifier    | Type                                                                    | Default value              | Inherited from                                                                                                            | Defined in                                                                                                                                                  |
| ----------------------------------------------- | ----------- | ----------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-_children"></a> `_children`     | `protected` | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)[]                      | `undefined`                | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`_children`](../../ViewDesc/classes/ViewDesc.md#property-_children)     | [ViewDesc.ts:28](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L28)         |
| <a id="property-_contentdom"></a> `_contentDOM` | `readonly`  | `HTMLElement`                                                           | `undefined`                | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`_contentDOM`](../../ViewDesc/classes/ViewDesc.md#property-_contentdom) | [ViewDesc.ts:24](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L24)         |
| <a id="property-_dirty"></a> `_dirty`           | `protected` | [`ViewDirtyState`](../../ViewDirtyState/enumerations/ViewDirtyState.md) | `ViewDirtyState.NOT_DIRTY` | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`_dirty`](../../ViewDesc/classes/ViewDesc.md#property-_dirty)           | [ViewDesc.ts:25](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L25)         |
| <a id="property-_dom"></a> `_dom`               | `protected` | `Node`                                                                  | `undefined`                | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`_dom`](../../ViewDesc/classes/ViewDesc.md#property-_dom)               | [ViewDesc.ts:29](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L29)         |
| <a id="property-_innerdeco"></a> `_innerDeco`   | `protected` | `DecorationSource`                                                      | `null`                     | -                                                                                                                         | [NodeViewDesc.ts:22](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L22) |
| <a id="property-_node"></a> `_node`             | `protected` | `Node_2`                                                                | `undefined`                | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`_node`](../../ViewDesc/classes/ViewDesc.md#property-_node)             | [ViewDesc.ts:26](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L26)         |
| <a id="property-_nodedom"></a> `_nodeDOM`       | `readonly`  | `Node`                                                                  | `undefined`                | -                                                                                                                         | [NodeViewDesc.ts:20](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L20) |
| <a id="property-_outerdeco"></a> `_outerDeco`   | `protected` | readonly `PmDecoration`[]                                               | `null`                     | -                                                                                                                         | [NodeViewDesc.ts:21](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L21) |
| <a id="property-_parent"></a> `_parent`         | `protected` | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)                        | `undefined`                | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`_parent`](../../ViewDesc/classes/ViewDesc.md#property-_parent)         | [ViewDesc.ts:27](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L27)         |

## Accessors

### border

#### Get Signature

```ts
get border(): number;
```

Defined in: [NodeViewDesc.ts:77](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L77)

For block nodes, this represents the space taken up by their
start/end tokens.

##### Returns

`number`

#### Implementation of

```ts
PmNodeViewDesc.border;
```

#### Overrides

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`border`](../../ViewDesc/classes/ViewDesc.md#border)

---

### children

#### Get Signature

```ts
get children(): ViewDesc[];
```

Defined in: [ViewDesc.ts:88](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L88)

The child view descriptions of this view.

##### Returns

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)[]

#### Set Signature

```ts
set children(children): void;
```

Defined in: [ViewDesc.ts:92](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L92)

##### Parameters

| Parameter  | Type                                               |
| ---------- | -------------------------------------------------- |
| `children` | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)[] |

##### Returns

`void`

#### Implementation of

```ts
PmNodeViewDesc.children;
```

#### Inherited from

[`WidgetViewDesc`](../../WidgetViewDesc/classes/WidgetViewDesc.md).[`children`](../../WidgetViewDesc/classes/WidgetViewDesc.md#children)

---

### contentDOM

#### Get Signature

```ts
get contentDOM(): HTMLElement;
```

Defined in: [ViewDesc.ts:106](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L106)

The DOM node that contains child content, if any.

##### Returns

`HTMLElement`

#### Implementation of

```ts
PmNodeViewDesc.contentDOM;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`contentDOM`](../../ViewDesc/classes/ViewDesc.md#contentdom)

---

### contentLost

#### Get Signature

```ts
get contentLost(): boolean;
```

Defined in: [ViewDesc.ts:134](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L134)

Checks if the content DOM has been detached from the main DOM.

##### Returns

`boolean`

#### Implementation of

```ts
PmNodeViewDesc.contentLost;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`contentLost`](../../ViewDesc/classes/ViewDesc.md#contentlost)

---

### dirty

#### Get Signature

```ts
get dirty(): ViewDirtyState;
```

Defined in: [ViewDesc.ts:59](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L59)

The dirty state of this description. Can be NOT_DIRTY, CHILD_DIRTY, CONTENT_DIRTY, or NODE_DIRTY.

##### Returns

[`ViewDirtyState`](../../ViewDirtyState/enumerations/ViewDirtyState.md)

#### Set Signature

```ts
set dirty(dirty): void;
```

Defined in: [ViewDesc.ts:63](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L63)

##### Parameters

| Parameter | Type                                                                    |
| --------- | ----------------------------------------------------------------------- |
| `dirty`   | [`ViewDirtyState`](../../ViewDirtyState/enumerations/ViewDirtyState.md) |

##### Returns

`void`

#### Implementation of

```ts
PmNodeViewDesc.dirty;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`dirty`](../../ViewDesc/classes/ViewDesc.md#dirty)

---

### dom

#### Get Signature

```ts
get dom(): Node;
```

Defined in: [ViewDesc.ts:99](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L99)

The DOM node this description represents.

##### Returns

`Node`

#### Implementation of

```ts
PmNodeViewDesc.dom;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`dom`](../../ViewDesc/classes/ViewDesc.md#dom)

---

### domAtom

#### Get Signature

```ts
get domAtom(): boolean;
```

Defined in: [NodeViewDesc.ts:81](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L81)

Whether this description represents an atomic node that should be treated as a single unit.

##### Returns

`boolean`

#### Implementation of

```ts
PmNodeViewDesc.domAtom;
```

#### Overrides

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`domAtom`](../../ViewDesc/classes/ViewDesc.md#domatom)

---

### ignoreForCoords

#### Get Signature

```ts
get ignoreForCoords(): boolean;
```

Defined in: [ViewDesc.ts:120](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L120)

Whether this view should be ignored when determining coordinates.

##### Returns

`boolean`

#### Implementation of

```ts
PmNodeViewDesc.ignoreForCoords;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`ignoreForCoords`](../../ViewDesc/classes/ViewDesc.md#ignoreforcoords)

---

### ignoreForSelection

#### Get Signature

```ts
get ignoreForSelection(): boolean;
```

Defined in: [ViewDesc.ts:127](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L127)

Whether this view should be ignored for selection purposes.

##### Returns

`boolean`

#### Implementation of

```ts
PmNodeViewDesc.ignoreForSelection;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`ignoreForSelection`](../../ViewDesc/classes/ViewDesc.md#ignoreforselection)

---

### innerDeco

#### Get Signature

```ts
get innerDeco(): DecorationSource;
```

Defined in: [NodeViewDesc.ts:61](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L61)

The decoration source for decorations inside this node.
Provides access to decorations that should be applied to child content.

##### Returns

`DecorationSource`

#### Implementation of

```ts
PmNodeViewDesc.innerDeco;
```

---

### node

#### Get Signature

```ts
get node(): Node_2;
```

Defined in: [ViewDesc.ts:70](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L70)

The ProseMirror node this description represents, if any.

##### Returns

`Node_2`

#### Implementation of

```ts
PmNodeViewDesc.node;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`node`](../../ViewDesc/classes/ViewDesc.md#node)

---

### nodeDOM

#### Get Signature

```ts
get nodeDOM(): Node;
```

Defined in: [NodeViewDesc.ts:69](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L69)

The DOM node that directly represents this ProseMirror node.
May differ from `dom` if outer decorations wrap it.

##### Returns

`Node`

#### Implementation of

```ts
PmNodeViewDesc.nodeDOM;
```

#### Overrides

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`nodeDOM`](../../ViewDesc/classes/ViewDesc.md#nodedom)

---

### outerDeco

#### Get Signature

```ts
get outerDeco(): readonly PmDecoration[];
```

Defined in: [NodeViewDesc.ts:53](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L53)

The decorations that wrap this node from the outside.
These might add attributes, classes, or wrapper elements around the node.

##### Returns

readonly `PmDecoration`[]

#### Implementation of

```ts
PmNodeViewDesc.outerDeco;
```

---

### parent

#### Get Signature

```ts
get parent(): ViewDesc;
```

Defined in: [ViewDesc.ts:77](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L77)

The parent view description in the tree.

##### Returns

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)

#### Set Signature

```ts
set parent(parent): void;
```

Defined in: [ViewDesc.ts:81](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L81)

##### Parameters

| Parameter | Type                                             |
| --------- | ------------------------------------------------ |
| `parent`  | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md) |

##### Returns

`void`

#### Implementation of

```ts
PmNodeViewDesc.parent;
```

#### Inherited from

[`WidgetViewDesc`](../../WidgetViewDesc/classes/WidgetViewDesc.md).[`parent`](../../WidgetViewDesc/classes/WidgetViewDesc.md#parent)

---

### posAfter

#### Get Signature

```ts
get posAfter(): number;
```

Defined in: [ViewDesc.ts:155](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L155)

The document position just after this view.

##### Returns

`number`

#### Implementation of

```ts
PmNodeViewDesc.posAfter;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`posAfter`](../../ViewDesc/classes/ViewDesc.md#posafter)

---

### posAtEnd

#### Get Signature

```ts
get posAtEnd(): number;
```

Defined in: [ViewDesc.ts:162](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L162)

The document position at the end of this view's content.

##### Returns

`number`

#### Implementation of

```ts
PmNodeViewDesc.posAtEnd;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`posAtEnd`](../../ViewDesc/classes/ViewDesc.md#posatend)

---

### posAtStart

#### Get Signature

```ts
get posAtStart(): number;
```

Defined in: [ViewDesc.ts:148](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L148)

The document position at the start of this view's content.

##### Returns

`number`

#### Implementation of

```ts
PmNodeViewDesc.posAtStart;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`posAtStart`](../../ViewDesc/classes/ViewDesc.md#posatstart)

---

### posBefore

#### Get Signature

```ts
get posBefore(): number;
```

Defined in: [ViewDesc.ts:141](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L141)

The document position just before this view.

##### Returns

`number`

#### Implementation of

```ts
PmNodeViewDesc.posBefore;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`posBefore`](../../ViewDesc/classes/ViewDesc.md#posbefore)

---

### side

#### Get Signature

```ts
get side(): number;
```

Defined in: [ViewDesc.ts:185](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L185)

Gets the side value which determines positioning behavior of the view.

- Negative values: positioned before content
- Zero: neutral positioning
- Positive values: positioned after content

##### Returns

`number`

#### Implementation of

```ts
PmNodeViewDesc.side;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`side`](../../ViewDesc/classes/ViewDesc.md#side)

---

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [NodeViewDesc.ts:73](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L73)

The size of the content represented by this desc.

##### Returns

`number`

#### Implementation of

```ts
PmNodeViewDesc.size;
```

#### Overrides

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`size`](../../ViewDesc/classes/ViewDesc.md#size)

## Methods

### descAt()

```ts
descAt(pos): ViewDesc;
```

Defined in: [ViewDesc.ts:371](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L371)

Find the desc for the node after the given pos, if any. (When a
parent node overrode rendering, there might not be one.)

#### Parameters

| Parameter | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `pos`     | `number` | The document position to search for |

#### Returns

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)

The view description at that position, or undefined

#### Implementation of

```ts
PmNodeViewDesc.descAt;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`descAt`](../../ViewDesc/classes/ViewDesc.md#descat)

---

### deselectNode()

```ts
deselectNode(): void;
```

Defined in: [NodeViewDesc.ts:499](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L499)

Remove selected node marking from this node.

#### Returns

`void`

#### Implementation of

```ts
PmNodeViewDesc.deselectNode;
```

---

### destroy()

```ts
destroy(): void;
```

Defined in: [ViewDesc.ts:265](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L265)

Destroys this view description and all its children, cleaning up references.

This method ensures proper cleanup even if exceptions occur during child destruction.

#### Returns

`void`

#### Implementation of

```ts
PmNodeViewDesc.destroy;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`destroy`](../../ViewDesc/classes/ViewDesc.md#destroy)

---

### domAfterPos()

```ts
domAfterPos(pos): Node;
```

Defined in: [ViewDesc.ts:468](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L468)

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

#### Implementation of

```ts
PmNodeViewDesc.domAfterPos;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`domAfterPos`](../../ViewDesc/classes/ViewDesc.md#domafterpos)

---

### domFromPos()

```ts
domFromPos(pos, side): {
  atom?: number;
  node: Node;
  offset: number;
};
```

Defined in: [ViewDesc.ts:408](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L408)

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

| Name     | Type     | Defined in                                                                                                                                            |
| -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `atom?`  | `number` | [ViewDesc.ts:409](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L409) |
| `node`   | `Node`   | [ViewDesc.ts:409](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L409) |
| `offset` | `number` | [ViewDesc.ts:409](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L409) |

#### Implementation of

```ts
PmNodeViewDesc.domFromPos;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`domFromPos`](../../ViewDesc/classes/ViewDesc.md#domfrompos)

---

### emptyChildAt()

```ts
emptyChildAt(side): boolean;
```

Defined in: [ViewDesc.ts:452](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L452)

Checks if there's an empty child at the start or end of this view.

#### Parameters

| Parameter | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `side`    | `number` | Direction to check (-1 for start, 1 for end) |

#### Returns

`boolean`

True if there's an empty child at the specified side

#### Implementation of

```ts
PmNodeViewDesc.emptyChildAt;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`emptyChildAt`](../../ViewDesc/classes/ViewDesc.md#emptychildat)

---

### getDesc()

```ts
getDesc(dom): ViewDesc;
```

Defined in: [ViewDesc.ts:333](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L333)

Gets a view description from a DOM node if it's a descendant of this description.

#### Parameters

| Parameter | Type   | Description           |
| --------- | ------ | --------------------- |
| `dom`     | `Node` | The DOM node to check |

#### Returns

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)

The view description if it's a descendant, undefined otherwise

#### Implementation of

```ts
PmNodeViewDesc.getDesc;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`getDesc`](../../ViewDesc/classes/ViewDesc.md#getdesc)

---

### getType()

```ts
getType(): ViewDescType;
```

Defined in: [NodeViewDesc.ts:392](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L392)

#### Returns

[`ViewDescType`](../../ViewDescType/enumerations/ViewDescType.md)

#### Implementation of

```ts
PmNodeViewDesc.getType;
```

#### Overrides

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`getType`](../../ViewDesc/classes/ViewDesc.md#gettype)

---

### ignoreMutation()

```ts
ignoreMutation(mutation): boolean;
```

Defined in: [ViewDesc.ts:509](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L509)

Determines if a mutation can be safely ignored.

#### Parameters

| Parameter  | Type                 | Description                  |
| ---------- | -------------------- | ---------------------------- |
| `mutation` | `ViewMutationRecord` | The mutation record to check |

#### Returns

`boolean`

True if the mutation can be ignored, false if it needs processing

#### Implementation of

```ts
PmNodeViewDesc.ignoreMutation;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`ignoreMutation`](../../ViewDesc/classes/ViewDesc.md#ignoremutation)

---

### isText()

```ts
isText(_text): boolean;
```

Defined in: [ViewDesc.ts:549](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L549)

Checks if this view represents text with a specific content.

#### Parameters

| Parameter | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `_text`   | `string` | The text content to check against |

#### Returns

`boolean`

True if this is a text view with the given content

#### Implementation of

```ts
PmNodeViewDesc.isText;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`isText`](../../ViewDesc/classes/ViewDesc.md#istext)

---

### localPosFromDOM()

```ts
localPosFromDOM(
   dom,
   offset,
   bias): number;
```

Defined in: [ViewDesc.ts:316](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L316)

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

#### Implementation of

```ts
PmNodeViewDesc.localPosFromDOM;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`localPosFromDOM`](../../ViewDesc/classes/ViewDesc.md#localposfromdom)

---

### markDirty()

```ts
markDirty(from, to): void;
```

Defined in: [ViewDesc.ts:524](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L524)

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

#### Implementation of

```ts
PmNodeViewDesc.markDirty;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`markDirty`](../../ViewDesc/classes/ViewDesc.md#markdirty)

---

### markParentsDirty()

```ts
markParentsDirty(): void;
```

Defined in: [ViewDesc.ts:557](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L557)

Marks this description and its parents as dirty, propagating the dirty state up the tree.
Sets the dirty level to CONTENT_DIRTY for the immediate parent and CHILD_DIRTY for ancestors.

#### Returns

`void`

#### Implementation of

```ts
PmNodeViewDesc.markParentsDirty;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`markParentsDirty`](../../ViewDesc/classes/ViewDesc.md#markparentsdirty)

---

### matchesHack()

```ts
matchesHack(_nodeName): boolean;
```

Defined in: [ViewDesc.ts:236](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L236)

Checks if this description matches a hack node with a specific name.

#### Parameters

| Parameter   | Type     | Description                    |
| ----------- | -------- | ------------------------------ |
| `_nodeName` | `string` | The node name to check against |

#### Returns

`boolean`

True if this is a hack node with the given name

#### Implementation of

```ts
PmNodeViewDesc.matchesHack;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`matchesHack`](../../ViewDesc/classes/ViewDesc.md#matcheshack)

---

### matchesMark()

```ts
matchesMark(_mark): boolean;
```

Defined in: [ViewDesc.ts:214](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L214)

Checks if this description matches a given mark.

#### Parameters

| Parameter | Type   | Description               |
| --------- | ------ | ------------------------- |
| `_mark`   | `Mark` | The mark to check against |

#### Returns

`boolean`

True if this description represents the given mark

#### Implementation of

```ts
PmNodeViewDesc.matchesMark;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`matchesMark`](../../ViewDesc/classes/ViewDesc.md#matchesmark)

---

### matchesNode()

```ts
matchesNode(
   node,
   outerDeco,
   innerDeco): boolean;
```

Defined in: [NodeViewDesc.ts:434](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L434)

Checks if this description matches a given node with decorations.

#### Parameters

| Parameter   | Type                      | Description                          |
| ----------- | ------------------------- | ------------------------------------ |
| `node`      | `Node_2`                  | The node to check against            |
| `outerDeco` | readonly `PmDecoration`[] | The outer decorations to check       |
| `innerDeco` | `DecorationSource`        | The inner decoration source to check |

#### Returns

`boolean`

True if this description represents the given node with matching decorations

#### Implementation of

```ts
PmNodeViewDesc.matchesNode;
```

#### Overrides

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`matchesNode`](../../ViewDesc/classes/ViewDesc.md#matchesnode)

---

### matchesWidget()

```ts
matchesWidget(_widget): boolean;
```

Defined in: [ViewDesc.ts:199](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L199)

Checks if this description matches a given widget decoration.

#### Parameters

| Parameter | Type           | Description                            |
| --------- | -------------- | -------------------------------------- |
| `_widget` | `PmDecoration` | The widget decoration to check against |

#### Returns

`boolean`

True if this description represents the given widget

#### Implementation of

```ts
PmNodeViewDesc.matchesWidget;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`matchesWidget`](../../ViewDesc/classes/ViewDesc.md#matcheswidget)

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

Defined in: [ViewDesc.ts:435](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L435)

Finds a DOM range in a single parent for a given changed range.

This method maps document positions to DOM child indices, which is needed
for parsing changed content. It tries to optimize by recursing into a single
child when the entire range fits inside it.

#### Parameters

| Parameter | Type     | Default value | Description                                        |
| --------- | -------- | ------------- | -------------------------------------------------- |
| `from`    | `number` | `undefined`   | Start position of the range                        |
| `to`      | `number` | `undefined`   | End position of the range                          |
| `base`    | `number` | `0`           | Base offset for position calculations (default: 0) |

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

| Name         | Type     | Defined in                                                                                                                                            |
| ------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`       | `number` | [ViewDesc.ts:437](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L437) |
| `fromOffset` | `number` | [ViewDesc.ts:437](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L437) |
| `node`       | `Node`   | [ViewDesc.ts:437](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L437) |
| `to`         | `number` | [ViewDesc.ts:437](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L437) |
| `toOffset`   | `number` | [ViewDesc.ts:437](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L437) |

#### Implementation of

```ts
PmNodeViewDesc.parseRange;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`parseRange`](../../ViewDesc/classes/ViewDesc.md#parserange)

---

### parseRule()

```ts
parseRule(): Omit<TagParseRule, "tag">;
```

Defined in: [NodeViewDesc.ts:396](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L396)

When parsing in-editor content (in domchange.js), we allow
descriptions to determine the parse rules that should be used to
parse them.

#### Returns

`Omit`&lt;`TagParseRule`, `"tag"`&gt;

#### Implementation of

```ts
PmNodeViewDesc.parseRule;
```

#### Overrides

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`parseRule`](../../ViewDesc/classes/ViewDesc.md#parserule)

---

### posBeforeChild()

```ts
posBeforeChild(child): number;
```

Defined in: [ViewDesc.ts:293](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L293)

Calculates the document position just before a given child view.

#### Parameters

| Parameter | Type         | Description              |
| --------- | ------------ | ------------------------ |
| `child`   | `PmViewDesc` | The child view to locate |

#### Returns

`number`

The document position before the child

#### Implementation of

```ts
PmNodeViewDesc.posBeforeChild;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`posBeforeChild`](../../ViewDesc/classes/ViewDesc.md#posbeforechild)

---

### posFromDOM()

```ts
posFromDOM(
   dom,
   offset,
   bias): number;
```

Defined in: [ViewDesc.ts:354](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L354)

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

#### Implementation of

```ts
PmNodeViewDesc.posFromDOM;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`posFromDOM`](../../ViewDesc/classes/ViewDesc.md#posfromdom)

---

### selectNode()

```ts
selectNode(): void;
```

Defined in: [NodeViewDesc.ts:487](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L487)

Mark this node as being the selected node.

#### Returns

`void`

#### Implementation of

```ts
PmNodeViewDesc.selectNode;
```

---

### setDomNode()

```ts
protected setDomNode(dom): void;
```

Defined in: [ViewDesc.ts:575](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L575)

Sets the DOM node for this description and establishes the bidirectional link.

#### Parameters

| Parameter | Type   | Description                                     |
| --------- | ------ | ----------------------------------------------- |
| `dom`     | `Node` | The DOM node to associate with this description |

#### Returns

`void`

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`setDomNode`](../../ViewDesc/classes/ViewDesc.md#setdomnode)

---

### setSelection()

```ts
setSelection(
   anchor,
   head,
   view,
   force?): void;
```

Defined in: [ViewDesc.ts:492](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L492)

Sets a selection within this view description or delegates to a child.

View descs are responsible for setting selections that fall entirely inside them,
allowing custom node views to implement specialized selection behavior.

Strategy:

1. If selection is entirely within a child → delegate to that child
2. Otherwise → convert positions to DOM and apply selection

#### Parameters

| Parameter | Type           | Default value | Description                                                        |
| --------- | -------------- | ------------- | ------------------------------------------------------------------ |
| `anchor`  | `number`       | `undefined`   | The anchor position of the selection                               |
| `head`    | `number`       | `undefined`   | The head position of the selection                                 |
| `view`    | `PmEditorView` | `undefined`   | The editor view                                                    |
| `force`   | `boolean`      | `false`       | Whether to force the selection update even if it appears unchanged |

#### Returns

`void`

#### Implementation of

```ts
PmNodeViewDesc.setSelection;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`setSelection`](../../ViewDesc/classes/ViewDesc.md#setselection)

---

### stopEvent()

```ts
stopEvent(_event): boolean;
```

Defined in: [ViewDesc.ts:256](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDesc.ts#L256)

Used by the editor's event handler to ignore events that come
from certain descs.

#### Parameters

| Parameter | Type    | Description            |
| --------- | ------- | ---------------------- |
| `_event`  | `Event` | The DOM event to check |

#### Returns

`boolean`

True if the event should be stopped/ignored

#### Implementation of

```ts
PmNodeViewDesc.stopEvent;
```

#### Inherited from

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md).[`stopEvent`](../../ViewDesc/classes/ViewDesc.md#stopevent)

---

### updateInner()

```ts
updateInner(
   node,
   outerDeco,
   innerDeco): void;
```

Defined in: [NodeViewDesc.ts:450](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L450)

Updates the internal state of this node view with new node and decorations.

#### Parameters

| Parameter   | Type                      | Description           |
| ----------- | ------------------------- | --------------------- |
| `node`      | `Node_2`                  | The new node          |
| `outerDeco` | readonly `PmDecoration`[] | New outer decorations |
| `innerDeco` | `DecorationSource`        | New inner decorations |

#### Returns

`void`

#### Implementation of

```ts
PmNodeViewDesc.updateInner;
```

---

### updateOuterDeco()

```ts
updateOuterDeco(outerDeco): void;
```

Defined in: [NodeViewDesc.ts:463](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L463)

Updates the outer decorations on this node, patching the DOM as needed.

#### Parameters

| Parameter   | Type                      | Description                        |
| ----------- | ------------------------- | ---------------------------------- |
| `outerDeco` | readonly `PmDecoration`[] | The new array of outer decorations |

#### Returns

`void`

#### Implementation of

```ts
PmNodeViewDesc.updateOuterDeco;
```

---

### applyOuterDeco()

```ts
static applyOuterDeco(
   dom,
   deco,
   node): Node;
```

Defined in: [NodeViewDesc.ts:93](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L93)

Apply outer decorations to a DOM node.

#### Parameters

| Parameter | Type                      | Description                   |
| --------- | ------------------------- | ----------------------------- |
| `dom`     | `Node`                    | The DOM node to decorate      |
| `deco`    | readonly `PmDecoration`[] | Array of decorations to apply |
| `node`    | `Node_2`                  | The ProseMirror node          |

#### Returns

`Node`

The decorated DOM node

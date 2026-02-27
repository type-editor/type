[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/viewdesc](../../README.md) / [TextViewDesc](../README.md) / TextViewDesc

# Class: TextViewDesc

Defined in: [TextViewDesc.ts:15](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/TextViewDesc.ts#L15)

View description for text nodes. Text nodes are leaf nodes that contain
only text content and no children. They can be wrapped by mark decorations
but don't have their own content DOM.

## Extends

- [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md)

## Constructors

### Constructor

```ts
new TextViewDesc(
   parent,
   node,
   outerDeco,
   innerDeco,
   dom,
   nodeDOM): TextViewDesc;
```

Defined in: [TextViewDesc.ts:29](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/TextViewDesc.ts#L29)

Creates a new TextViewDesc.

#### Parameters

| Parameter   | Type                                             | Description                                    |
| ----------- | ------------------------------------------------ | ---------------------------------------------- |
| `parent`    | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md) | The parent view description                    |
| `node`      | `Node_2`                                         | The text node                                  |
| `outerDeco` | readonly `PmDecoration`[]                        | Outer decorations (typically marks)            |
| `innerDeco` | `DecorationSource`                               | Inner decorations (unused for text nodes)      |
| `dom`       | `Node`                                           | The outer DOM node (may include mark wrappers) |
| `nodeDOM`   | `Node`                                           | The actual text DOM node                       |

#### Returns

`TextViewDesc`

#### Overrides

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`constructor`](../../NodeViewDesc/classes/NodeViewDesc.md#constructor)

## Properties

| Property                                        | Modifier    | Type                                                                    | Default value              | Inherited from                                                                                                                                | Defined in                                                                                                                                                  |
| ----------------------------------------------- | ----------- | ----------------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-_children"></a> `_children`     | `protected` | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)[]                      | `undefined`                | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_children`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_children)     | [ViewDesc.ts:28](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L28)         |
| <a id="property-_contentdom"></a> `_contentDOM` | `readonly`  | `HTMLElement`                                                           | `undefined`                | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_contentDOM`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_contentdom) | [ViewDesc.ts:24](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L24)         |
| <a id="property-_dirty"></a> `_dirty`           | `protected` | [`ViewDirtyState`](../../ViewDirtyState/enumerations/ViewDirtyState.md) | `ViewDirtyState.NOT_DIRTY` | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_dirty`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_dirty)           | [ViewDesc.ts:25](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L25)         |
| <a id="property-_dom"></a> `_dom`               | `protected` | `Node`                                                                  | `undefined`                | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_dom`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_dom)               | [ViewDesc.ts:29](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L29)         |
| <a id="property-_innerdeco"></a> `_innerDeco`   | `protected` | `DecorationSource`                                                      | `null`                     | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_innerDeco`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_innerdeco)   | [NodeViewDesc.ts:22](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L22) |
| <a id="property-_node"></a> `_node`             | `protected` | `Node_2`                                                                | `undefined`                | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_node`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_node)             | [ViewDesc.ts:26](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L26)         |
| <a id="property-_nodedom"></a> `_nodeDOM`       | `readonly`  | `Node`                                                                  | `undefined`                | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_nodeDOM`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_nodedom)       | [NodeViewDesc.ts:20](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L20) |
| <a id="property-_outerdeco"></a> `_outerDeco`   | `protected` | readonly `PmDecoration`[]                                               | `null`                     | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_outerDeco`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_outerdeco)   | [NodeViewDesc.ts:21](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L21) |
| <a id="property-_parent"></a> `_parent`         | `protected` | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)                        | `undefined`                | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_parent`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_parent)         | [ViewDesc.ts:27](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L27)         |

## Accessors

### border

#### Get Signature

```ts
get border(): number;
```

Defined in: [NodeViewDesc.ts:77](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L77)

For block nodes, this represents the space taken up by their
start/end tokens.

##### Returns

`number`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`border`](../../NodeViewDesc/classes/NodeViewDesc.md#border)

---

### children

#### Get Signature

```ts
get children(): ViewDesc[];
```

Defined in: [ViewDesc.ts:88](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L88)

The child view descriptions of this view.

##### Returns

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)[]

#### Set Signature

```ts
set children(children): void;
```

Defined in: [ViewDesc.ts:92](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L92)

##### Parameters

| Parameter  | Type                                               |
| ---------- | -------------------------------------------------- |
| `children` | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)[] |

##### Returns

`void`

#### Inherited from

[`WidgetViewDesc`](../../WidgetViewDesc/classes/WidgetViewDesc.md).[`children`](../../WidgetViewDesc/classes/WidgetViewDesc.md#children)

---

### contentDOM

#### Get Signature

```ts
get contentDOM(): HTMLElement;
```

Defined in: [ViewDesc.ts:106](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L106)

The DOM node that contains child content, if any.

##### Returns

`HTMLElement`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`contentDOM`](../../NodeViewDesc/classes/NodeViewDesc.md#contentdom)

---

### contentLost

#### Get Signature

```ts
get contentLost(): boolean;
```

Defined in: [ViewDesc.ts:134](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L134)

Checks if the content DOM has been detached from the main DOM.

##### Returns

`boolean`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`contentLost`](../../NodeViewDesc/classes/NodeViewDesc.md#contentlost)

---

### dirty

#### Get Signature

```ts
get dirty(): ViewDirtyState;
```

Defined in: [ViewDesc.ts:59](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L59)

The dirty state of this description. Can be NOT_DIRTY, CHILD_DIRTY, CONTENT_DIRTY, or NODE_DIRTY.

##### Returns

[`ViewDirtyState`](../../ViewDirtyState/enumerations/ViewDirtyState.md)

#### Set Signature

```ts
set dirty(dirty): void;
```

Defined in: [ViewDesc.ts:63](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L63)

##### Parameters

| Parameter | Type                                                                    |
| --------- | ----------------------------------------------------------------------- |
| `dirty`   | [`ViewDirtyState`](../../ViewDirtyState/enumerations/ViewDirtyState.md) |

##### Returns

`void`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`dirty`](../../NodeViewDesc/classes/NodeViewDesc.md#dirty)

---

### dom

#### Get Signature

```ts
get dom(): Node;
```

Defined in: [ViewDesc.ts:99](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L99)

The DOM node this description represents.

##### Returns

`Node`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`dom`](../../NodeViewDesc/classes/NodeViewDesc.md#dom)

---

### domAtom

#### Get Signature

```ts
get domAtom(): boolean;
```

Defined in: [TextViewDesc.ts:38](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/TextViewDesc.ts#L38)

Whether this description represents an atomic node that should be treated as a single unit.

##### Returns

`boolean`

#### Overrides

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`domAtom`](../../NodeViewDesc/classes/NodeViewDesc.md#domatom)

---

### ignoreForCoords

#### Get Signature

```ts
get ignoreForCoords(): boolean;
```

Defined in: [ViewDesc.ts:120](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L120)

Whether this view should be ignored when determining coordinates.

##### Returns

`boolean`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`ignoreForCoords`](../../NodeViewDesc/classes/NodeViewDesc.md#ignoreforcoords)

---

### ignoreForSelection

#### Get Signature

```ts
get ignoreForSelection(): boolean;
```

Defined in: [ViewDesc.ts:127](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L127)

Whether this view should be ignored for selection purposes.

##### Returns

`boolean`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`ignoreForSelection`](../../NodeViewDesc/classes/NodeViewDesc.md#ignoreforselection)

---

### innerDeco

#### Get Signature

```ts
get innerDeco(): DecorationSource;
```

Defined in: [NodeViewDesc.ts:61](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L61)

The decoration source for decorations inside this node.
Provides access to decorations that should be applied to child content.

##### Returns

`DecorationSource`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`innerDeco`](../../NodeViewDesc/classes/NodeViewDesc.md#innerdeco)

---

### node

#### Get Signature

```ts
get node(): Node_2;
```

Defined in: [ViewDesc.ts:70](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L70)

The ProseMirror node this description represents, if any.

##### Returns

`Node_2`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`node`](../../NodeViewDesc/classes/NodeViewDesc.md#node)

---

### nodeDOM

#### Get Signature

```ts
get nodeDOM(): Node;
```

Defined in: [NodeViewDesc.ts:69](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L69)

The DOM node that directly represents this ProseMirror node.
May differ from `dom` if outer decorations wrap it.

##### Returns

`Node`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`nodeDOM`](../../NodeViewDesc/classes/NodeViewDesc.md#nodedom)

---

### outerDeco

#### Get Signature

```ts
get outerDeco(): readonly PmDecoration[];
```

Defined in: [NodeViewDesc.ts:53](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L53)

The decorations that wrap this node from the outside.
These might add attributes, classes, or wrapper elements around the node.

##### Returns

readonly `PmDecoration`[]

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`outerDeco`](../../NodeViewDesc/classes/NodeViewDesc.md#outerdeco)

---

### parent

#### Get Signature

```ts
get parent(): ViewDesc;
```

Defined in: [ViewDesc.ts:77](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L77)

The parent view description in the tree.

##### Returns

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)

#### Set Signature

```ts
set parent(parent): void;
```

Defined in: [ViewDesc.ts:81](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L81)

##### Parameters

| Parameter | Type                                             |
| --------- | ------------------------------------------------ |
| `parent`  | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md) |

##### Returns

`void`

#### Inherited from

[`WidgetViewDesc`](../../WidgetViewDesc/classes/WidgetViewDesc.md).[`parent`](../../WidgetViewDesc/classes/WidgetViewDesc.md#parent)

---

### posAfter

#### Get Signature

```ts
get posAfter(): number;
```

Defined in: [ViewDesc.ts:155](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L155)

The document position just after this view.

##### Returns

`number`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`posAfter`](../../NodeViewDesc/classes/NodeViewDesc.md#posafter)

---

### posAtEnd

#### Get Signature

```ts
get posAtEnd(): number;
```

Defined in: [ViewDesc.ts:162](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L162)

The document position at the end of this view's content.

##### Returns

`number`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`posAtEnd`](../../NodeViewDesc/classes/NodeViewDesc.md#posatend)

---

### posAtStart

#### Get Signature

```ts
get posAtStart(): number;
```

Defined in: [ViewDesc.ts:148](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L148)

The document position at the start of this view's content.

##### Returns

`number`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`posAtStart`](../../NodeViewDesc/classes/NodeViewDesc.md#posatstart)

---

### posBefore

#### Get Signature

```ts
get posBefore(): number;
```

Defined in: [ViewDesc.ts:141](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L141)

The document position just before this view.

##### Returns

`number`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`posBefore`](../../NodeViewDesc/classes/NodeViewDesc.md#posbefore)

---

### side

#### Get Signature

```ts
get side(): number;
```

Defined in: [ViewDesc.ts:185](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L185)

Gets the side value which determines positioning behavior of the view.

- Negative values: positioned before content
- Zero: neutral positioning
- Positive values: positioned after content

##### Returns

`number`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`side`](../../NodeViewDesc/classes/NodeViewDesc.md#side)

---

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [NodeViewDesc.ts:73](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L73)

The size of the content represented by this desc.

##### Returns

`number`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`size`](../../NodeViewDesc/classes/NodeViewDesc.md#size)

## Methods

### descAt()

```ts
descAt(pos): ViewDesc;
```

Defined in: [ViewDesc.ts:371](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L371)

Find the desc for the node after the given pos, if any. (When a
parent node overrode rendering, there might not be one.)

#### Parameters

| Parameter | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `pos`     | `number` | The document position to search for |

#### Returns

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)

The view description at that position, or undefined

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`descAt`](../../NodeViewDesc/classes/NodeViewDesc.md#descat)

---

### deselectNode()

```ts
deselectNode(): void;
```

Defined in: [NodeViewDesc.ts:499](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L499)

Remove selected node marking from this node.

#### Returns

`void`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`deselectNode`](../../NodeViewDesc/classes/NodeViewDesc.md#deselectnode)

---

### destroy()

```ts
destroy(): void;
```

Defined in: [ViewDesc.ts:265](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L265)

Destroys this view description and all its children, cleaning up references.

This method ensures proper cleanup even if exceptions occur during child destruction.

#### Returns

`void`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`destroy`](../../NodeViewDesc/classes/NodeViewDesc.md#destroy)

---

### domAfterPos()

```ts
domAfterPos(pos): Node;
```

Defined in: [ViewDesc.ts:468](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L468)

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

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`domAfterPos`](../../NodeViewDesc/classes/NodeViewDesc.md#domafterpos)

---

### domFromPos()

```ts
domFromPos(pos): {
  node: Node;
  offset: number;
};
```

Defined in: [TextViewDesc.ts:114](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/TextViewDesc.ts#L114)

Converts a document position to a DOM position within the text node.

#### Parameters

| Parameter | Type     | Description                               |
| --------- | -------- | ----------------------------------------- |
| `pos`     | `number` | The position offset within this text node |

#### Returns

```ts
{
  node: Node;
  offset: number;
}
```

The text DOM node and offset

| Name     | Type     | Defined in                                                                                                                                                    |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node`   | `Node`   | [TextViewDesc.ts:114](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/TextViewDesc.ts#L114) |
| `offset` | `number` | [TextViewDesc.ts:114](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/TextViewDesc.ts#L114) |

#### Overrides

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`domFromPos`](../../NodeViewDesc/classes/NodeViewDesc.md#domfrompos)

---

### emptyChildAt()

```ts
emptyChildAt(side): boolean;
```

Defined in: [ViewDesc.ts:452](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L452)

Checks if there's an empty child at the start or end of this view.

#### Parameters

| Parameter | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `side`    | `number` | Direction to check (-1 for start, 1 for end) |

#### Returns

`boolean`

True if there's an empty child at the specified side

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`emptyChildAt`](../../NodeViewDesc/classes/NodeViewDesc.md#emptychildat)

---

### getDesc()

```ts
getDesc(dom): ViewDesc;
```

Defined in: [ViewDesc.ts:333](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L333)

Gets a view description from a DOM node if it's a descendant of this description.

#### Parameters

| Parameter | Type   | Description           |
| --------- | ------ | --------------------- |
| `dom`     | `Node` | The DOM node to check |

#### Returns

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)

The view description if it's a descendant, undefined otherwise

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`getDesc`](../../NodeViewDesc/classes/NodeViewDesc.md#getdesc)

---

### getType()

```ts
getType(): ViewDescType;
```

Defined in: [TextViewDesc.ts:175](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/TextViewDesc.ts#L175)

#### Returns

[`ViewDescType`](../../ViewDescType/enumerations/ViewDescType.md)

#### Overrides

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`getType`](../../NodeViewDesc/classes/NodeViewDesc.md#gettype)

---

### ignoreMutation()

```ts
ignoreMutation(mutation): boolean;
```

Defined in: [TextViewDesc.ts:139](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/TextViewDesc.ts#L139)

Text nodes only care about character data and selection changes.

#### Parameters

| Parameter  | Type                 | Description           |
| ---------- | -------------------- | --------------------- |
| `mutation` | `ViewMutationRecord` | The mutation to check |

#### Returns

`boolean`

True if mutation should be ignored

#### Overrides

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`ignoreMutation`](../../NodeViewDesc/classes/NodeViewDesc.md#ignoremutation)

---

### inParent()

```ts
inParent(): boolean;
```

Defined in: [TextViewDesc.ts:99](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/TextViewDesc.ts#L99)

Checks if this text node is still in its parent's content DOM.

#### Returns

`boolean`

True if the text node is properly attached

---

### isText()

```ts
isText(text): boolean;
```

Defined in: [TextViewDesc.ts:171](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/TextViewDesc.ts#L171)

Checks if this view represents text with a specific content.

#### Parameters

| Parameter | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `text`    | `string` | The text content to check against |

#### Returns

`boolean`

True if this is a text view with the given content

#### Overrides

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`isText`](../../NodeViewDesc/classes/NodeViewDesc.md#istext)

---

### localPosFromDOM()

```ts
localPosFromDOM(
   dom,
   offset,
   bias): number;
```

Defined in: [TextViewDesc.ts:126](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/TextViewDesc.ts#L126)

Converts a DOM position to a document position within the text node.

#### Parameters

| Parameter | Type     | Description                            |
| --------- | -------- | -------------------------------------- |
| `dom`     | `Node`   | The DOM node                           |
| `offset`  | `number` | The offset within the DOM node         |
| `bias`    | `number` | Direction bias (unused for text nodes) |

#### Returns

`number`

The document position

#### Overrides

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`localPosFromDOM`](../../NodeViewDesc/classes/NodeViewDesc.md#localposfromdom)

---

### markDirty()

```ts
markDirty(from, to): void;
```

Defined in: [TextViewDesc.ts:163](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/TextViewDesc.ts#L163)

Marks a range as dirty. If the entire text or boundaries are affected,
marks for full node recreation.

#### Parameters

| Parameter | Type     | Description    |
| --------- | -------- | -------------- |
| `from`    | `number` | Start position |
| `to`      | `number` | End position   |

#### Returns

`void`

#### Overrides

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`markDirty`](../../NodeViewDesc/classes/NodeViewDesc.md#markdirty)

---

### markParentsDirty()

```ts
markParentsDirty(): void;
```

Defined in: [ViewDesc.ts:557](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L557)

Marks this description and its parents as dirty, propagating the dirty state up the tree.
Sets the dirty level to CONTENT_DIRTY for the immediate parent and CHILD_DIRTY for ancestors.

#### Returns

`void`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`markParentsDirty`](../../NodeViewDesc/classes/NodeViewDesc.md#markparentsdirty)

---

### matchesHack()

```ts
matchesHack(_nodeName): boolean;
```

Defined in: [ViewDesc.ts:236](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L236)

Checks if this description matches a hack node with a specific name.

#### Parameters

| Parameter   | Type     | Description                    |
| ----------- | -------- | ------------------------------ |
| `_nodeName` | `string` | The node name to check against |

#### Returns

`boolean`

True if this is a hack node with the given name

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`matchesHack`](../../NodeViewDesc/classes/NodeViewDesc.md#matcheshack)

---

### matchesMark()

```ts
matchesMark(_mark): boolean;
```

Defined in: [ViewDesc.ts:214](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L214)

Checks if this description matches a given mark.

#### Parameters

| Parameter | Type   | Description               |
| --------- | ------ | ------------------------- |
| `_mark`   | `Mark` | The mark to check against |

#### Returns

`boolean`

True if this description represents the given mark

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`matchesMark`](../../NodeViewDesc/classes/NodeViewDesc.md#matchesmark)

---

### matchesNode()

```ts
matchesNode(
   node,
   outerDeco,
   innerDeco): boolean;
```

Defined in: [NodeViewDesc.ts:434](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L434)

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

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`matchesNode`](../../NodeViewDesc/classes/NodeViewDesc.md#matchesnode)

---

### matchesWidget()

```ts
matchesWidget(_widget): boolean;
```

Defined in: [ViewDesc.ts:199](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L199)

Checks if this description matches a given widget decoration.

#### Parameters

| Parameter | Type           | Description                            |
| --------- | -------------- | -------------------------------------- |
| `_widget` | `PmDecoration` | The widget decoration to check against |

#### Returns

`boolean`

True if this description represents the given widget

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`matchesWidget`](../../NodeViewDesc/classes/NodeViewDesc.md#matcheswidget)

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

Defined in: [ViewDesc.ts:435](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L435)

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
| `from`       | `number` | [ViewDesc.ts:437](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L437) |
| `fromOffset` | `number` | [ViewDesc.ts:437](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L437) |
| `node`       | `Node`   | [ViewDesc.ts:437](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L437) |
| `to`         | `number` | [ViewDesc.ts:437](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L437) |
| `toOffset`   | `number` | [ViewDesc.ts:437](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L437) |

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`parseRange`](../../NodeViewDesc/classes/NodeViewDesc.md#parserange)

---

### parseRule()

```ts
parseRule(): {
  skip: boolean | ParentNode;
};
```

Defined in: [TextViewDesc.ts:47](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/TextViewDesc.ts#L47)

Returns a parse rule that skips any decoration wrappers around the text node.

#### Returns

```ts
{
  skip: boolean | ParentNode;
}
```

Parse rule with skip set to the first non-decoration parent

| Name   | Type                      | Defined in                                                                                                                                                  |
| ------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `skip` | `boolean` \| `ParentNode` | [TextViewDesc.ts:47](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/TextViewDesc.ts#L47) |

#### Overrides

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`parseRule`](../../NodeViewDesc/classes/NodeViewDesc.md#parserule)

---

### posBeforeChild()

```ts
posBeforeChild(child): number;
```

Defined in: [ViewDesc.ts:293](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L293)

Calculates the document position just before a given child view.

#### Parameters

| Parameter | Type         | Description              |
| --------- | ------------ | ------------------------ |
| `child`   | `PmViewDesc` | The child view to locate |

#### Returns

`number`

The document position before the child

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`posBeforeChild`](../../NodeViewDesc/classes/NodeViewDesc.md#posbeforechild)

---

### posFromDOM()

```ts
posFromDOM(
   dom,
   offset,
   bias): number;
```

Defined in: [ViewDesc.ts:354](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L354)

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

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`posFromDOM`](../../NodeViewDesc/classes/NodeViewDesc.md#posfromdom)

---

### selectNode()

```ts
selectNode(): void;
```

Defined in: [NodeViewDesc.ts:487](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L487)

Mark this node as being the selected node.

#### Returns

`void`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`selectNode`](../../NodeViewDesc/classes/NodeViewDesc.md#selectnode)

---

### setDomNode()

```ts
protected setDomNode(dom): void;
```

Defined in: [ViewDesc.ts:575](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L575)

Sets the DOM node for this description and establishes the bidirectional link.

#### Parameters

| Parameter | Type   | Description                                     |
| --------- | ------ | ----------------------------------------------- |
| `dom`     | `Node` | The DOM node to associate with this description |

#### Returns

`void`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`setDomNode`](../../NodeViewDesc/classes/NodeViewDesc.md#setdomnode)

---

### setSelection()

```ts
setSelection(
   anchor,
   head,
   view,
   force?): void;
```

Defined in: [ViewDesc.ts:492](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L492)

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

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`setSelection`](../../NodeViewDesc/classes/NodeViewDesc.md#setselection)

---

### slice()

```ts
slice(from, to): TextViewDesc;
```

Defined in: [TextViewDesc.ts:150](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/TextViewDesc.ts#L150)

Creates a sliced copy of this text node.

#### Parameters

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `from`    | `number` | Start position of the slice |
| `to`      | `number` | End position of the slice   |

#### Returns

`TextViewDesc`

A new TextViewDesc with sliced content

---

### stopEvent()

```ts
stopEvent(_event): boolean;
```

Defined in: [ViewDesc.ts:256](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/ViewDesc.ts#L256)

Used by the editor's event handler to ignore events that come
from certain descs.

#### Parameters

| Parameter | Type    | Description            |
| --------- | ------- | ---------------------- |
| `_event`  | `Event` | The DOM event to check |

#### Returns

`boolean`

True if the event should be stopped/ignored

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`stopEvent`](../../NodeViewDesc/classes/NodeViewDesc.md#stopevent)

---

### update()

```ts
update(
   node,
   outerDeco,
   _innerDeco,
   view): boolean;
```

Defined in: [TextViewDesc.ts:68](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/TextViewDesc.ts#L68)

Updates this text node with new content and decorations.

#### Parameters

| Parameter    | Type                      | Description                         |
| ------------ | ------------------------- | ----------------------------------- |
| `node`       | `Node_2`                  | The new text node                   |
| `outerDeco`  | readonly `PmDecoration`[] | New outer decorations               |
| `_innerDeco` | `DecorationSource`        | Inner decorations (unused for text) |
| `view`       | `PmEditorView`            | The editor view                     |

#### Returns

`boolean`

True if update succeeded, false if node needs recreation

---

### updateInner()

```ts
updateInner(
   node,
   outerDeco,
   innerDeco): void;
```

Defined in: [NodeViewDesc.ts:450](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L450)

Updates the internal state of this node view with new node and decorations.

#### Parameters

| Parameter   | Type                      | Description           |
| ----------- | ------------------------- | --------------------- |
| `node`      | `Node_2`                  | The new node          |
| `outerDeco` | readonly `PmDecoration`[] | New outer decorations |
| `innerDeco` | `DecorationSource`        | New inner decorations |

#### Returns

`void`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`updateInner`](../../NodeViewDesc/classes/NodeViewDesc.md#updateinner)

---

### updateOuterDeco()

```ts
updateOuterDeco(outerDeco): void;
```

Defined in: [NodeViewDesc.ts:463](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L463)

Updates the outer decorations on this node, patching the DOM as needed.

#### Parameters

| Parameter   | Type                      | Description                        |
| ----------- | ------------------------- | ---------------------------------- |
| `outerDeco` | readonly `PmDecoration`[] | The new array of outer decorations |

#### Returns

`void`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`updateOuterDeco`](../../NodeViewDesc/classes/NodeViewDesc.md#updateouterdeco)

---

### applyOuterDeco()

```ts
static applyOuterDeco(
   dom,
   deco,
   node): Node;
```

Defined in: [NodeViewDesc.ts:93](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L93)

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

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`applyOuterDeco`](../../NodeViewDesc/classes/NodeViewDesc.md#applyouterdeco)

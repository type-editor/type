[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/viewdesc](../../README.md) / [CustomNodeViewDesc](../README.md) / CustomNodeViewDesc

# Class: CustomNodeViewDesc

Defined in: [CustomNodeViewDesc.ts:24](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/CustomNodeViewDesc.ts#L24)

A separate subclass is used for customized node views, so that the
extra checks only have to be made for nodes that are actually
customized.

Custom node views allow developers to override default rendering and
behavior for specific node types. This class delegates to the custom
spec methods (update, selectNode, setSelection, etc.) when available.

## Extends

- [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md)

## Constructors

### Constructor

```ts
new CustomNodeViewDesc(
   parent,
   node,
   outerDeco,
   innerDeco,
   dom,
   contentDOM,
   nodeDOM,
   spec): CustomNodeViewDesc;
```

Defined in: [CustomNodeViewDesc.ts:40](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/CustomNodeViewDesc.ts#L40)

Creates a new CustomNodeViewDesc.

#### Parameters

| Parameter    | Type                                             | Description                        |
| ------------ | ------------------------------------------------ | ---------------------------------- |
| `parent`     | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md) | The parent view description        |
| `node`       | `Node_2`                                         | The ProseMirror node               |
| `outerDeco`  | readonly `PmDecoration`[]                        | Outer decorations                  |
| `innerDeco`  | `DecorationSource`                               | Inner decorations                  |
| `dom`        | `Node`                                           | The outer DOM node                 |
| `contentDOM` | `HTMLElement`                                    | The content DOM node (if any)      |
| `nodeDOM`    | `Node`                                           | The node's main DOM element        |
| `spec`       | `NodeView`                                       | The custom node view specification |

#### Returns

`CustomNodeViewDesc`

#### Overrides

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`constructor`](../../NodeViewDesc/classes/NodeViewDesc.md#constructor)

## Properties

| Property                                        | Modifier    | Type                                                                    | Default value              | Inherited from                                                                                                                                | Defined in                                                                                                                                                  |
| ----------------------------------------------- | ----------- | ----------------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-_children"></a> `_children`     | `protected` | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)[]                      | `undefined`                | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_children`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_children)     | [ViewDesc.ts:28](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L28)         |
| <a id="property-_contentdom"></a> `_contentDOM` | `readonly`  | `HTMLElement`                                                           | `undefined`                | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_contentDOM`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_contentdom) | [ViewDesc.ts:24](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L24)         |
| <a id="property-_dirty"></a> `_dirty`           | `protected` | [`ViewDirtyState`](../../ViewDirtyState/enumerations/ViewDirtyState.md) | `ViewDirtyState.NOT_DIRTY` | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_dirty`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_dirty)           | [ViewDesc.ts:25](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L25)         |
| <a id="property-_dom"></a> `_dom`               | `protected` | `Node`                                                                  | `undefined`                | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_dom`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_dom)               | [ViewDesc.ts:29](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L29)         |
| <a id="property-_innerdeco"></a> `_innerDeco`   | `protected` | `DecorationSource`                                                      | `null`                     | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_innerDeco`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_innerdeco)   | [NodeViewDesc.ts:22](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L22) |
| <a id="property-_node"></a> `_node`             | `protected` | `Node_2`                                                                | `undefined`                | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_node`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_node)             | [ViewDesc.ts:26](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L26)         |
| <a id="property-_nodedom"></a> `_nodeDOM`       | `readonly`  | `Node`                                                                  | `undefined`                | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_nodeDOM`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_nodedom)       | [NodeViewDesc.ts:20](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L20) |
| <a id="property-_outerdeco"></a> `_outerDeco`   | `protected` | readonly `PmDecoration`[]                                               | `null`                     | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_outerDeco`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_outerdeco)   | [NodeViewDesc.ts:21](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L21) |
| <a id="property-_parent"></a> `_parent`         | `protected` | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)                        | `undefined`                | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`_parent`](../../NodeViewDesc/classes/NodeViewDesc.md#property-_parent)         | [ViewDesc.ts:27](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L27)         |

## Accessors

### border

#### Get Signature

```ts
get border(): number;
```

Defined in: [NodeViewDesc.ts:77](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L77)

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

Defined in: [ViewDesc.ts:88](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L88)

The child view descriptions of this view.

##### Returns

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)[]

#### Set Signature

```ts
set children(children): void;
```

Defined in: [ViewDesc.ts:92](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L92)

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

Defined in: [ViewDesc.ts:106](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L106)

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

Defined in: [ViewDesc.ts:134](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L134)

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

Defined in: [ViewDesc.ts:59](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L59)

The dirty state of this description. Can be NOT_DIRTY, CHILD_DIRTY, CONTENT_DIRTY, or NODE_DIRTY.

##### Returns

[`ViewDirtyState`](../../ViewDirtyState/enumerations/ViewDirtyState.md)

#### Set Signature

```ts
set dirty(dirty): void;
```

Defined in: [ViewDesc.ts:63](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L63)

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

Defined in: [ViewDesc.ts:99](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L99)

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

Defined in: [NodeViewDesc.ts:81](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L81)

Whether this description represents an atomic node that should be treated as a single unit.

##### Returns

`boolean`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`domAtom`](../../NodeViewDesc/classes/NodeViewDesc.md#domatom)

---

### ignoreForCoords

#### Get Signature

```ts
get ignoreForCoords(): boolean;
```

Defined in: [ViewDesc.ts:120](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L120)

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

Defined in: [ViewDesc.ts:127](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L127)

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

Defined in: [NodeViewDesc.ts:61](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L61)

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

Defined in: [ViewDesc.ts:70](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L70)

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

Defined in: [NodeViewDesc.ts:69](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L69)

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

Defined in: [NodeViewDesc.ts:53](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L53)

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

Defined in: [ViewDesc.ts:77](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L77)

The parent view description in the tree.

##### Returns

[`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)

#### Set Signature

```ts
set parent(parent): void;
```

Defined in: [ViewDesc.ts:81](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L81)

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

Defined in: [ViewDesc.ts:155](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L155)

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

Defined in: [ViewDesc.ts:162](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L162)

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

Defined in: [ViewDesc.ts:148](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L148)

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

Defined in: [ViewDesc.ts:141](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L141)

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

Defined in: [ViewDesc.ts:185](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L185)

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

Defined in: [NodeViewDesc.ts:73](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L73)

The size of the content represented by this desc.

##### Returns

`number`

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`size`](../../NodeViewDesc/classes/NodeViewDesc.md#size)

---

### spec

#### Get Signature

```ts
get spec(): NodeView;
```

Defined in: [CustomNodeViewDesc.ts:52](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/CustomNodeViewDesc.ts#L52)

##### Returns

`NodeView`

## Methods

### descAt()

```ts
descAt(pos): ViewDesc;
```

Defined in: [ViewDesc.ts:371](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L371)

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

Defined in: [CustomNodeViewDesc.ts:70](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/CustomNodeViewDesc.ts#L70)

Delegates to custom deselectNode if defined, otherwise uses default behavior.

#### Returns

`void`

#### Overrides

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`deselectNode`](../../NodeViewDesc/classes/NodeViewDesc.md#deselectnode)

---

### destroy()

```ts
destroy(): void;
```

Defined in: [CustomNodeViewDesc.ts:100](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/CustomNodeViewDesc.ts#L100)

Calls custom destroy handler if defined, then performs default cleanup.

#### Returns

`void`

#### Overrides

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`destroy`](../../NodeViewDesc/classes/NodeViewDesc.md#destroy)

---

### domAfterPos()

```ts
domAfterPos(pos): Node;
```

Defined in: [ViewDesc.ts:468](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L468)

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
domFromPos(pos, side): {
  atom?: number;
  node: Node;
  offset: number;
};
```

Defined in: [ViewDesc.ts:408](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L408)

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
| `atom?`  | `number` | [ViewDesc.ts:409](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L409) |
| `node`   | `Node`   | [ViewDesc.ts:409](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L409) |
| `offset` | `number` | [ViewDesc.ts:409](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L409) |

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`domFromPos`](../../NodeViewDesc/classes/NodeViewDesc.md#domfrompos)

---

### emptyChildAt()

```ts
emptyChildAt(side): boolean;
```

Defined in: [ViewDesc.ts:452](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L452)

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

Defined in: [ViewDesc.ts:333](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L333)

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

Defined in: [CustomNodeViewDesc.ts:127](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/CustomNodeViewDesc.ts#L127)

#### Returns

[`ViewDescType`](../../ViewDescType/enumerations/ViewDescType.md)

#### Overrides

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`getType`](../../NodeViewDesc/classes/NodeViewDesc.md#gettype)

---

### ignoreMutation()

```ts
ignoreMutation(mutation): boolean;
```

Defined in: [CustomNodeViewDesc.ts:123](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/CustomNodeViewDesc.ts#L123)

Delegates mutation handling to custom ignoreMutation if defined.

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

### isText()

```ts
isText(_text): boolean;
```

Defined in: [ViewDesc.ts:549](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L549)

Checks if this view represents text with a specific content.

#### Parameters

| Parameter | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `_text`   | `string` | The text content to check against |

#### Returns

`boolean`

True if this is a text view with the given content

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`isText`](../../NodeViewDesc/classes/NodeViewDesc.md#istext)

---

### localPosFromDOM()

```ts
localPosFromDOM(
   dom,
   offset,
   bias): number;
```

Defined in: [ViewDesc.ts:316](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L316)

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

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`localPosFromDOM`](../../NodeViewDesc/classes/NodeViewDesc.md#localposfromdom)

---

### markDirty()

```ts
markDirty(from, to): void;
```

Defined in: [ViewDesc.ts:524](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L524)

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

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`markDirty`](../../NodeViewDesc/classes/NodeViewDesc.md#markdirty)

---

### markParentsDirty()

```ts
markParentsDirty(): void;
```

Defined in: [ViewDesc.ts:557](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L557)

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

Defined in: [ViewDesc.ts:236](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L236)

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

Defined in: [ViewDesc.ts:214](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L214)

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

Defined in: [NodeViewDesc.ts:434](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L434)

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

Defined in: [ViewDesc.ts:199](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L199)

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

Defined in: [ViewDesc.ts:435](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L435)

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
| `from`       | `number` | [ViewDesc.ts:437](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L437) |
| `fromOffset` | `number` | [ViewDesc.ts:437](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L437) |
| `node`       | `Node`   | [ViewDesc.ts:437](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L437) |
| `to`         | `number` | [ViewDesc.ts:437](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L437) |
| `toOffset`   | `number` | [ViewDesc.ts:437](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L437) |

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`parseRange`](../../NodeViewDesc/classes/NodeViewDesc.md#parserange)

---

### parseRule()

```ts
parseRule(): Omit<TagParseRule, "tag">;
```

Defined in: [NodeViewDesc.ts:396](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L396)

When parsing in-editor content (in domchange.js), we allow
descriptions to determine the parse rules that should be used to
parse them.

#### Returns

`Omit`&lt;`TagParseRule`, `"tag"`&gt;

#### Inherited from

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`parseRule`](../../NodeViewDesc/classes/NodeViewDesc.md#parserule)

---

### posBeforeChild()

```ts
posBeforeChild(child): number;
```

Defined in: [ViewDesc.ts:293](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L293)

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

Defined in: [ViewDesc.ts:354](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L354)

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

Defined in: [CustomNodeViewDesc.ts:59](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/CustomNodeViewDesc.ts#L59)

Delegates to custom selectNode if defined, otherwise uses default behavior.

#### Returns

`void`

#### Overrides

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`selectNode`](../../NodeViewDesc/classes/NodeViewDesc.md#selectnode)

---

### setDomNode()

```ts
protected setDomNode(dom): void;
```

Defined in: [ViewDesc.ts:575](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDesc.ts#L575)

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
   force): void;
```

Defined in: [CustomNodeViewDesc.ts:86](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/CustomNodeViewDesc.ts#L86)

Delegates to custom setSelection if defined, otherwise uses default behavior.

#### Parameters

| Parameter | Type           | Description                            |
| --------- | -------------- | -------------------------------------- |
| `anchor`  | `number`       | Anchor position relative to node start |
| `head`    | `number`       | Head position relative to node start   |
| `view`    | `PmEditorView` | The editor view                        |
| `force`   | `boolean`      | Whether to force selection update      |

#### Returns

`void`

#### Overrides

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`setSelection`](../../NodeViewDesc/classes/NodeViewDesc.md#setselection)

---

### stopEvent()

```ts
stopEvent(event): boolean;
```

Defined in: [CustomNodeViewDesc.ts:113](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/CustomNodeViewDesc.ts#L113)

Delegates event handling to custom stopEvent if defined.

#### Parameters

| Parameter | Type    | Description   |
| --------- | ------- | ------------- |
| `event`   | `Event` | The DOM event |

#### Returns

`boolean`

True if event should be stopped

#### Overrides

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md).[`stopEvent`](../../NodeViewDesc/classes/NodeViewDesc.md#stopevent)

---

### updateInner()

```ts
updateInner(
   node,
   outerDeco,
   innerDeco): void;
```

Defined in: [NodeViewDesc.ts:450](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L450)

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

Defined in: [NodeViewDesc.ts:463](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L463)

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

Defined in: [NodeViewDesc.ts:93](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/NodeViewDesc.ts#L93)

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

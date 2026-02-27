[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/state](../../../README.md) / [selection/SelectionFactory](../README.md) / SelectionFactory

# Class: SelectionFactory

Defined in: [state/src/selection/SelectionFactory.ts:13](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/selection/SelectionFactory.ts#L13)

Factory class for creating selection instances.
Delegates to the specific selection classes' factory methods.

## Constructors

### Constructor

```ts
new SelectionFactory(): SelectionFactory;
```

#### Returns

`SelectionFactory`

## Methods

### createAllSelection()

```ts
static createAllSelection(document): AllSelection;
```

Defined in: [state/src/selection/SelectionFactory.ts:23](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/selection/SelectionFactory.ts#L23)

Create an all-selection that spans the entire document.
This selection type is useful when you need to select all content,
including non-inline elements that cannot be part of a text selection.

#### Parameters

| Parameter  | Type     | Description                                 |
| ---------- | -------- | ------------------------------------------- |
| `document` | `Node_2` | The document node to select in its entirety |

#### Returns

[`AllSelection`](../../AllSelection/classes/AllSelection.md)

A new AllSelection instance

---

### createNodeSelection()

Create a node selection. Overloaded to accept either a resolved position
or a document with an integer position.
Delegates to NodeSelection.create().

#### Param

Either a resolved position or a document node

#### Param

Optional integer position (required if first arg is a Node)

#### Call Signature

```ts
static createNodeSelection(position): NodeSelection;
```

Defined in: [state/src/selection/SelectionFactory.ts:33](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/selection/SelectionFactory.ts#L33)

Create a node selection from a resolved position.

##### Parameters

| Parameter  | Type          | Description                                                 |
| ---------- | ------------- | ----------------------------------------------------------- |
| `position` | `ResolvedPos` | The resolved position immediately before the node to select |

##### Returns

[`NodeSelection`](../../NodeSelection/classes/NodeSelection.md)

A new NodeSelection instance

#### Call Signature

```ts
static createNodeSelection(node, position): NodeSelection;
```

Defined in: [state/src/selection/SelectionFactory.ts:42](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/selection/SelectionFactory.ts#L42)

Create a node selection from a document and position offset.

##### Parameters

| Parameter  | Type     | Description                                                |
| ---------- | -------- | ---------------------------------------------------------- |
| `node`     | `Node_2` | The document node containing the selection                 |
| `position` | `number` | The integer position immediately before the node to select |

##### Returns

[`NodeSelection`](../../NodeSelection/classes/NodeSelection.md)

A new NodeSelection instance

---

### createTextSelection()

Create a text selection. Overloaded to accept either resolved positions
or a document with integer positions.
Delegates to TextSelection.create().

#### Param

Either a resolved anchor position or a document node

#### Param

Either a resolved head position (if first arg is ResolvedPos) or anchor position number (if first arg is Node)

#### Param

Optional head position number (only used if first arg is Node)

#### Call Signature

```ts
static createTextSelection(
   node,
   anchor,
   head?): TextSelection;
```

Defined in: [state/src/selection/SelectionFactory.ts:68](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/selection/SelectionFactory.ts#L68)

Create a text selection from a document node and integer positions.

##### Parameters

| Parameter | Type     | Description                                                           |
| --------- | -------- | --------------------------------------------------------------------- |
| `node`    | `Node_2` | The document node containing the selection                            |
| `anchor`  | `number` | The anchor position as an integer offset                              |
| `head?`   | `number` | The head position as an integer offset (optional, defaults to anchor) |

##### Returns

[`TextSelection`](../../TextSelection/classes/TextSelection.md)

A new TextSelection instance

#### Call Signature

```ts
static createTextSelection(anchor, head?): TextSelection;
```

Defined in: [state/src/selection/SelectionFactory.ts:77](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/selection/SelectionFactory.ts#L77)

Create a text selection from resolved positions.

##### Parameters

| Parameter | Type          | Description                                               |
| --------- | ------------- | --------------------------------------------------------- |
| `anchor`  | `ResolvedPos` | The resolved anchor position                              |
| `head?`   | `ResolvedPos` | The resolved head position (optional, defaults to anchor) |

##### Returns

[`TextSelection`](../../TextSelection/classes/TextSelection.md)

A new TextSelection instance

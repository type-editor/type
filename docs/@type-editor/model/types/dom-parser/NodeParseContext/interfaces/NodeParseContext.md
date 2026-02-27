[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [types/dom-parser/NodeParseContext](../README.md) / NodeParseContext

# Interface: NodeParseContext

Defined in: [packages/model/src/types/dom-parser/NodeParseContext.ts:13](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/dom-parser/NodeParseContext.ts#L13)

Represents a node being built during parsing.

## Remarks

NodeContext maintains the state for a single node in the parsing context stack,
including its type, attributes, content, marks, and content matching state.

## Properties

| Property                                | Modifier   | Type                                                                              | Defined in                                                                                                                                                                                                  |
| --------------------------------------- | ---------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-content"></a> `content` | `readonly` | [`Node`](../../../../elements/Node/classes/Node.md)[]                             | [packages/model/src/types/dom-parser/NodeParseContext.ts:16](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/dom-parser/NodeParseContext.ts#L16) |
| <a id="property-match"></a> `match`     | `public`   | [`ContentMatch`](../../../content-parser/ContentMatch/interfaces/ContentMatch.md) | [packages/model/src/types/dom-parser/NodeParseContext.ts:15](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/dom-parser/NodeParseContext.ts#L15) |
| <a id="property-options"></a> `options` | `public`   | `number`                                                                          | [packages/model/src/types/dom-parser/NodeParseContext.ts:19](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/dom-parser/NodeParseContext.ts#L19) |
| <a id="property-solid"></a> `solid`     | `readonly` | `boolean`                                                                         | [packages/model/src/types/dom-parser/NodeParseContext.ts:18](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/dom-parser/NodeParseContext.ts#L18) |
| <a id="property-type"></a> `type`       | `readonly` | [`NodeType`](../../../../schema/NodeType/classes/NodeType.md)                     | [packages/model/src/types/dom-parser/NodeParseContext.ts:17](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/dom-parser/NodeParseContext.ts#L17) |

## Methods

### findWrapping()

```ts
findWrapping(node): readonly NodeType[];
```

Defined in: [packages/model/src/types/dom-parser/NodeParseContext.ts:33](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/dom-parser/NodeParseContext.ts#L33)

Finds a sequence of wrapper node types needed to make the given node fit in this context.

#### Parameters

| Parameter | Type                                                | Description                   |
| --------- | --------------------------------------------------- | ----------------------------- |
| `node`    | [`Node`](../../../../elements/Node/classes/Node.md) | The node to find wrapping for |

#### Returns

readonly [`NodeType`](../../../../schema/NodeType/classes/NodeType.md)[]

An array of node types to wrap with, an empty array if no wrapping needed, or null if impossible

#### Remarks

This method attempts to:

1. Fill any required content before the node
2. Find wrapper nodes that make the node valid according to content match rules
3. Update the match state if successful

---

### finish()

```ts
finish(openEnd):
  | Fragment
  | Node;
```

Defined in: [packages/model/src/types/dom-parser/NodeParseContext.ts:47](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/dom-parser/NodeParseContext.ts#L47)

Finishes building this node context and returns the resulting node or fragment.

#### Parameters

| Parameter | Type      | Description                                                            |
| --------- | --------- | ---------------------------------------------------------------------- |
| `openEnd` | `boolean` | Whether to leave the node open (not filling required trailing content) |

#### Returns

\| [`Fragment`](../../../../elements/Fragment/classes/Fragment.md)
\| [`Node`](../../../../elements/Node/classes/Node.md)

The completed node (if this context has a type) or fragment (if null type)

#### Remarks

This method:

1. Strips trailing whitespace if whitespace preservation is not enabled
2. Fills any required trailing content if not leaving the node open
3. Creates the final node with the accumulated content and marks

---

### inlineContext()

```ts
inlineContext(node): boolean;
```

Defined in: [packages/model/src/types/dom-parser/NodeParseContext.ts:61](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/dom-parser/NodeParseContext.ts#L61)

Determines whether this context represents inline content.

#### Parameters

| Parameter | Type   | Description                   |
| --------- | ------ | ----------------------------- |
| `node`    | `Node` | The DOM node being considered |

#### Returns

`boolean`

True if the context is inline, false if it's block-level

#### Remarks

The determination is made by checking:

1. If the node type is defined, use its inlineContent property
2. If content exists, check if the first content node is inline
3. Otherwise, check if the DOM parent is not a block-level element

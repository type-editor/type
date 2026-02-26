[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/dom-change-util](../../../../README.md) / [types/dom-change/DOMPositionInfo](../README.md) / DOMPositionInfo

# Interface: DOMPositionInfo

Defined in: [types/dom-change/DOMPositionInfo.ts:9](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/dom-change-util/src/dom-change/types/dom-change/DOMPositionInfo.ts#L9)

Position information used during DOM parsing for selection reconstruction.

This interface tracks DOM node positions so that after parsing,
the selection can be reconstructed at the correct ProseMirror positions.

DOMPositionInfo

## Properties

| Property                              | Type     | Description                                                                                                                                                           | Defined in                                                                                                                                                                                                  |
| ------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-node"></a> `node`     | `Node`   | The DOM node at this position. Can be a text node or element node.                                                                                                    | [types/dom-change/DOMPositionInfo.ts:14](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/dom-change-util/src/dom-change/types/dom-change/DOMPositionInfo.ts#L14) |
| <a id="property-offset"></a> `offset` | `number` | The offset within the DOM node. For text nodes, this is a character offset. For element nodes, this is a child index.                                                 | [types/dom-change/DOMPositionInfo.ts:21](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/dom-change-util/src/dom-change/types/dom-change/DOMPositionInfo.ts#L21) |
| <a id="property-pos"></a> `pos?`      | `number` | The resolved ProseMirror position after parsing. This is set by the parser and used for selection reconstruction. Undefined until the parser processes this position. | [types/dom-change/DOMPositionInfo.ts:28](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/dom-change-util/src/dom-change/types/dom-change/DOMPositionInfo.ts#L28) |

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/markdown](../../../README.md) / [types/StackElement](../README.md) / StackElement

# Interface: StackElement

Defined in: [types/StackElement.ts:7](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/types/StackElement.ts#L7)

Represents a stack element used during markdown parsing to track nested node construction.

## Properties

| Property                                | Type                                              | Description                                              | Defined in                                                                                                                                                    |
| --------------------------------------- | ------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-attrs"></a> `attrs`     | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; | The attributes for the node, if any.                     | [types/StackElement.ts:11](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/types/StackElement.ts#L11) |
| <a id="property-content"></a> `content` | `Node_2`[]                                        | The child nodes that will be contained in this node.     | [types/StackElement.ts:13](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/types/StackElement.ts#L13) |
| <a id="property-marks"></a> `marks`     | readonly `Mark`[]                                 | The active marks that apply to content within this node. | [types/StackElement.ts:15](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/types/StackElement.ts#L15) |
| <a id="property-type"></a> `type`       | `NodeType`                                        | The type of the ProseMirror node being constructed.      | [types/StackElement.ts:9](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/markdown/src/types/StackElement.ts#L9)   |

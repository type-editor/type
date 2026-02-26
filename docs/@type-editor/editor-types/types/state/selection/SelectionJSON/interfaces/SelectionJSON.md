[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/state/selection/SelectionJSON](../README.md) / SelectionJSON

# Interface: SelectionJSON

Defined in: [packages/editor-types/src/types/state/selection/SelectionJSON.ts:9](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/selection/SelectionJSON.ts#L9)

JSON representation of a selection for serialization.
Different selection types may use different properties:

- TEXT selections use `anchor` and `head`
- NODE selections use `anchor`
- ALL selections only need `type`

## Properties

| Property                               | Type     | Description                                            | Defined in                                                                                                                                                                                                                    |
| -------------------------------------- | -------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-anchor"></a> `anchor?` | `number` | The anchor position (used by text and node selections) | [packages/editor-types/src/types/state/selection/SelectionJSON.ts:13](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/selection/SelectionJSON.ts#L13) |
| <a id="property-head"></a> `head?`     | `number` | The head position (used by text selections)            | [packages/editor-types/src/types/state/selection/SelectionJSON.ts:15](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/selection/SelectionJSON.ts#L15) |
| <a id="property-pos"></a> `pos?`       | `number` | Alternative position property (legacy support)         | [packages/editor-types/src/types/state/selection/SelectionJSON.ts:17](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/selection/SelectionJSON.ts#L17) |
| <a id="property-type"></a> `type`      | `string` | The type of selection (text, node, or all)             | [packages/editor-types/src/types/state/selection/SelectionJSON.ts:11](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/selection/SelectionJSON.ts#L11) |

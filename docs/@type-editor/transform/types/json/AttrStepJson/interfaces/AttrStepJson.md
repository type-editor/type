[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/transform](../../../../README.md) / [types/json/AttrStepJson](../README.md) / AttrStepJson

# Interface: AttrStepJson

Defined in: [packages/transform/src/types/json/AttrStepJson.ts:7](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/transform/src/types/json/AttrStepJson.ts#L7)

JSON representation of an attribute step used for serialization and deserialization.
Extends the base StepJSON interface with attribute-specific properties.

## Extends

- `StepJSON`

## Properties

| Property                                  | Type                              | Description                                                              | Inherited from      | Defined in                                                                                                                                                                                      |
| ----------------------------------------- | --------------------------------- | ------------------------------------------------------------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-attr"></a> `attr?`        | `string`                          | The name of the attribute being modified. Required for deserialization.  | -                   | [packages/transform/src/types/json/AttrStepJson.ts:9](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/transform/src/types/json/AttrStepJson.ts#L9)   |
| <a id="property-from"></a> `from?`        | `number`                          | -                                                                        | `StepJSON.from`     | packages/editor-types/dist/@types/index.d.ts:589                                                                                                                                                |
| <a id="property-mark"></a> `mark?`        | `MarkJSON`                        | -                                                                        | `StepJSON.mark`     | packages/editor-types/dist/@types/index.d.ts:588                                                                                                                                                |
| <a id="property-pos"></a> `pos?`          | `number`                          | -                                                                        | `StepJSON.pos`      | packages/editor-types/dist/@types/index.d.ts:591                                                                                                                                                |
| <a id="property-steptype"></a> `stepType` | `string`                          | -                                                                        | `StepJSON.stepType` | packages/editor-types/dist/@types/index.d.ts:587                                                                                                                                                |
| <a id="property-to"></a> `to?`            | `number`                          | -                                                                        | `StepJSON.to`       | packages/editor-types/dist/@types/index.d.ts:590                                                                                                                                                |
| <a id="property-value"></a> `value?`      | `string` \| `number` \| `boolean` | The new value to set for the attribute. Can be any valid AttrValue type. | -                   | [packages/transform/src/types/json/AttrStepJson.ts:11](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/transform/src/types/json/AttrStepJson.ts#L11) |

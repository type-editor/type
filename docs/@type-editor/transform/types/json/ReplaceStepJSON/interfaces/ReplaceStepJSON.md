[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/transform](../../../../README.md) / [types/json/ReplaceStepJSON](../README.md) / ReplaceStepJSON

# Interface: ReplaceStepJSON

Defined in: [packages/transform/src/types/json/ReplaceStepJSON.ts:7](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/types/json/ReplaceStepJSON.ts#L7)

JSON representation of a ReplaceStep.

## Extends

- `StepJSON`

## Extended by

- [`ReplaceAroundStepJSON`](../../ReplaceAroundStepJSON/interfaces/ReplaceAroundStepJSON.md)

## Properties

| Property                                     | Type        | Description                                     | Inherited from      | Defined in                                                                                                                                                                                            |
| -------------------------------------------- | ----------- | ----------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-from"></a> `from?`           | `number`    | -                                               | `StepJSON.from`     | packages/editor-types/dist/@types/index.d.ts:589                                                                                                                                                      |
| <a id="property-mark"></a> `mark?`           | `MarkJSON`  | -                                               | `StepJSON.mark`     | packages/editor-types/dist/@types/index.d.ts:588                                                                                                                                                      |
| <a id="property-pos"></a> `pos?`             | `number`    | -                                               | `StepJSON.pos`      | packages/editor-types/dist/@types/index.d.ts:591                                                                                                                                                      |
| <a id="property-slice"></a> `slice?`         | `SliceJSON` | The slice to insert, if any.                    | -                   | [packages/transform/src/types/json/ReplaceStepJSON.ts:9](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/types/json/ReplaceStepJSON.ts#L9)   |
| <a id="property-steptype"></a> `stepType`    | `string`    | -                                               | `StepJSON.stepType` | packages/editor-types/dist/@types/index.d.ts:587                                                                                                                                                      |
| <a id="property-structure"></a> `structure?` | `boolean`   | Whether this is a structure-preserving replace. | -                   | [packages/transform/src/types/json/ReplaceStepJSON.ts:11](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/types/json/ReplaceStepJSON.ts#L11) |
| <a id="property-to"></a> `to?`               | `number`    | -                                               | `StepJSON.to`       | packages/editor-types/dist/@types/index.d.ts:590                                                                                                                                                      |

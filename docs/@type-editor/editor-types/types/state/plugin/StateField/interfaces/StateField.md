[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/state/plugin/StateField](../README.md) / StateField

# Interface: StateField&lt;T&gt;

Defined in: [packages/editor-types/src/types/state/plugin/StateField.ts:16](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/plugin/StateField.ts#L16)

A plugin spec may provide a state field (under its
[`state`](#state.PluginSpec.state) property) of this type, which
describes the state it wants to keep. Functions provided here are
always called with the plugin instance as their `this` binding.

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Properties

| Property                                   | Type                                                                               | Description                                                                                                                                                                                                                                                   | Defined in                                                                                                                                                                                                        |
| ------------------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-apply"></a> `apply`        | [`StateFieldApplyFunction`](../type-aliases/StateFieldApplyFunction.md)&lt;`T`&gt; | Apply the given transaction to this state field, producing a new field value. Note that the `newState` argument is again a partially constructed state does not yet contain the state from plugins coming after this one.                                     | [packages/editor-types/src/types/state/plugin/StateField.ts:32](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/plugin/StateField.ts#L32) |
| <a id="property-fromjson"></a> `fromJSON?` | (`config`, `value`, `state`) => `T`                                                | Deserialize the JSON representation of this field. Note that the `state` argument is again a half-initialized state.                                                                                                                                          | [packages/editor-types/src/types/state/plugin/StateField.ts:44](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/plugin/StateField.ts#L44) |
| <a id="property-init"></a> `init`          | [`StateFieldInitFunction`](../type-aliases/StateFieldInitFunction.md)&lt;`T`&gt;   | Initialize the value of the field. `config` will be the object passed to [`EditorState.create`](#state.EditorState^create). Note that `instance` is a half-initialized state instance, and will not have values for plugin fields initialized after this one. | [packages/editor-types/src/types/state/plugin/StateField.ts:24](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/plugin/StateField.ts#L24) |
| <a id="property-tojson"></a> `toJSON?`     | (`value`) => `any`                                                                 | Convert this field to JSON. Optional, can be left off to disable JSON serialization for the field.                                                                                                                                                            | [packages/editor-types/src/types/state/plugin/StateField.ts:38](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/plugin/StateField.ts#L38) |

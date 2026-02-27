[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/state/plugin/PluginSpec](../README.md) / PluginSpec

# Interface: PluginSpec&lt;PluginState&gt;

Defined in: [packages/editor-types/src/types/state/plugin/PluginSpec.ts:13](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/state/plugin/PluginSpec.ts#L13)

This is the type passed to the [`Plugin`](#state.Plugin)
constructor. It provides a definition for a plugin.

## Type Parameters

| Type Parameter |
| -------------- |
| `PluginState`  |

## Indexable

```ts
[key: string]: any
```

Additional properties are allowed on plugin specs, which can be
read via [`Plugin.spec`](#state.Plugin.spec).

## Properties

| Property                                                     | Type                                                                                                                                                                | Description                                                                                                                                                                                                                                                                                                               | Defined in                                                                                                                                                                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-appendtransaction"></a> `appendTransaction?` | (`transactions`, `oldState`, `newState`) => [`PmTransaction`](../../../PmTransaction/interfaces/PmTransaction.md)                                                   | Allows the plugin to append another transaction to be applied after the given array of transactions. When another plugin appends a transaction after this was called, it is called again with the new state and new transactions—but only the new transactions, i.e. it won't be passed transactions that it already saw. | [packages/editor-types/src/types/state/plugin/PluginSpec.ts:58](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/state/plugin/PluginSpec.ts#L58) |
| <a id="property-filtertransaction"></a> `filterTransaction?` | (`transaction`, `state`) => `boolean`                                                                                                                               | When present, this will be called before a transaction is applied by the state, allowing the plugin to cancel it (by returning false).                                                                                                                                                                                    | [packages/editor-types/src/types/state/plugin/PluginSpec.ts:48](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/state/plugin/PluginSpec.ts#L48) |
| <a id="property-key"></a> `key?`                             | [`PmPluginKey`](../../PmPluginKey/interfaces/PmPluginKey.md)                                                                                                        | Can be used to make this a keyed plugin. You can have only one plugin with a given key in a given state, but it is possible to access the plugin's configuration and state through the key, without having access to the plugin instance object.                                                                          | [packages/editor-types/src/types/state/plugin/PluginSpec.ts:33](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/state/plugin/PluginSpec.ts#L33) |
| <a id="property-props"></a> `props?`                         | [`EditorProps`](../../../../view/editor-view/EditorProps/interfaces/EditorProps.md)&lt;[`PmPlugin`](../../PmPlugin/interfaces/PmPlugin.md)&lt;`PluginState`&gt;&gt; | The [view props](#view.EditorProps) added by this plugin. Props that are functions will be bound to have the plugin instance as their `this` binding.                                                                                                                                                                     | [packages/editor-types/src/types/state/plugin/PluginSpec.ts:19](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/state/plugin/PluginSpec.ts#L19) |
| <a id="property-state"></a> `state?`                         | [`StateField`](../../StateField/interfaces/StateField.md)&lt;`PluginState`&gt;                                                                                      | Allows a plugin to define a [state field](#state.StateField), an extra slot in the state object in which it can keep its own data.                                                                                                                                                                                        | [packages/editor-types/src/types/state/plugin/PluginSpec.ts:25](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/state/plugin/PluginSpec.ts#L25) |
| <a id="property-view"></a> `view?`                           | (`view`) => [`PluginView`](../../PluginView/interfaces/PluginView.md)                                                                                               | When the plugin needs to interact with the editor view, or set something up in the DOM, use this field. The function will be called when the plugin's state is associated with an editor view.                                                                                                                            | [packages/editor-types/src/types/state/plugin/PluginSpec.ts:41](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/state/plugin/PluginSpec.ts#L41) |

[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/state/plugin/PluginView](../README.md) / PluginView

# Interface: PluginView

Defined in: [packages/editor-types/src/types/state/plugin/PluginView.ts:8](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/editor-types/src/types/state/plugin/PluginView.ts#L8)

A stateful object that can be installed in an editor by a
[plugin](#state.PluginSpec.view).

## Properties

| Property                                 | Type                            | Description                                                                   | Defined in                                                                                                                                                                                                        |
| ---------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-destroy"></a> `destroy?` | () => `void`                    | Called when the view is destroyed or receives a state with different plugins. | [packages/editor-types/src/types/state/plugin/PluginView.ts:18](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/editor-types/src/types/state/plugin/PluginView.ts#L18) |
| <a id="property-update"></a> `update?`   | (`view`, `prevState`) => `void` | Called whenever the view's state is updated.                                  | [packages/editor-types/src/types/state/plugin/PluginView.ts:12](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/editor-types/src/types/state/plugin/PluginView.ts#L12) |

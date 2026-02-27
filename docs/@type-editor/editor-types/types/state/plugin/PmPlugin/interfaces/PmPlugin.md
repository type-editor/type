[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/state/plugin/PmPlugin](../README.md) / PmPlugin

# Interface: PmPlugin&lt;PluginState&gt;

Defined in: [packages/editor-types/src/types/state/plugin/PmPlugin.ts:11](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/state/plugin/PmPlugin.ts#L11)

Plugins bundle functionality that can be added to an editor.
They are part of the [editor state](#state.EditorState) and
may influence that state and the view that contains it.

## Type Parameters

| Type Parameter | Default type |
| -------------- | ------------ |
| `PluginState`  | `any`        |

## Properties

| Property                            | Modifier   | Type                                                                                                                       | Defined in                                                                                                                                                                                                    |
| ----------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-key"></a> `key`     | `readonly` | `string`                                                                                                                   | [packages/editor-types/src/types/state/plugin/PmPlugin.ts:14](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/state/plugin/PmPlugin.ts#L14) |
| <a id="property-props"></a> `props` | `readonly` | [`EditorProps`](../../../../view/editor-view/EditorProps/interfaces/EditorProps.md)&lt;`PmPlugin`&lt;`PluginState`&gt;&gt; | [packages/editor-types/src/types/state/plugin/PmPlugin.ts:13](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/state/plugin/PmPlugin.ts#L13) |
| <a id="property-spec"></a> `spec`   | `readonly` | [`PluginSpec`](../../PluginSpec/interfaces/PluginSpec.md)&lt;`PluginState`&gt;                                             | [packages/editor-types/src/types/state/plugin/PmPlugin.ts:15](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/state/plugin/PmPlugin.ts#L15) |

## Methods

### getState()

```ts
getState(state): PluginState;
```

Defined in: [packages/editor-types/src/types/state/plugin/PmPlugin.ts:20](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/state/plugin/PmPlugin.ts#L20)

Extract the plugin's state field from an editor state.

#### Parameters

| Parameter | Type                                                                               |
| --------- | ---------------------------------------------------------------------------------- |
| `state`   | [`PmEditorState`](../../../editor-state/PmEditorState/interfaces/PmEditorState.md) |

#### Returns

`PluginState`

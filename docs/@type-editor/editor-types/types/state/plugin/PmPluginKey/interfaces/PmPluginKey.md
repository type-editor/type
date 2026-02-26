[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/state/plugin/PmPluginKey](../README.md) / PmPluginKey

# Interface: PmPluginKey&lt;PluginState&gt;

Defined in: [packages/editor-types/src/types/state/plugin/PmPluginKey.ts:5](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/plugin/PmPluginKey.ts#L5)

## Type Parameters

| Type Parameter | Default type |
| -------------- | ------------ |
| `PluginState`  | `any`        |

## Properties

| Property                        | Modifier   | Type     | Defined in                                                                                                                                                                                                        |
| ------------------------------- | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-key"></a> `key` | `readonly` | `string` | [packages/editor-types/src/types/state/plugin/PmPluginKey.ts:6](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/plugin/PmPluginKey.ts#L6) |

## Methods

### get()

```ts
get(state): PmPlugin<PluginState>;
```

Defined in: [packages/editor-types/src/types/state/plugin/PmPluginKey.ts:12](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/plugin/PmPluginKey.ts#L12)

Get the active plugin with this key, if any, from an editor
state.

#### Parameters

| Parameter | Type                                                                               |
| --------- | ---------------------------------------------------------------------------------- |
| `state`   | [`PmEditorState`](../../../editor-state/PmEditorState/interfaces/PmEditorState.md) |

#### Returns

[`PmPlugin`](../../PmPlugin/interfaces/PmPlugin.md)&lt;`PluginState`&gt;

---

### getState()

```ts
getState(state): PluginState;
```

Defined in: [packages/editor-types/src/types/state/plugin/PmPluginKey.ts:17](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/plugin/PmPluginKey.ts#L17)

Get the plugin's state from an editor state.

#### Parameters

| Parameter | Type                                                                               |
| --------- | ---------------------------------------------------------------------------------- |
| `state`   | [`PmEditorState`](../../../editor-state/PmEditorState/interfaces/PmEditorState.md) |

#### Returns

`PluginState`

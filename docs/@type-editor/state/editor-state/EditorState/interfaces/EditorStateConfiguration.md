[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/state](../../../README.md) / [editor-state/EditorState](../README.md) / EditorStateConfiguration

# Interface: EditorStateConfiguration

Defined in: [state/src/editor-state/EditorState.ts:33](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/state/src/editor-state/EditorState.ts#L33)

Configuration object wrapping the part of a state object that stays the same
across transactions. Stored in the state's `config` property.

## Properties

| Property                                      | Type                                                                                             | Description                                                          | Defined in                                                                                                                                                                       |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-fields"></a> `fields`         | readonly [`FieldDesc`](../../FieldDesc/classes/FieldDesc.md)&lt;`unknown`&gt;[]                  | Array of field descriptors including both built-in and plugin fields | [state/src/editor-state/EditorState.ts:35](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/state/src/editor-state/EditorState.ts#L35) |
| <a id="property-plugins"></a> `plugins`       | readonly [`Plugin`](../../../plugin/Plugin/classes/Plugin.md)&lt;`any`&gt;[]                     | Array of active plugins                                              | [state/src/editor-state/EditorState.ts:37](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/state/src/editor-state/EditorState.ts#L37) |
| <a id="property-pluginsmap"></a> `pluginsMap` | `ReadonlyMap`&lt;`string`, [`Plugin`](../../../plugin/Plugin/classes/Plugin.md)&lt;`any`&gt;&gt; | Map of plugin keys to plugin instances for fast lookup               | [state/src/editor-state/EditorState.ts:39](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/state/src/editor-state/EditorState.ts#L39) |
| <a id="property-schema"></a> `schema`         | `Schema`                                                                                         | The document schema                                                  | [state/src/editor-state/EditorState.ts:41](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/state/src/editor-state/EditorState.ts#L41) |

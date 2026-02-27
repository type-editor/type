[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/state/editor-state/EditorStateConfig](../README.md) / EditorStateConfig

# Interface: EditorStateConfig

Defined in: [packages/editor-types/src/types/state/editor-state/EditorStateConfig.ts:12](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/state/editor-state/EditorStateConfig.ts#L12)

The type of object passed to
[`EditorState.create`](#state.EditorState^create).

## Properties

| Property                                         | Type                                                                                  | Description                                                        | Defined in                                                                                                                                                                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-doc"></a> `doc?`                 | `Node_2`                                                                              | The starting document. Either this or `schema` _must_ be provided. | [packages/editor-types/src/types/state/editor-state/EditorStateConfig.ts:22](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/state/editor-state/EditorStateConfig.ts#L22) |
| <a id="property-plugins"></a> `plugins?`         | readonly [`PmPlugin`](../../../plugin/PmPlugin/interfaces/PmPlugin.md)&lt;`any`&gt;[] | The plugins that should be active in this state.                   | [packages/editor-types/src/types/state/editor-state/EditorStateConfig.ts:37](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/state/editor-state/EditorStateConfig.ts#L37) |
| <a id="property-schema"></a> `schema?`           | `Schema`                                                                              | The schema to use (only relevant if no `doc` is specified).        | [packages/editor-types/src/types/state/editor-state/EditorStateConfig.ts:17](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/state/editor-state/EditorStateConfig.ts#L17) |
| <a id="property-selection"></a> `selection?`     | [`PmSelection`](../../../selection/PmSelection/interfaces/PmSelection.md)             | A valid selection in the document.                                 | [packages/editor-types/src/types/state/editor-state/EditorStateConfig.ts:27](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/state/editor-state/EditorStateConfig.ts#L27) |
| <a id="property-storedmarks"></a> `storedMarks?` | readonly `Mark`[]                                                                     | The initial set of [stored marks](#state.EditorState.storedMarks). | [packages/editor-types/src/types/state/editor-state/EditorStateConfig.ts:32](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/state/editor-state/EditorStateConfig.ts#L32) |

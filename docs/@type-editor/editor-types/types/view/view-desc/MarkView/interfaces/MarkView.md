[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/view/view-desc/MarkView](../README.md) / MarkView

# Interface: MarkView

Defined in: [packages/editor-types/src/types/view/view-desc/MarkView.ts:12](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/view-desc/MarkView.ts#L12)

By default, document marks are rendered using the result of the
[`toDOM`](#model.MarkSpec.toDOM) method of their spec, and managed entirely
by the editor. For some use cases, you want more control over the behavior
of a mark's in-editor representation, and need to
[define](#view.EditorProps.markViews) a custom mark view.

Objects returned as mark views must conform to this interface.

## Properties

| Property                                               | Type                      | Description                                                                                                                                                                                                      | Defined in                                                                                                                                                                                                        |
| ------------------------------------------------------ | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-contentdom"></a> `contentDOM?`         | `HTMLElement`             | The DOM node that should hold the mark's content. When this is not present, the `dom` property is used as the content DOM.                                                                                       | [packages/editor-types/src/types/view/view-desc/MarkView.ts:22](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/view-desc/MarkView.ts#L22) |
| <a id="property-destroy"></a> `destroy?`               | () => `void`              | Called when the mark view is removed from the editor or the whole editor is destroyed.                                                                                                                           | [packages/editor-types/src/types/view/view-desc/MarkView.ts:36](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/view-desc/MarkView.ts#L36) |
| <a id="property-dom"></a> `dom`                        | `Node`                    | The outer DOM node that represents the document node.                                                                                                                                                            | [packages/editor-types/src/types/view/view-desc/MarkView.ts:16](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/view-desc/MarkView.ts#L16) |
| <a id="property-ignoremutation"></a> `ignoreMutation?` | (`mutation`) => `boolean` | Called when a [mutation](#view.ViewMutationRecord) happens within the view. Return false if the editor should re-read the selection or re-parse the range around the mutation, true if it can safely be ignored. | [packages/editor-types/src/types/view/view-desc/MarkView.ts:29](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/view-desc/MarkView.ts#L29) |

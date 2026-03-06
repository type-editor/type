[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/util/drag-drop-helper](../README.md) / DragDropListenerOptions

# Interface: DragDropListenerOptions

Defined in: [packages/menu/src/menu-items/util/drag-drop-helper.ts:55](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menu-items/util/drag-drop-helper.ts#L55)

Options for configuring drag-drop listeners.

## Properties

| Property                                           | Type                                                   | Description                                                                     | Defined in                                                                                                                                                                                              |
| -------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-dialog"></a> `dialog`              | [`EditDialog`](../../EditDialog/classes/EditDialog.md) | The EditDialog to attach listeners to                                           | [packages/menu/src/menu-items/util/drag-drop-helper.ts:57](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menu-items/util/drag-drop-helper.ts#L57) |
| <a id="property-dropzone"></a> `dropZone`          | `HTMLElement`                                          | The drop zone element ID or element                                             | [packages/menu/src/menu-items/util/drag-drop-helper.ts:59](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menu-items/util/drag-drop-helper.ts#L59) |
| <a id="property-ondrop"></a> `onDrop`              | (`files`) => `void`                                    | Callback when files are dropped                                                 | [packages/menu/src/menu-items/util/drag-drop-helper.ts:61](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menu-items/util/drag-drop-helper.ts#L61) |
| <a id="property-validatedrop"></a> `validateDrop?` | (`items`) => `boolean`                                 | Optional validator to determine if drop should be allowed (affects drop effect) | [packages/menu/src/menu-items/util/drag-drop-helper.ts:63](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menu-items/util/drag-drop-helper.ts#L63) |

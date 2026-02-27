[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/util/EditDialog](../README.md) / PmDialogEventListener

# Interface: PmDialogEventListener

Defined in: [packages/menu/src/menu-items/util/EditDialog.ts:7](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menu-items/util/EditDialog.ts#L7)

Represents an event listener registered on a DOM element.
Used to track listeners for proper cleanup.

## Properties

| Property                                    | Type                      | Description                                                          | Defined in                                                                                                                                                                                  |
| ------------------------------------------- | ------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-element"></a> `element`     | `HTMLElement` \| `Window` | The element (window or HTMLElement) that the listener is attached to | [packages/menu/src/menu-items/util/EditDialog.ts:9](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menu-items/util/EditDialog.ts#L9)   |
| <a id="property-eventtype"></a> `eventType` | `string`                  | The type of event being listened to (e.g., 'click', 'keydown')       | [packages/menu/src/menu-items/util/EditDialog.ts:11](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menu-items/util/EditDialog.ts#L11) |
| <a id="property-listener"></a> `listener`   | `EventListener`           | The event listener function                                          | [packages/menu/src/menu-items/util/EditDialog.ts:13](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/menu/src/menu-items/util/EditDialog.ts#L13) |

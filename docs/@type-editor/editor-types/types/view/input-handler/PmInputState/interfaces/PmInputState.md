[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/view/input-handler/PmInputState](../README.md) / PmInputState

# Interface: PmInputState

Defined in: [packages/editor-types/src/types/view/input-handler/PmInputState.ts:5](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L5)

## Properties

| Property                                                                        | Type                                                                                        | Defined in                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-altkey"></a> `altKey`                                           | `boolean`                                                                                   | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:8](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L8)   |
| <a id="property-composing"></a> `composing`                                     | `boolean`                                                                                   | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:22](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L22) |
| <a id="property-composingtimeout"></a> `composingTimeout`                       | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:24](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L24) |
| <a id="property-compositionendedat"></a> `compositionEndedAt`                   | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:26](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L26) |
| <a id="property-compositionid"></a> `compositionID`                             | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:27](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L27) |
| <a id="property-compositionnode"></a> `compositionNode`                         | `Text`                                                                                      | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:23](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L23) |
| <a id="property-compositionnodes"></a> `compositionNodes`                       | [`PmViewDesc`](../../../view-desc/PmViewDesc/interfaces/PmViewDesc.md)[]                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:25](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L25) |
| <a id="property-compositionpendingchanges"></a> `compositionPendingChanges`     | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:28](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L28) |
| <a id="property-ctlkey"></a> `ctlKey`                                           | `boolean`                                                                                   | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:7](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L7)   |
| <a id="property-domchangecount"></a> `domChangeCount`                           | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:29](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L29) |
| <a id="property-hideselectionguard"></a> `hideSelectionGuard`                   | () => `void`                                                                                | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:30](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L30) |
| <a id="property-lastchromedelete"></a> `lastChromeDelete`                       | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:21](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L21) |
| <a id="property-lastclick"></a> `lastClick`                                     | \{ `button`: `number`; `time`: `number`; `type`: `string`; `x`: `number`; `y`: `number`; \} | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:14](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L14) |
| `lastClick.button`                                                              | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:14](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L14) |
| `lastClick.time`                                                                | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:14](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L14) |
| `lastClick.type`                                                                | `string`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:14](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L14) |
| `lastClick.x`                                                                   | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:14](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L14) |
| `lastClick.y`                                                                   | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:14](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L14) |
| <a id="property-lasteventtype"></a> `lastEventType`                             | `string`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:31](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L31) |
| <a id="property-lastfocus"></a> `lastFocus`                                     | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:19](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L19) |
| <a id="property-lastiosenter"></a> `lastIOSEnter`                               | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:17](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L17) |
| <a id="property-lastiosenterfallbacktimeout"></a> `lastIOSEnterFallbackTimeout` | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:18](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L18) |
| <a id="property-lastkey"></a> `lastKey`                                         | `string`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:12](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L12) |
| <a id="property-lastkeycode"></a> `lastKeyCode`                                 | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:11](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L11) |
| <a id="property-lastkeycodetime"></a> `lastKeyCodeTime`                         | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:13](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L13) |
| <a id="property-lastselectionorigin"></a> `lastSelectionOrigin`                 | `string`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:15](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L15) |
| <a id="property-lastselectiontime"></a> `lastSelectionTime`                     | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:16](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L16) |
| <a id="property-lasttouch"></a> `lastTouch`                                     | `number`                                                                                    | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:20](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L20) |
| <a id="property-metakey"></a> `metaKey`                                         | `boolean`                                                                                   | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:9](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L9)   |
| <a id="property-mousedown"></a> `mouseDown`                                     | [`PmMouseDown`](../../PmMouseDown/interfaces/PmMouseDown.md)                                | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:10](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L10) |
| <a id="property-shiftkey"></a> `shiftKey`                                       | `boolean`                                                                                   | [packages/editor-types/src/types/view/input-handler/PmInputState.ts:6](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L6)   |

## Methods

### destroyInput()

```ts
destroyInput(): void;
```

Defined in: [packages/editor-types/src/types/view/input-handler/PmInputState.ts:42](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L42)

Cleans up all input-related resources and event listeners when destroying a view.

#### Returns

`void`

---

### dispatchEvent()

```ts
dispatchEvent(event): void;
```

Defined in: [packages/editor-types/src/types/view/input-handler/PmInputState.ts:55](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L55)

Dispatches a DOM event to the appropriate handler. First checks custom
handlers, then falls back to default handlers if the view is editable.

#### Parameters

| Parameter | Type    | Description               |
| --------- | ------- | ------------------------- |
| `event`   | `Event` | The DOM event to dispatch |

#### Returns

`void`

---

### ensureListeners()

```ts
ensureListeners(): void;
```

Defined in: [packages/editor-types/src/types/view/input-handler/PmInputState.ts:48](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L48)

Ensures that any custom event handlers defined via handleDOMEvents prop
are properly registered on the editor's DOM element.

#### Returns

`void`

---

### initInput()

```ts
initInput(): void;
```

Defined in: [packages/editor-types/src/types/view/input-handler/PmInputState.ts:37](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmInputState.ts#L37)

Initializes input handling for an editor view by registering all necessary
event handlers on the editor's DOM element.

#### Returns

`void`

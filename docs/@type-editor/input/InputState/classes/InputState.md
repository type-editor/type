[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/input](../../README.md) / [InputState](../README.md) / InputState

# Class: InputState

Defined in: [InputState.ts:32](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L32)

Tracks the current input state of the editor, including keyboard, mouse,
composition events, and selection state.

## Implements

- `PmInputState`

## Constructors

### Constructor

```ts
new InputState(view): InputState;
```

Defined in: [InputState.ts:134](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L134)

#### Parameters

| Parameter | Type           |
| --------- | -------------- |
| `view`    | `PmEditorView` |

#### Returns

`InputState`

## Properties

| Property                                                                        | Modifier   | Type                                                                                        | Default value               | Description                                                              | Defined in                                                                                                                                   |
| ------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-altkey"></a> `altKey`                                           | `public`   | `boolean`                                                                                   | `false`                     | -                                                                        | [InputState.ts:86](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L86)   |
| <a id="property-composing"></a> `composing`                                     | `public`   | `boolean`                                                                                   | `false`                     | Whether composition is currently in progress                             | [InputState.ts:114](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L114) |
| <a id="property-composingtimeout"></a> `composingTimeout`                       | `public`   | `number`                                                                                    | `-1`                        | Timeout ID for composition end detection                                 | [InputState.ts:118](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L118) |
| <a id="property-compositionendedat"></a> `compositionEndedAt`                   | `public`   | `number`                                                                                    | `COMPOSITION_ENDED_INITIAL` | Timestamp when composition ended (initialized to very negative value)    | [InputState.ts:122](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L122) |
| <a id="property-compositionid"></a> `compositionID`                             | `public`   | `number`                                                                                    | `1`                         | Incrementing ID for tracking composition sessions                        | [InputState.ts:124](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L124) |
| <a id="property-compositionnode"></a> `compositionNode`                         | `public`   | `Text`                                                                                      | `null`                      | The DOM text node currently being composed in                            | [InputState.ts:116](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L116) |
| <a id="property-compositionnodes"></a> `compositionNodes`                       | `readonly` | `ViewDesc`[]                                                                                | `[]`                        | List of view descriptors affected by current composition                 | [InputState.ts:120](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L120) |
| <a id="property-compositionpendingchanges"></a> `compositionPendingChanges`     | `public`   | `number`                                                                                    | `0`                         | Set to a composition ID when there are pending changes at compositionend | [InputState.ts:126](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L126) |
| <a id="property-ctlkey"></a> `ctlKey`                                           | `public`   | `boolean`                                                                                   | `false`                     | -                                                                        | [InputState.ts:85](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L85)   |
| <a id="property-domchangecount"></a> `domChangeCount`                           | `public`   | `number`                                                                                    | `0`                         | Counter for DOM changes, used to detect when changes occur               | [InputState.ts:128](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L128) |
| <a id="property-hideselectionguard"></a> `hideSelectionGuard`                   | `public`   | () => `void`                                                                                | `null`                      | Function to call to remove the selection hiding guard                    | [InputState.ts:130](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L130) |
| <a id="property-lastchromedelete"></a> `lastChromeDelete`                       | `public`   | `number`                                                                                    | `0`                         | Timestamp of last Chrome delete operation                                | [InputState.ts:112](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L112) |
| <a id="property-lastclick"></a> `lastClick`                                     | `public`   | \{ `button`: `number`; `time`: `number`; `type`: `string`; `x`: `number`; `y`: `number`; \} | `undefined`                 | Information about the last click event for double/triple click detection | [InputState.ts:98](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L98)   |
| `lastClick.button`                                                              | `public`   | `number`                                                                                    | `0`                         | -                                                                        | [InputState.ts:98](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L98)   |
| `lastClick.time`                                                                | `public`   | `number`                                                                                    | `0`                         | -                                                                        | [InputState.ts:98](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L98)   |
| `lastClick.type`                                                                | `public`   | `string`                                                                                    | `''`                        | -                                                                        | [InputState.ts:98](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L98)   |
| `lastClick.x`                                                                   | `public`   | `number`                                                                                    | `0`                         | -                                                                        | [InputState.ts:98](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L98)   |
| `lastClick.y`                                                                   | `public`   | `number`                                                                                    | `0`                         | -                                                                        | [InputState.ts:98](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L98)   |
| <a id="property-lasteventtype"></a> `lastEventType`                             | `public`   | `string`                                                                                    | `null`                      | The type of the last event processed                                     | [InputState.ts:132](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L132) |
| <a id="property-lastfocus"></a> `lastFocus`                                     | `public`   | `number`                                                                                    | `0`                         | Timestamp of last focus event                                            | [InputState.ts:108](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L108) |
| <a id="property-lastiosenter"></a> `lastIOSEnter`                               | `public`   | `number`                                                                                    | `0`                         | Timestamp of last Enter key press on iOS                                 | [InputState.ts:104](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L104) |
| <a id="property-lastiosenterfallbacktimeout"></a> `lastIOSEnterFallbackTimeout` | `public`   | `number`                                                                                    | `-1`                        | Timeout ID for iOS Enter key fallback handling                           | [InputState.ts:106](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L106) |
| <a id="property-lastkey"></a> `lastKey`                                         | `public`   | `string`                                                                                    | `null`                      | The last key that was pressed                                            | [InputState.ts:94](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L94)   |
| <a id="property-lastkeycode"></a> `lastKeyCode`                                 | `public`   | `number`                                                                                    | `null`                      | @deprecated('Use lastKey instead')                                       | [InputState.ts:92](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L92)   |
| <a id="property-lastkeycodetime"></a> `lastKeyCodeTime`                         | `public`   | `number`                                                                                    | `0`                         | Timestamp of the last keydown event                                      | [InputState.ts:96](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L96)   |
| <a id="property-lastselectionorigin"></a> `lastSelectionOrigin`                 | `public`   | `string`                                                                                    | `null`                      | Origin of the last selection change (e.g., 'key', 'pointer')             | [InputState.ts:100](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L100) |
| <a id="property-lastselectiontime"></a> `lastSelectionTime`                     | `public`   | `number`                                                                                    | `0`                         | Timestamp of the last selection change                                   | [InputState.ts:102](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L102) |
| <a id="property-lasttouch"></a> `lastTouch`                                     | `public`   | `number`                                                                                    | `0`                         | Timestamp of last touch event                                            | [InputState.ts:110](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L110) |
| <a id="property-metakey"></a> `metaKey`                                         | `public`   | `boolean`                                                                                   | `false`                     | -                                                                        | [InputState.ts:87](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L87)   |
| <a id="property-mousedown"></a> `mouseDown`                                     | `public`   | [`MouseDown`](../../input-handler/mouse/MouseDown/classes/MouseDown.md)                     | `null`                      | Current mouse down operation, if any                                     | [InputState.ts:89](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L89)   |
| <a id="property-shiftkey"></a> `shiftKey`                                       | `public`   | `boolean`                                                                                   | `false`                     | Whether the Shift key is currently pressed                               | [InputState.ts:84](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L84)   |

## Methods

### destroyInput()

```ts
destroyInput(): void;
```

Defined in: [InputState.ts:180](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L180)

Cleans up all input-related resources and event listeners when destroying a view.

#### Returns

`void`

#### Implementation of

```ts
PmInputState.destroyInput;
```

---

### dispatchEvent()

```ts
dispatchEvent(event): void;
```

Defined in: [InputState.ts:213](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L213)

Dispatches a DOM event to the appropriate handler. First checks custom
handlers, then falls back to default handlers if the view is editable.

#### Parameters

| Parameter | Type    | Description               |
| --------- | ------- | ------------------------- |
| `event`   | `Event` | The DOM event to dispatch |

#### Returns

`void`

#### Implementation of

```ts
PmInputState.dispatchEvent;
```

---

### ensureListeners()

```ts
ensureListeners(): void;
```

Defined in: [InputState.ts:193](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L193)

Ensures that any custom event handlers defined via handleDOMEvents prop
are properly registered on the editor's DOM element.

#### Returns

`void`

#### Implementation of

```ts
PmInputState.ensureListeners;
```

---

### initInput()

```ts
initInput(): void;
```

Defined in: [InputState.ts:142](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/InputState.ts#L142)

Initializes input handling for an editor view by registering all necessary
event handlers on the editor's DOM element.

#### Returns

`void`

#### Implementation of

```ts
PmInputState.initInput;
```

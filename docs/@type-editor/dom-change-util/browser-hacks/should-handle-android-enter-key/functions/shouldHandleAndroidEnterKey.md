[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [browser-hacks/should-handle-android-enter-key](../README.md) / shouldHandleAndroidEnterKey

# Function: shouldHandleAndroidEnterKey()

```ts
function shouldHandleAndroidEnterKey(view): boolean;
```

Defined in: [browser-hacks/should-handle-android-enter-key.ts:29](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/dom-change-util/src/dom-change/browser-hacks/should-handle-android-enter-key.ts#L29)

Checks if an Android Chrome Enter key event should be handled.

Android Chrome has timing-related quirks with Enter key handling. This function
checks if the conditions match an Android Chrome Enter key press that should
be handled through the key handler rather than as a DOM change.

The check verifies:

- Running on Chrome for Android
- Last key pressed was Enter (key code 13)
- The Enter key was pressed recently (within threshold)
- A handleKeyDown plugin accepts the Enter key event

## Parameters

| Parameter | Type           | Description                                                |
| --------- | -------------- | ---------------------------------------------------------- |
| `view`    | `PmEditorView` | The editor view containing input state and plugin handlers |

## Returns

`boolean`

True if the Enter key handler was invoked and handled the event,
false if the event should be processed as a DOM change

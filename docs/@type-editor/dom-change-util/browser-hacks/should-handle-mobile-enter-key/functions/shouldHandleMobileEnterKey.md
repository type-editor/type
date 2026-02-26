[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [browser-hacks/should-handle-mobile-enter-key](../README.md) / shouldHandleMobileEnterKey

# Function: shouldHandleMobileEnterKey()

```ts
function shouldHandleMobileEnterKey(view, addedNodes, change): boolean;
```

Defined in: [browser-hacks/should-handle-mobile-enter-key.ts:40](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/dom-change-util/src/dom-change/browser-hacks/should-handle-mobile-enter-key.ts#L40)

Checks if a mobile Enter key should be handled instead of processing the DOM change.

Mobile browsers (iOS and Android) sometimes handle Enter key presses in ways that
are better processed through the key handler than as DOM changes. This function
detects such cases by checking:

1. The platform is iOS (with recent Enter) or Android
2. Block-level nodes (DIV, P, etc.) were added to the DOM
3. No content change was detected, or content was deleted

When all conditions are met, the Enter key is dispatched through the handleKeyDown
plugin system instead of processing the DOM change directly.

## Parameters

| Parameter    | Type                                                                                      | Description                                                                                                |
| ------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `view`       | `PmEditorView`                                                                            | The editor view containing input state and plugin handlers                                                 |
| `addedNodes` | readonly `Node`[]                                                                         | Nodes that were added to the DOM during the mutation. Used to detect if block-level elements were created. |
| `change`     | [`DocumentChange`](../../../types/dom-change/DocumentChange/interfaces/DocumentChange.md) | The detected document change, if any. Null if no change detected.                                          |

## Returns

`boolean`

True if the Enter key handler was invoked and the event should be
handled that way, false if the DOM change should be processed normally

## Remarks

Uses a regex to detect inline vs block-level HTML elements

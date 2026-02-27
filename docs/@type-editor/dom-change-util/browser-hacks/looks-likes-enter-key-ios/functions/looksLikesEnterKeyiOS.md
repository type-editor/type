[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [browser-hacks/looks-likes-enter-key-ios](../README.md) / looksLikesEnterKeyiOS

# Function: looksLikesEnterKeyiOS()

```ts
function looksLikesEnterKeyiOS(view, inlineChange, addedNodes): boolean;
```

Defined in: [browser-hacks/looks-likes-enter-key-ios.ts:23](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/dom-change-util/src/dom-change/browser-hacks/looks-likes-enter-key-ios.ts#L23)

Checks if the change looks like the effect of pressing the Enter key.

Sometimes it's better to handle block creation through the Enter key handler
rather than as a DOM change. This function detects those cases for iOS:

**iOS Enter Detection:**
iOS specifically tracks Enter key presses. If a recent Enter was detected
and either the change is not inline or block elements (DIV/P) were added,
treat it as an Enter key press.

## Parameters

| Parameter      | Type              | Description                                                  |
| -------------- | ----------------- | ------------------------------------------------------------ |
| `view`         | `PmEditorView`    | The editor view containing input state and plugin handlers   |
| `inlineChange` | `boolean`         | Whether the change is within inline content (vs block-level) |
| `addedNodes`   | readonly `Node`[] | Array of DOM nodes that were added during the mutation       |

## Returns

`boolean`

True if the change looks like Enter and a key handler accepted it,
false if the change should be processed as a normal DOM change

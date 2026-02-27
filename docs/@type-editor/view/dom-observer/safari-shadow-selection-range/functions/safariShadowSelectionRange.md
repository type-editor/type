[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/view](../../../README.md) / [dom-observer/safari-shadow-selection-range](../README.md) / safariShadowSelectionRange

# Function: safariShadowSelectionRange()

```ts
function safariShadowSelectionRange(view, selection): DOMSelectionRange;
```

Defined in: [dom-observer/safari-shadow-selection-range.ts:19](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/view/src/dom-observer/safari-shadow-selection-range.ts#L19)

Workaround for Safari Selection/shadow DOM bug.
Safari (at least in 2018-2022) doesn't provide regular access to the selection
inside a shadowRoot, so we use execCommand to trigger a beforeInput event
that gives us access to the selection range.

Based on https://github.com/codemirror/dev/issues/414 fix.

## Parameters

| Parameter   | Type                                                      | Description                     |
| ----------- | --------------------------------------------------------- | ------------------------------- |
| `view`      | [`EditorView`](../../../EditorView/classes/EditorView.md) | The editor view                 |
| `selection` | `Selection`                                               | The native DOM selection object |

## Returns

`DOMSelectionRange`

A DOMSelectionRange or null if the selection couldn't be determined

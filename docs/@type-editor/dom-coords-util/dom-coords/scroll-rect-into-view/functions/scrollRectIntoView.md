[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-coords-util](../../../README.md) / [dom-coords/scroll-rect-into-view](../README.md) / scrollRectIntoView

# Function: scrollRectIntoView()

```ts
function scrollRectIntoView(view, rect, startDOM): void;
```

Defined in: [dom-coords/scroll-rect-into-view.ts:19](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/dom-coords-util/src/dom-coords/scroll-rect-into-view.ts#L19)

Scroll the given rectangle into view within the editor, walking up through
scrollable ancestors and adjusting scroll positions as needed.

## Parameters

| Parameter  | Type                                                        | Description                                  |
| ---------- | ----------------------------------------------------------- | -------------------------------------------- |
| `view`     | `PmEditorView`                                              | The editor view                              |
| `rect`     | [`Rect`](../../../types/dom-coords/Rect/interfaces/Rect.md) | The rectangle to scroll into view            |
| `startDOM` | `Node`                                                      | The starting DOM node (defaults to view.dom) |

## Returns

`void`

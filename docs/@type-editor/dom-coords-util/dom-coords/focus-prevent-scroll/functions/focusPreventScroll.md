[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-coords-util](../../../README.md) / [dom-coords/focus-prevent-scroll](../README.md) / focusPreventScroll

# Function: focusPreventScroll()

```ts
function focusPreventScroll(dom): void;
```

Defined in: [dom-coords/focus-prevent-scroll.ts:16](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/dom-coords-util/src/dom-coords/focus-prevent-scroll.ts#L16)

Feature-detects support for .focus(\{preventScroll: true\}), and uses
a fallback kludge when not supported. This prevents the browser from
scrolling the focused element into view.

## Parameters

| Parameter | Type          | Description                                 |
| --------- | ------------- | ------------------------------------------- |
| `dom`     | `HTMLElement` | The HTML element to focus without scrolling |

## Returns

`void`

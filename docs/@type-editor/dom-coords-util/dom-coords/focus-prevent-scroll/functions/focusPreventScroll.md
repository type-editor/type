[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-coords-util](../../../README.md) / [dom-coords/focus-prevent-scroll](../README.md) / focusPreventScroll

# Function: focusPreventScroll()

```ts
function focusPreventScroll(dom): void;
```

Defined in: [dom-coords/focus-prevent-scroll.ts:16](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/dom-coords-util/src/dom-coords/focus-prevent-scroll.ts#L16)

Feature-detects support for .focus(\{preventScroll: true\}), and uses
a fallback kludge when not supported. This prevents the browser from
scrolling the focused element into view.

## Parameters

| Parameter | Type          | Description                                 |
| --------- | ------------- | ------------------------------------------- |
| `dom`     | `HTMLElement` | The HTML element to focus without scrolling |

## Returns

`void`

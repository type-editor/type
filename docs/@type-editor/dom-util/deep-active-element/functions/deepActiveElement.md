[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-util](../../README.md) / [deep-active-element](../README.md) / deepActiveElement

# Function: deepActiveElement()

```ts
function deepActiveElement(doc): Element;
```

Defined in: [deep-active-element.ts:18](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/dom-util/src/dom/deep-active-element.ts#L18)

Gets the deeply nested active element, traversing through Shadow DOM boundaries.

This function recursively descends into shadow roots to find the actual
focused element, even when it's nested within multiple levels of Shadow DOM.

## Parameters

| Parameter | Type       | Description                                 |
| --------- | ---------- | ------------------------------------------- |
| `doc`     | `Document` | The document to get the active element from |

## Returns

`Element`

The deeply nested active element, or null if no element is focused

## Example

```typescript
const focusedElement = deepActiveElement(document);
if (focusedElement) {
  console.log("Actually focused element:", focusedElement);
}
```

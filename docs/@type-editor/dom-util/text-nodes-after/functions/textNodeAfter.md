[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-util](../../README.md) / [text-nodes-after](../README.md) / textNodeAfter

# Function: textNodeAfter()

```ts
function textNodeAfter(node, offset): Text;
```

Defined in: [text-nodes-after.ts:22](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/dom-util/src/dom/text-nodes-after.ts#L22)

Finds the text node after a given position in the DOM tree.

Traverses the DOM tree forward from the given position to find the nearest
following text node. Stops at non-editable elements and block boundaries.

## Parameters

| Parameter | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `node`    | `Node`   | The starting DOM node               |
| `offset`  | `number` | The offset within the starting node |

## Returns

`Text`

The text node after the position, or null if none exists

## Example

```typescript
const element = document.getElementById("myElement");
const textNode = textNodeAfter(element, 0);
```

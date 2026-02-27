[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-util](../../README.md) / [text-node-before](../README.md) / textNodeBefore

# Function: textNodeBefore()

```ts
function textNodeBefore(node, offset): Text;
```

Defined in: [text-node-before.ts:23](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/dom-util/src/dom/text-node-before.ts#L23)

Finds the text node before a given position in the DOM tree.

Traverses the DOM tree backward from the given position to find the nearest
preceding text node. Stops at non-editable elements and block boundaries.

## Parameters

| Parameter | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `node`    | `Node`   | The starting DOM node               |
| `offset`  | `number` | The offset within the starting node |

## Returns

`Text`

The text node before the position, or null if none exists

## Example

```typescript
const element = document.getElementById("myElement");
const textNode = textNodeBefore(element, 1);
```

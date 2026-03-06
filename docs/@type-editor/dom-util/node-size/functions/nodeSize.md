[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-util](../../README.md) / [node-size](../README.md) / nodeSize

# Function: nodeSize()

```ts
function nodeSize(node): number;
```

Defined in: [node-size.ts:22](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/dom-util/src/dom/node-size.ts#L22)

Gets the size of a DOM node.

For text nodes (nodeType 3), returns the length of the text content.
For element nodes, returns the number of child nodes.

## Parameters

| Parameter | Type   | Description             |
| --------- | ------ | ----------------------- |
| `node`    | `Node` | The DOM node to measure |

## Returns

`number`

The size of the node (text length or child count)

## Example

```typescript
const textNode = document.createTextNode("Hello");
const size = nodeSize(textNode); // Returns 5

const element = document.createElement("div");
element.appendChild(document.createElement("span"));
const elemSize = nodeSize(element); // Returns 1
```

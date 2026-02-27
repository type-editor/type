[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-util](../../README.md) / [is-equivalent-position](../README.md) / isEquivalentPosition

# Function: isEquivalentPosition()

```ts
function isEquivalentPosition(node, off, targetNode, targetOff): boolean;
```

Defined in: [is-equivalent-position.ts:39](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/dom-util/src/dom/is-equivalent-position.ts#L39)

Checks if two DOM positions are equivalent.

Scans forward and backward through DOM positions to determine if two positions
refer to the same location in the document. This is useful for handling cases
like a position after a text node vs. at the end of that text node.

## Parameters

| Parameter    | Type     | Description                            |
| ------------ | -------- | -------------------------------------- |
| `node`       | `Node`   | The starting DOM node                  |
| `off`        | `number` | The offset within the starting node    |
| `targetNode` | `Node`   | The target DOM node to compare against |
| `targetOff`  | `number` | The offset within the target node      |

## Returns

`boolean`

True if the positions are equivalent, false otherwise

## Example

```typescript
const textNode = document.createTextNode("Hello");
const parent = textNode.parentNode;
// Position after text node vs. at end of text node
const equivalent = isEquivalentPosition(parent, 1, textNode, 5);
```

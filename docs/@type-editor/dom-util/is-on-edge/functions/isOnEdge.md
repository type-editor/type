[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-util](../../README.md) / [is-on-edge](../README.md) / isOnEdge

# Function: isOnEdge()

```ts
function isOnEdge(node, offset, parent): boolean;
```

Defined in: [is-on-edge.ts:22](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/dom-util/src/dom/is-on-edge.ts#L22)

Checks if a position is at the start or end edge of a parent node.

Traverses up the DOM tree from the given position to determine if it represents
the very beginning or end of the parent node's content.

## Parameters

| Parameter | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| `node`    | `Node`   | The starting DOM node               |
| `offset`  | `number` | The offset within the starting node |
| `parent`  | `Node`   | The parent node to check against    |

## Returns

`boolean`

True if the position is at the edge of the parent, false otherwise

## Example

```typescript
const textNode = document.createTextNode("Hello");
const parent = textNode.parentNode;
const isEdge = isOnEdge(textNode, 0, parent); // True if at start
```

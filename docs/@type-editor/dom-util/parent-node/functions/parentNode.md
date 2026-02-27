[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-util](../../README.md) / [parent-node](../README.md) / parentNode

# Function: parentNode()

```ts
function parentNode(node): Node;
```

Defined in: [parent-node.ts:20](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/dom-util/src/dom/parent-node.ts#L20)

Gets the parent node of a DOM node, accounting for Shadow DOM and slot assignments.

This function handles special cases:

- If the node is slotted, returns the assigned slot
- If the parent is a DocumentFragment (nodeType 11), returns the shadow root host
- Otherwise returns the regular parent node

## Parameters

| Parameter | Type   | Description                           |
| --------- | ------ | ------------------------------------- |
| `node`    | `Node` | The DOM node whose parent to retrieve |

## Returns

`Node`

The parent node, or null if none exists

## Example

```typescript
const element = document.getElementById("myElement");
const parent = parentNode(element);
```

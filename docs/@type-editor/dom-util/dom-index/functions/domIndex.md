[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-util](../../README.md) / [dom-index](../README.md) / domIndex

# Function: domIndex()

```ts
function domIndex(node): number;
```

Defined in: [dom-index.ts:13](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/dom-util/src/dom/dom-index.ts#L13)

Gets the index of a DOM node within its parent's child list.

## Parameters

| Parameter | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| `node`    | `Node` | The DOM node to find the index of |

## Returns

`number`

The zero-based index of the node among its siblings

## Example

```typescript
const element = document.getElementById("myElement");
const index = domIndex(element); // Returns position among siblings
```

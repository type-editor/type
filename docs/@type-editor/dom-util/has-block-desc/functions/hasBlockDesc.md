[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-util](../../README.md) / [has-block-desc](../README.md) / hasBlockDesc

# Function: hasBlockDesc()

```ts
function hasBlockDesc(dom): boolean;
```

Defined in: [has-block-desc.ts:19](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/dom-util/src/dom/has-block-desc.ts#L19)

Checks if a DOM node has a block-level ViewDesc associated with it.

Traverses up the DOM tree to find a ViewDesc, then checks if it represents
a block node and if the original DOM node is either the main DOM or content DOM
of that ViewDesc.

## Parameters

| Parameter | Type   | Description           |
| --------- | ------ | --------------------- |
| `dom`     | `Node` | The DOM node to check |

## Returns

`boolean`

True if the node has a block ViewDesc, false otherwise

## Example

```typescript
const paragraph = document.querySelector("p");
const isBlock = hasBlockDesc(paragraph);
```

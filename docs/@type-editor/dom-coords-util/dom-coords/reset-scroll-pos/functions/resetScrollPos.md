[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-coords-util](../../../README.md) / [dom-coords/reset-scroll-pos](../README.md) / resetScrollPos

# Function: resetScrollPos()

```ts
function resetScrollPos(params): void;
```

Defined in: [dom-coords/reset-scroll-pos.ts:15](https://github.com/type-editor/type/blob/aa914636446ba41d4acaa23bd67323cc71b1ac08/packages/dom-coords-util/src/dom-coords/reset-scroll-pos.ts#L15)

Reset the scroll position of the editor's parent nodes to what
it was before, when storeScrollPos was called. This maintains viewport
stability when content above the viewport changes.

## Parameters

| Parameter | Type                                                                                         | Description                            |
| --------- | -------------------------------------------------------------------------------------------- | -------------------------------------- |
| `params`  | [`StoredScrollPos`](../../../types/dom-coords/StoredScrollPos/interfaces/StoredScrollPos.md) | Object containing scroll position data |

## Returns

`void`

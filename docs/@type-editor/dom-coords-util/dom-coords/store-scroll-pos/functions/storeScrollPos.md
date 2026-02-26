[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-coords-util](../../../README.md) / [dom-coords/store-scroll-pos](../README.md) / storeScrollPos

# Function: storeScrollPos()

```ts
function storeScrollPos(view): StoredScrollPos;
```

Defined in: [dom-coords/store-scroll-pos.ts:20](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/dom-coords-util/src/dom-coords/store-scroll-pos.ts#L20)

Store the scroll position of the editor's parent nodes, along with
the top position of an element near the top of the editor, which
will be used to make sure the visible viewport remains stable even
when the size of the content above changes.

## Parameters

| Parameter | Type           | Description                                  |
| --------- | -------------- | -------------------------------------------- |
| `view`    | `PmEditorView` | The editor view to store scroll position for |

## Returns

[`StoredScrollPos`](../../../types/dom-coords/StoredScrollPos/interfaces/StoredScrollPos.md)

Object containing reference element info and scroll stack

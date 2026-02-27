[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/dom-change-util](../../../../README.md) / [types/dom-change/DocumentChange](../README.md) / DocumentChange

# Interface: DocumentChange

Defined in: [types/dom-change/DocumentChange.ts:19](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/dom-change-util/src/dom-change/types/dom-change/DocumentChange.ts#L19)

Represents a change detected in the document by comparing old and new content.

This interface describes the positions where content has changed, with
separate end positions for the old document (endA) and new document (endB).

DocumentChange

## Example

```typescript
// User types "x" at position 5
const change: DocumentChange = {
  start: 5, // Change starts at position 5
  endA: 5, // Old document ends at 5 (nothing was there)
  endB: 6, // New document ends at 6 (one char added)
};
```

## Properties

| Property                            | Type     | Description                                                                            | Defined in                                                                                                                                                                                                |
| ----------------------------------- | -------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-enda"></a> `endA`   | `number` | End position in the old (previous) document. If endA \> start, content was deleted.    | [types/dom-change/DocumentChange.ts:30](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/dom-change-util/src/dom-change/types/dom-change/DocumentChange.ts#L30) |
| <a id="property-endb"></a> `endB`   | `number` | End position in the new (current) document. If endB \> start, content was inserted.    | [types/dom-change/DocumentChange.ts:36](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/dom-change-util/src/dom-change/types/dom-change/DocumentChange.ts#L36) |
| <a id="property-start"></a> `start` | `number` | Start position of the change in the document. This is where the changed region begins. | [types/dom-change/DocumentChange.ts:24](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/dom-change-util/src/dom-change/types/dom-change/DocumentChange.ts#L24) |

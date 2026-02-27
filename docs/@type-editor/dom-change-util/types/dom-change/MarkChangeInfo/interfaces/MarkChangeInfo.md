[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/dom-change-util](../../../../README.md) / [types/dom-change/MarkChangeInfo](../README.md) / MarkChangeInfo

# Interface: MarkChangeInfo

Defined in: [types/dom-change/MarkChangeInfo.ts:20](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/dom-change-util/src/dom-change/types/dom-change/MarkChangeInfo.ts#L20)

Represents a mark change operation (adding or removing a mark).

This interface is used to optimize mark changes by detecting when
a change is simply adding or removing a single mark type (like bold
or italic) rather than changing the actual text content.

MarkChangeInfo

## Example

```typescript
// User presses Ctrl+B to make text bold
const markChange: MarkChangeInfo = {
  mark: schema.marks.strong.create(),
  type: "add",
};
```

## Properties

| Property                          | Type                  | Description                                                                                                                 | Defined in                                                                                                                                                                                                |
| --------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-mark"></a> `mark` | `Mark`                | The mark that was added to or removed from the content. This is a ProseMirror Mark instance.                                | [types/dom-change/MarkChangeInfo.ts:25](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/dom-change-util/src/dom-change/types/dom-change/MarkChangeInfo.ts#L25) |
| <a id="property-type"></a> `type` | `"add"` \| `"remove"` | Type of mark change operation. - 'add': The mark was added to the content - 'remove': The mark was removed from the content | [types/dom-change/MarkChangeInfo.ts:32](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/dom-change-util/src/dom-change/types/dom-change/MarkChangeInfo.ts#L32) |

[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/view/view-desc/ViewMutationRecord](../README.md) / ViewMutationRecord

# Type Alias: ViewMutationRecord

```ts
type ViewMutationRecord =
  | MutationRecord
  | {
      target: Node;
      type: "selection";
    };
```

Defined in: [packages/editor-types/src/types/view/view-desc/ViewMutationRecord.ts:8](https://github.com/type-editor/type/blob/70862bf5e8a5266dfb443941f265014c48842b41/packages/editor-types/src/types/view/view-desc/ViewMutationRecord.ts#L8)

A ViewMutationRecord represents a DOM
[mutation](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
or a selection change happens within the view. When the change is
a selection change, the record will have a `type` property of
`'selection'` (which doesn't occur for native mutation records).

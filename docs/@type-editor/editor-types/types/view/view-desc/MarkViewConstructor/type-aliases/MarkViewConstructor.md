[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/view/view-desc/MarkViewConstructor](../README.md) / MarkViewConstructor

# Type Alias: MarkViewConstructor()

```ts
type MarkViewConstructor = (mark, view, inline) => MarkView;
```

Defined in: [packages/editor-types/src/types/view/view-desc/MarkViewConstructor.ts:10](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/view-desc/MarkViewConstructor.ts#L10)

The function types [used](#view.EditorProps.markViews) to create
mark views.

## Parameters

| Parameter | Type                                                               |
| --------- | ------------------------------------------------------------------ |
| `mark`    | `Mark`                                                             |
| `view`    | [`PmEditorView`](../../../PmEditorView/interfaces/PmEditorView.md) |
| `inline`  | `boolean`                                                          |

## Returns

[`MarkView`](../../MarkView/interfaces/MarkView.md)

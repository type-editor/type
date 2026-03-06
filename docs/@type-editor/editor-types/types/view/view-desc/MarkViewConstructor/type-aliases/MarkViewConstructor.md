[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/view/view-desc/MarkViewConstructor](../README.md) / MarkViewConstructor

# Type Alias: MarkViewConstructor()

```ts
type MarkViewConstructor = (mark, view, inline) => MarkView;
```

Defined in: [packages/editor-types/src/types/view/view-desc/MarkViewConstructor.ts:10](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/editor-types/src/types/view/view-desc/MarkViewConstructor.ts#L10)

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

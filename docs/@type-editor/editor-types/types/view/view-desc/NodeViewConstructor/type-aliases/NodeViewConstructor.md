[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/view/view-desc/NodeViewConstructor](../README.md) / NodeViewConstructor

# Type Alias: NodeViewConstructor()

```ts
type NodeViewConstructor = (
  node,
  view,
  getPos,
  decorations,
  innerDecorations,
) => NodeView;
```

Defined in: [packages/editor-types/src/types/view/view-desc/NodeViewConstructor.ts:12](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/editor-types/src/types/view/view-desc/NodeViewConstructor.ts#L12)

The type of function [provided](#view.EditorProps.nodeViews) to
create [node views](#view.NodeView).

## Parameters

| Parameter          | Type                                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `node`             | `PmNode`                                                                                             |
| `view`             | [`PmEditorView`](../../../PmEditorView/interfaces/PmEditorView.md)                                   |
| `getPos`           | () => `number` \| `undefined`                                                                        |
| `decorations`      | `ReadonlyArray`&lt;[`PmDecoration`](../../../decoration/PmDecoration/interfaces/PmDecoration.md)&gt; |
| `innerDecorations` | [`DecorationSource`](../../../decoration/DecorationSource/interfaces/DecorationSource.md)            |

## Returns

[`NodeView`](../../NodeView/interfaces/NodeView.md)

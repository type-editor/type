[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/viewdesc](../../README.md) / [doc-view-desc](../README.md) / docViewDesc

# Function: docViewDesc()

```ts
function docViewDesc(doc, outerDeco, innerDeco, dom, view): NodeViewDesc;
```

Defined in: [doc-view-desc.ts:19](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/doc-view-desc.ts#L19)

Create a view desc for the top-level document node, to be exported
and used by the view class.

## Parameters

| Parameter   | Type                      | Description                                    |
| ----------- | ------------------------- | ---------------------------------------------- |
| `doc`       | `Node_2`                  | The document node                              |
| `outerDeco` | readonly `PmDecoration`[] | Outer decorations for the document             |
| `innerDeco` | `DecorationSource`        | Inner decorations for the document             |
| `dom`       | `HTMLElement`             | The DOM element that will contain the document |
| `view`      | `PmEditorView`            | The editor view                                |

## Returns

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md)

A NodeViewDesc for the document

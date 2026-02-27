[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/decoration](../../../README.md) / [decoration/view-decorations](../README.md) / viewDecorations

# Function: viewDecorations()

```ts
function viewDecorations(view): DecorationSource;
```

Defined in: [decoration/view-decorations.ts:20](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/decoration/src/decoration/view-decorations.ts#L20)

Get the decorations associated with the current props of a view.
This function collects decorations from all plugin decorations props
and the cursor wrapper if present.

This is called internally by the view to collect all decorations that
should be rendered. It aggregates decorations from:

- All plugins that provide a `decorations` prop
- The cursor wrapper (for gap cursor, etc.)

## Parameters

| Parameter | Type           | Description                            |
| --------- | -------------- | -------------------------------------- |
| `view`    | `PmEditorView` | The editor view to get decorations for |

## Returns

`DecorationSource`

A decoration source (DecorationSet or DecorationGroup) containing all active decorations

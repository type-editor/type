[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [clipboard/parse/create-code-block-slice](../README.md) / createCodeBlockSlice

# Function: createCodeBlockSlice()

```ts
function createCodeBlockSlice(view, text): Slice;
```

Defined in: [clipboard/parse/create-code-block-slice.ts:12](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/input/src/clipboard/parse/create-code-block-slice.ts#L12)

Create a slice from plain text for insertion into code blocks.
Normalizes line endings to Unix format (\n).

## Parameters

| Parameter | Type           | Description               |
| --------- | -------------- | ------------------------- |
| `view`    | `PmEditorView` | The editor view           |
| `text`    | `string`       | The plain text to convert |

## Returns

`Slice`

A slice containing the text as a single text node

[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [clipboard/parse/create-dom-from-plain-text](../README.md) / createDOMFromPlainText

# Function: createDOMFromPlainText()

```ts
function createDOMFromPlainText(_view, text, _$context): HTMLDivElement;
```

Defined in: [clipboard/parse/create-dom-from-plain-text.ts:21](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/clipboard/parse/create-dom-from-plain-text.ts#L21)

Create a DOM structure from plain text, splitting on line breaks
and creating paragraph elements. Applies current marks from context.

## Parameters

| Parameter   | Type           | Description                                   |
| ----------- | -------------- | --------------------------------------------- |
| `_view`     | `PmEditorView` | The editor view                               |
| `text`      | `string`       | The plain text to convert                     |
| `_$context` | `ResolvedPos`  | The resolved position providing current marks |

## Returns

`HTMLDivElement`

A div element containing paragraph elements

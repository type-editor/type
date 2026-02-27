[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [clipboard/parse/read-html](../README.md) / readHTML

# Function: readHTML()

```ts
function readHTML(html): HTMLDivElement;
```

Defined in: [clipboard/parse/read-html.ts:14](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/input/src/clipboard/parse/read-html.ts#L14)

Parse an HTML string into a detached DIV, applying necessary wrappers
for certain elements so innerHTML works across browsers.

## Parameters

| Parameter | Type     | Description              |
| --------- | -------- | ------------------------ |
| `html`    | `string` | The HTML string to parse |

## Returns

`HTMLDivElement`

A div element containing the parsed HTML

[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-util](../../README.md) / [text-range](../README.md) / textRange

# Function: textRange()

```ts
function textRange(node, from?, to?): Range;
```

Defined in: [text-range.ts:22](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/dom-util/src/dom/text-range.ts#L22)

Creates or reuses a DOM Range for a text node.

Note: This function always returns the same Range object for performance reasons.
DOM Range objects are expensive to create and can slow down subsequent DOM updates.
Call `clearReusedRange()` if you need to ensure the range is properly released.

## Parameters

| Parameter | Type     | Description                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| `node`    | `Text`   | The text node to create a range for                              |
| `from?`   | `number` | The starting offset within the text node (defaults to 0)         |
| `to?`     | `number` | The ending offset within the text node (defaults to node length) |

## Returns

`Range`

A DOM Range object spanning the specified text range

## Example

```typescript
const textNode = document.createTextNode("Hello World");
const range = textRange(textNode, 0, 5); // Selects "Hello"
```

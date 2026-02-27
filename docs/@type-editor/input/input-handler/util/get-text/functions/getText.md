[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/util/get-text](../README.md) / getText

# Function: getText()

```ts
function getText(clipboardData): string;
```

Defined in: [input-handler/util/get-text.ts:9](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/input/src/input-handler/util/get-text.ts#L9)

Extracts text content from clipboard data, falling back to URI list if
plain text is not available.

## Parameters

| Parameter       | Type           | Description                        |
| --------------- | -------------- | ---------------------------------- |
| `clipboardData` | `DataTransfer` | The clipboard data transfer object |

## Returns

`string`

The extracted text content

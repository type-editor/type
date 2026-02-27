[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [util/translate](../README.md) / translate

# Function: translate()

```ts
function translate(view, text): string;
```

Defined in: [packages/menu/src/util/translate.ts:10](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/menu/src/util/translate.ts#L10)

Translates a text string using the view's translation function if available.

## Parameters

| Parameter | Type           | Description                                           |
| --------- | -------------- | ----------------------------------------------------- |
| `view`    | `PmEditorView` | The editor view that may contain a translate function |
| `text`    | `string`       | The text to translate                                 |

## Returns

`string`

The translated text, or the original text if no translation function is available

[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/dom-change-util](../../../../README.md) / [types/dom-change/ParseBetweenResult](../README.md) / ParseBetweenResult

# Interface: ParseBetweenResult

Defined in: [types/dom-change/ParseBetweenResult.ts:17](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/dom-change-util/src/dom-change/types/dom-change/ParseBetweenResult.ts#L17)

Represents the result of parsing a DOM range into a ProseMirror document.

This interface encapsulates all information extracted from parsing a DOM
range, including the parsed document content and reconstructed selection state.

ParseBetweenResult

## Example

```typescript
const result = parseBetween(view, 0, 10);
console.log(result.doc); // Parsed ProseMirror node
console.log(result.sel); // { anchor: 5, head: 5 } or null
```

## Properties

| Property                          | Type                                        | Description                                                                                                                                           | Defined in                                                                                                                                                                                                        |
| --------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-doc"></a> `doc`   | `Node_2`                                    | The parsed document node containing the content from the DOM range. This is a ProseMirror Node that represents the parsed content.                    | [types/dom-change/ParseBetweenResult.ts:22](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/dom-change-util/src/dom-change/types/dom-change/ParseBetweenResult.ts#L22) |
| <a id="property-from"></a> `from` | `number`                                    | Start position in the document where parsing began. This is the absolute position in the full document.                                               | [types/dom-change/ParseBetweenResult.ts:34](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/dom-change-util/src/dom-change/types/dom-change/ParseBetweenResult.ts#L34) |
| <a id="property-sel"></a> `sel`   | \{ `anchor`: `number`; `head`: `number`; \} | The reconstructed selection information with anchor and head positions. Null if the selection could not be determined or is outside the parsed range. | [types/dom-change/ParseBetweenResult.ts:28](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/dom-change-util/src/dom-change/types/dom-change/ParseBetweenResult.ts#L28) |
| `sel.anchor`                      | `number`                                    | -                                                                                                                                                     | [types/dom-change/ParseBetweenResult.ts:28](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/dom-change-util/src/dom-change/types/dom-change/ParseBetweenResult.ts#L28) |
| `sel.head`                        | `number`                                    | -                                                                                                                                                     | [types/dom-change/ParseBetweenResult.ts:28](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/dom-change-util/src/dom-change/types/dom-change/ParseBetweenResult.ts#L28) |
| <a id="property-to"></a> `to`     | `number`                                    | End position in the document where parsing ended. This is the absolute position in the full document.                                                 | [types/dom-change/ParseBetweenResult.ts:40](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/dom-change-util/src/dom-change/types/dom-change/ParseBetweenResult.ts#L40) |

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/commands](../../../README.md) / [util/find-extended-mark-selection](../README.md) / ExtendedSelectionResult

# Interface: ExtendedSelectionResult

Defined in: [util/find-extended-mark-selection.ts:7](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commands/src/util/find-extended-mark-selection.ts#L7)

Result of attempting to find an extended selection for an empty selection.

## Properties

| Property                                   | Type      | Description                                               | Defined in                                                                                                                                                                                  |
| ------------------------------------------ | --------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-char"></a> `char?`         | `string`  | The character or text that would be selected              | [util/find-extended-mark-selection.ts:15](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commands/src/util/find-extended-mark-selection.ts#L15) |
| <a id="property-found"></a> `found`        | `boolean` | Whether a valid character was found for extension         | [util/find-extended-mark-selection.ts:9](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commands/src/util/find-extended-mark-selection.ts#L9)   |
| <a id="property-from"></a> `from`          | `number`  | The start position of the extended selection              | [util/find-extended-mark-selection.ts:11](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commands/src/util/find-extended-mark-selection.ts#L11) |
| <a id="property-frommark"></a> `fromMark?` | `boolean` | Whether the extended range was found via an existing mark | [util/find-extended-mark-selection.ts:17](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commands/src/util/find-extended-mark-selection.ts#L17) |
| <a id="property-to"></a> `to`              | `number`  | The end position of the extended selection                | [util/find-extended-mark-selection.ts:13](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commands/src/util/find-extended-mark-selection.ts#L13) |

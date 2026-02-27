[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/changeset](../../../README.md) / [types/ChangeJSON](../README.md) / ChangeJSON

# Interface: ChangeJSON&lt;Data&gt;

Defined in: [types/ChangeJSON.ts:10](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/changeset/src/types/ChangeJSON.ts#L10)

JSON-serializable representation of a Change.

Describes a change between two document versions (A and B), including
the affected ranges and the deleted/inserted content spans.

## Type Parameters

| Type Parameter | Description                                     |
| -------------- | ----------------------------------------------- |
| `Data`         | The type of metadata associated with each span. |

## Properties

| Property                                  | Type                                                 | Description                                               | Defined in                                                                                                                                                 |
| ----------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-deleted"></a> `deleted`   | readonly \{ `data`: `Data`; `length`: `number`; \}[] | The spans that were deleted from document A.              | [types/ChangeJSON.ts:20](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/changeset/src/types/ChangeJSON.ts#L20) |
| <a id="property-froma"></a> `fromA`       | `number`                                             | The start position in document A where the change begins. | [types/ChangeJSON.ts:12](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/changeset/src/types/ChangeJSON.ts#L12) |
| <a id="property-fromb"></a> `fromB`       | `number`                                             | The start position in document B where the change begins. | [types/ChangeJSON.ts:16](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/changeset/src/types/ChangeJSON.ts#L16) |
| <a id="property-inserted"></a> `inserted` | readonly \{ `data`: `Data`; `length`: `number`; \}[] | The spans that were inserted into document B.             | [types/ChangeJSON.ts:22](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/changeset/src/types/ChangeJSON.ts#L22) |
| <a id="property-toa"></a> `toA`           | `number`                                             | The end position in document A where the change ends.     | [types/ChangeJSON.ts:14](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/changeset/src/types/ChangeJSON.ts#L14) |
| <a id="property-tob"></a> `toB`           | `number`                                             | The end position in document B where the change ends.     | [types/ChangeJSON.ts:18](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/changeset/src/types/ChangeJSON.ts#L18) |

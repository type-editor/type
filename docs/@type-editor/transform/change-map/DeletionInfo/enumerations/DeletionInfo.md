[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-map/DeletionInfo](../README.md) / DeletionInfo

# Enumeration: DeletionInfo

Defined in: [packages/transform/src/change-map/DeletionInfo.ts:6](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-map/DeletionInfo.ts#L6)

Enum representing the type of deletion relative to a position.
Used internally to track what was deleted during mapping.

## Enumeration Members

| Enumeration Member                              | Value | Description                                            | Defined in                                                                                                                                                                                      |
| ----------------------------------------------- | ----- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="enumeration-member-across"></a> `ACROSS` | `4`   | Content both before and after the position was deleted | [packages/transform/src/change-map/DeletionInfo.ts:12](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-map/DeletionInfo.ts#L12) |
| <a id="enumeration-member-after"></a> `AFTER`   | `2`   | Content after the position was deleted                 | [packages/transform/src/change-map/DeletionInfo.ts:10](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-map/DeletionInfo.ts#L10) |
| <a id="enumeration-member-before"></a> `BEFORE` | `1`   | Content before the position was deleted                | [packages/transform/src/change-map/DeletionInfo.ts:8](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-map/DeletionInfo.ts#L8)   |
| <a id="enumeration-member-side"></a> `SIDE`     | `8`   | The position itself is on the deleted side             | [packages/transform/src/change-map/DeletionInfo.ts:14](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-map/DeletionInfo.ts#L14) |

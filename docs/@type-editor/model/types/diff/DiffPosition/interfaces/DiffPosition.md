[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [types/diff/DiffPosition](../README.md) / DiffPosition

# Interface: DiffPosition

Defined in: [packages/model/src/types/diff/DiffPosition.ts:8](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/diff/DiffPosition.ts#L8)

Represents a pair of positions in two different fragments.

This interface is used by diff functions to return corresponding positions
in two fragments being compared, typically indicating where differences occur.

## Properties

| Property                                  | Type     | Description                                                    | Defined in                                                                                                                                                                              |
| ----------------------------------------- | -------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-a"></a> ~~`a`~~           | `number` | Backwards compatibility **Deprecated** Use `selfPos` instead.  | [packages/model/src/types/diff/DiffPosition.ts:19](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/diff/DiffPosition.ts#L19) |
| <a id="property-b"></a> ~~`b`~~           | `number` | Backwards compatibility **Deprecated** Use `otherPos` instead. | [packages/model/src/types/diff/DiffPosition.ts:31](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/diff/DiffPosition.ts#L31) |
| <a id="property-otherpos"></a> `otherPos` | `number` | The position in the second (other) fragment.                   | [packages/model/src/types/diff/DiffPosition.ts:24](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/diff/DiffPosition.ts#L24) |
| <a id="property-selfpos"></a> `selfPos`   | `number` | The position in the first (self) fragment.                     | [packages/model/src/types/diff/DiffPosition.ts:12](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/diff/DiffPosition.ts#L12) |

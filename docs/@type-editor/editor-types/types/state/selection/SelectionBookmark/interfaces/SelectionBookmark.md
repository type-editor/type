[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/state/selection/SelectionBookmark](../README.md) / SelectionBookmark

# Interface: SelectionBookmark

Defined in: [packages/editor-types/src/types/state/selection/SelectionBookmark.ts:17](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/state/selection/SelectionBookmark.ts#L17)

A lightweight, document-independent representation of a selection.
You can define a custom bookmark type for a custom selection class
to make the history handle it well.

Bookmarks store selection positions as simple numbers rather than
resolved positions, making them suitable for persistence across
document changes. They can be mapped through document transformations
and then resolved back into full selections.

## Properties

| Property                                | Type                                                                    | Description                                                                                                                                                                                                   | Defined in                                                                                                                                                                                                                            |
| --------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-map"></a> `map`         | (`mapping`) => `SelectionBookmark`                                      | Map the bookmark through a set of changes. This updates the stored positions to reflect document transformations.                                                                                             | [packages/editor-types/src/types/state/selection/SelectionBookmark.ts:26](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/state/selection/SelectionBookmark.ts#L26) |
| <a id="property-resolve"></a> `resolve` | (`doc`) => [`PmSelection`](../../PmSelection/interfaces/PmSelection.md) | Resolve the bookmark to a real selection again. This may need to do some error checking and may fall back to a default (usually `EditorSelection.textSelectionBetween`) if mapping made the bookmark invalid. | [packages/editor-types/src/types/state/selection/SelectionBookmark.ts:38](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/state/selection/SelectionBookmark.ts#L38) |

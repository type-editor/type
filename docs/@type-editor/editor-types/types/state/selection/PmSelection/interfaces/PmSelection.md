[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/state/selection/PmSelection](../README.md) / PmSelection

# Interface: PmSelection

Defined in: [packages/editor-types/src/types/state/selection/PmSelection.ts:18](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L18)

Public interface for editor selections.
This is the main interface that external code interacts with,
typically through the EditorSelection class which implements it.

Selections represent the current user selection or cursor position
in the editor. They can be text selections (ranges of text), node
selections (single block nodes), or all-selections (entire document).

## Properties

| Property                                | Modifier   | Type                                                                                   | Description                                                            | Defined in                                                                                                                                                                                                                |
| --------------------------------------- | ---------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-anchor"></a> `$anchor`  | `readonly` | `ResolvedPos`                                                                          | The resolved anchor position (immobile end)                            | [packages/editor-types/src/types/state/selection/PmSelection.ts:24](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L24) |
| <a id="property-cursor"></a> `$cursor`  | `readonly` | `ResolvedPos`                                                                          | The cursor position if this is an empty text selection, null otherwise | [packages/editor-types/src/types/state/selection/PmSelection.ts:56](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L56) |
| <a id="property-from"></a> `$from`      | `readonly` | `ResolvedPos`                                                                          | The resolved lower bound of the main range                             | [packages/editor-types/src/types/state/selection/PmSelection.ts:42](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L42) |
| <a id="property-head"></a> `$head`      | `readonly` | `ResolvedPos`                                                                          | The resolved head position (mobile end)                                | [packages/editor-types/src/types/state/selection/PmSelection.ts:27](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L27) |
| <a id="property-to"></a> `$to`          | `readonly` | `ResolvedPos`                                                                          | The resolved upper bound of the main range                             | [packages/editor-types/src/types/state/selection/PmSelection.ts:45](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L45) |
| <a id="property-anchor-1"></a> `anchor` | `readonly` | `number`                                                                               | The anchor position as an integer offset                               | [packages/editor-types/src/types/state/selection/PmSelection.ts:30](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L30) |
| <a id="property-empty"></a> `empty`     | `readonly` | `boolean`                                                                              | Whether the selection is empty (contains no content)                   | [packages/editor-types/src/types/state/selection/PmSelection.ts:48](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L48) |
| <a id="property-from-1"></a> `from`     | `readonly` | `number`                                                                               | The lower bound of the main range                                      | [packages/editor-types/src/types/state/selection/PmSelection.ts:36](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L36) |
| <a id="property-head-1"></a> `head`     | `readonly` | `number`                                                                               | The head position as an integer offset                                 | [packages/editor-types/src/types/state/selection/PmSelection.ts:33](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L33) |
| <a id="property-node"></a> `node`       | `readonly` | `Node_2`                                                                               | The selected node if this is a node selection, null otherwise          | [packages/editor-types/src/types/state/selection/PmSelection.ts:59](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L59) |
| <a id="property-ranges"></a> `ranges`   | `readonly` | readonly [`PmSelectionRange`](../../PmSelectionRange/interfaces/PmSelectionRange.md)[] | The ranges covered by the selection                                    | [packages/editor-types/src/types/state/selection/PmSelection.ts:21](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L21) |
| <a id="property-to-1"></a> `to`         | `readonly` | `number`                                                                               | The upper bound of the main range                                      | [packages/editor-types/src/types/state/selection/PmSelection.ts:39](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L39) |
| <a id="property-type"></a> `type`       | `readonly` | `string`                                                                               | The type identifier for this selection.                                | [packages/editor-types/src/types/state/selection/PmSelection.ts:53](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L53) |
| <a id="property-visible"></a> `visible` | `public`   | `boolean`                                                                              | Whether the selection should be visible in the browser                 | [packages/editor-types/src/types/state/selection/PmSelection.ts:62](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L62) |

## Methods

### content()

```ts
content(): Slice;
```

Defined in: [packages/editor-types/src/types/state/selection/PmSelection.ts:109](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L109)

Get the content of this selection as a slice.
Extracts the document content within the selection's range.

#### Returns

`Slice`

A slice containing the selected content

---

### eq()

```ts
eq(selection): boolean;
```

Defined in: [packages/editor-types/src/types/state/selection/PmSelection.ts:91](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L91)

Test whether this selection is equal to another selection.

#### Parameters

| Parameter   | Type          | Description                   |
| ----------- | ------------- | ----------------------------- |
| `selection` | `PmSelection` | The selection to compare with |

#### Returns

`boolean`

True if the selections are equal

---

### getBookmark()

```ts
getBookmark(): SelectionBookmark;
```

Defined in: [packages/editor-types/src/types/state/selection/PmSelection.ts:124](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L124)

Create a bookmark for this selection.
The bookmark can be used to restore the selection after document changes.

#### Returns

[`SelectionBookmark`](../../SelectionBookmark/interfaces/SelectionBookmark.md)

A bookmark that can recreate this selection

---

### isAllSelection()

```ts
isAllSelection(): boolean;
```

Defined in: [packages/editor-types/src/types/state/selection/PmSelection.ts:83](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L83)

Check if this is an all selection.

#### Returns

`boolean`

True if this is an AllSelection

---

### isNodeSelection()

```ts
isNodeSelection(): boolean;
```

Defined in: [packages/editor-types/src/types/state/selection/PmSelection.ts:76](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L76)

Check if this is a node selection.

#### Returns

`boolean`

True if this is a NodeSelection

---

### isTextSelection()

```ts
isTextSelection(): boolean;
```

Defined in: [packages/editor-types/src/types/state/selection/PmSelection.ts:69](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L69)

Check if this is a text selection.

#### Returns

`boolean`

True if this is a TextSelection

---

### map()

```ts
map(doc, mapping): PmSelection;
```

Defined in: [packages/editor-types/src/types/state/selection/PmSelection.ts:101](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L101)

Map this selection through a mappable transformation.
Updates the selection to reflect document changes.

#### Parameters

| Parameter | Type                                                                | Description                               |
| --------- | ------------------------------------------------------------------- | ----------------------------------------- |
| `doc`     | `Node_2`                                                            | The new document after the transformation |
| `mapping` | [`Mappable`](../../../../transform/Mappable/interfaces/Mappable.md) | The mappable transformation               |

#### Returns

`PmSelection`

A new selection mapped to the new document

---

### replace()

```ts
replace(transaction, content?): void;
```

Defined in: [packages/editor-types/src/types/state/selection/PmSelection.ts:133](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L133)

Replace the selection with a slice or, if no slice is given,
delete the selection. Will append to the given transaction.

#### Parameters

| Parameter     | Type                                                                  | Description                                                |
| ------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| `transaction` | [`PmTransaction`](../../../PmTransaction/interfaces/PmTransaction.md) | The transaction to append the replacement to               |
| `content?`    | `Slice`                                                               | The content to insert (optional, defaults to empty/delete) |

#### Returns

`void`

---

### replaceWith()

```ts
replaceWith(transaction, node): void;
```

Defined in: [packages/editor-types/src/types/state/selection/PmSelection.ts:142](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L142)

Replace the selection with the given node, appending the changes
to the given transaction.

#### Parameters

| Parameter     | Type                                                                  | Description                                  |
| ------------- | --------------------------------------------------------------------- | -------------------------------------------- |
| `transaction` | [`PmTransaction`](../../../PmTransaction/interfaces/PmTransaction.md) | The transaction to append the replacement to |
| `node`        | `Node_2`                                                              | The node to insert in place of the selection |

#### Returns

`void`

---

### toJSON()

```ts
toJSON(): SelectionJSON;
```

Defined in: [packages/editor-types/src/types/state/selection/PmSelection.ts:116](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/state/selection/PmSelection.ts#L116)

Convert the selection to a JSON-serializable representation.

#### Returns

[`SelectionJSON`](../../SelectionJSON/interfaces/SelectionJSON.md)

A JSON object representing the selection

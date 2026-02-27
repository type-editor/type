[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/state](../../../../README.md) / [selection/bookmarks/TextBookmark](../README.md) / TextBookmark

# Class: TextBookmark

Defined in: [state/src/selection/bookmarks/TextBookmark.ts:11](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/state/src/selection/bookmarks/TextBookmark.ts#L11)

Bookmark implementation for text selections.
Stores anchor and head positions as simple numbers that can be
mapped through document changes.

## Implements

- `SelectionBookmark`

## Constructors

### Constructor

```ts
new TextBookmark(anchor, head): TextBookmark;
```

Defined in: [state/src/selection/bookmarks/TextBookmark.ts:31](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/state/src/selection/bookmarks/TextBookmark.ts#L31)

Create a text selection bookmark.

#### Parameters

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `anchor`  | `number` | The anchor position (immobile end) |
| `head`    | `number` | The head position (mobile end)     |

#### Returns

`TextBookmark`

## Methods

### map()

```ts
map(mapping): TextBookmark;
```

Defined in: [state/src/selection/bookmarks/TextBookmark.ts:43](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/state/src/selection/bookmarks/TextBookmark.ts#L43)

Map this bookmark through document changes.
Both anchor and head positions are mapped to their new locations.

#### Parameters

| Parameter | Type       | Description                 |
| --------- | ---------- | --------------------------- |
| `mapping` | `Mappable` | The mappable transformation |

#### Returns

`TextBookmark`

A new TextBookmark with mapped positions

#### Implementation of

```ts
SelectionBookmark.map;
```

---

### resolve()

```ts
resolve(doc): PmSelection;
```

Defined in: [state/src/selection/bookmarks/TextBookmark.ts:55](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/state/src/selection/bookmarks/TextBookmark.ts#L55)

Resolve this bookmark to a text selection.
Uses `textSelectionBetween` to ensure the resolved positions are
valid for a text selection, adjusting them if necessary.

#### Parameters

| Parameter | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `doc`     | `Node_2` | The document to resolve the selection in |

#### Returns

`PmSelection`

A text selection at the bookmarked positions

#### Implementation of

```ts
SelectionBookmark.resolve;
```

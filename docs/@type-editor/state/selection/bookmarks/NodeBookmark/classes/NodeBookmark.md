[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/state](../../../../README.md) / [selection/bookmarks/NodeBookmark](../README.md) / NodeBookmark

# Class: NodeBookmark

Defined in: [state/src/selection/bookmarks/NodeBookmark.ts:13](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/selection/bookmarks/NodeBookmark.ts#L13)

Bookmark implementation for node selections.
Stores the anchor position (before the selected node) and handles
the case where the node is deleted by falling back to a text selection.

## Implements

- `SelectionBookmark`

## Constructors

### Constructor

```ts
new NodeBookmark(anchor): NodeBookmark;
```

Defined in: [state/src/selection/bookmarks/NodeBookmark.ts:26](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/selection/bookmarks/NodeBookmark.ts#L26)

Create a node selection bookmark.

#### Parameters

| Parameter | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `anchor`  | `number` | The position immediately before the node |

#### Returns

`NodeBookmark`

## Methods

### map()

```ts
map(mapping): SelectionBookmark;
```

Defined in: [state/src/selection/bookmarks/NodeBookmark.ts:38](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/selection/bookmarks/NodeBookmark.ts#L38)

Map this bookmark through document changes.
If the node at the anchor position was deleted, this returns a
TextBookmark at the mapped position instead.

#### Parameters

| Parameter | Type       | Description                 |
| --------- | ---------- | --------------------------- |
| `mapping` | `Mappable` | The mappable transformation |

#### Returns

`SelectionBookmark`

A NodeBookmark if the node still exists, otherwise a TextBookmark

#### Implementation of

```ts
SelectionBookmark.map;
```

---

### resolve()

```ts
resolve(doc): PmSelection;
```

Defined in: [state/src/selection/bookmarks/NodeBookmark.ts:51](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/selection/bookmarks/NodeBookmark.ts#L51)

Resolve this bookmark to a node selection if possible.
If there's no selectable node at the mapped position, falls back
to finding a nearby valid selection.

#### Parameters

| Parameter | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `doc`     | `Node_2` | The document to resolve the selection in |

#### Returns

`PmSelection`

A node selection if the node exists and is selectable, otherwise a nearby selection

#### Implementation of

```ts
SelectionBookmark.resolve;
```

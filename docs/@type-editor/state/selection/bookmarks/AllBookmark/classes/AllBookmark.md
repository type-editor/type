[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/state](../../../../README.md) / [selection/bookmarks/AllBookmark](../README.md) / AllBookmark

# Class: AllBookmark

Defined in: [state/src/selection/bookmarks/AllBookmark.ts:11](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/selection/bookmarks/AllBookmark.ts#L11)

Bookmark implementation for all-selections.
Since all-selections always span the entire document, this bookmark
doesn't need to store any position information and mapping is a no-op.

## Implements

- `SelectionBookmark`

## Constructors

### Constructor

```ts
new AllBookmark(): AllBookmark;
```

#### Returns

`AllBookmark`

## Methods

### map()

```ts
map(): this;
```

Defined in: [state/src/selection/bookmarks/AllBookmark.ts:20](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/selection/bookmarks/AllBookmark.ts#L20)

Map this bookmark through document changes.
All-selections are not affected by document changes, so this
simply returns the same bookmark.

#### Returns

`this`

This same bookmark instance

#### Implementation of

```ts
SelectionBookmark.map;
```

---

### resolve()

```ts
resolve(doc): PmSelection;
```

Defined in: [state/src/selection/bookmarks/AllBookmark.ts:30](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/selection/bookmarks/AllBookmark.ts#L30)

Resolve this bookmark to an all-selection.

#### Parameters

| Parameter | Type     | Description                                 |
| --------- | -------- | ------------------------------------------- |
| `doc`     | `Node_2` | The document to create the all-selection in |

#### Returns

`PmSelection`

An all-selection spanning the entire document

#### Implementation of

```ts
SelectionBookmark.resolve;
```

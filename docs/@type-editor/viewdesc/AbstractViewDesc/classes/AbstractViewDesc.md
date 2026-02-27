[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/viewdesc](../../README.md) / [AbstractViewDesc](../README.md) / AbstractViewDesc

# Abstract Class: AbstractViewDesc

Defined in: [AbstractViewDesc.ts:6](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/viewdesc/src/view-desc/AbstractViewDesc.ts#L6)

Abstract base class for view descriptions.
Provides minimal interface that all view descriptions must implement.

## Extended by

- [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)

## Constructors

### Constructor

```ts
new AbstractViewDesc(): AbstractViewDesc;
```

#### Returns

`AbstractViewDesc`

## Accessors

### nodeDOM

#### Get Signature

```ts
get nodeDOM(): Node;
```

Defined in: [AbstractViewDesc.ts:22](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/viewdesc/src/view-desc/AbstractViewDesc.ts#L22)

The DOM node that directly represents this ProseMirror node.
May differ from `dom` if outer decorations wrap it.

##### Returns

`Node`

The node DOM element, or null if this view doesn't have a direct node representation

---

### side

#### Get Signature

```ts
get abstract side(): number;
```

Defined in: [AbstractViewDesc.ts:14](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/viewdesc/src/view-desc/AbstractViewDesc.ts#L14)

Gets the side value which determines positioning behavior of the view.

- Negative values: positioned before content
- Zero: neutral positioning
- Positive values: positioned after content

##### Returns

`number`

[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/viewdesc](../../README.md) / [ViewDescUpdater](../README.md) / ViewDescUpdater

# Class: ViewDescUpdater

Defined in: [ViewDescUpdater.ts:24](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDescUpdater.ts#L24)

## Constructors

### Constructor

```ts
new ViewDescUpdater(viewDesc, view): ViewDescUpdater;
```

Defined in: [ViewDescUpdater.ts:30](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDescUpdater.ts#L30)

#### Parameters

| Parameter  | Type                                             |
| ---------- | ------------------------------------------------ |
| `viewDesc` | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md) |
| `view`     | `PmEditorView`                                   |

#### Returns

`ViewDescUpdater`

## Methods

### update()

```ts
static update(
   viewDesc,
   view,
   node,
   outerDeco,
   innerDeco): boolean;
```

Defined in: [ViewDescUpdater.ts:46](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDescUpdater.ts#L46)

If this desc must be updated to match the given node decoration,
do so and return true.

#### Parameters

| Parameter   | Type                                             | Description                                          |
| ----------- | ------------------------------------------------ | ---------------------------------------------------- |
| `viewDesc`  | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md) | View desc to update (changes as we enter/exit marks) |
| `view`      | `PmEditorView`                                   | The editor view                                      |
| `node`      | `Node_2`                                         | The new node                                         |
| `outerDeco` | readonly `PmDecoration`[]                        | New outer decorations                                |
| `innerDeco` | `DecorationSource`                               | New inner decorations                                |

#### Returns

`boolean`

True if update succeeded

---

### updateChildren()

```ts
static updateChildren(
   viewDesc,
   view,
   pos): void;
```

Defined in: [ViewDescUpdater.ts:65](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/viewdesc/src/view-desc/ViewDescUpdater.ts#L65)

Syncs `this.children` to match `this.node.content` and the local
decorations, possibly introducing nesting for marks. Then, in a
separate step, syncs the DOM inside `this.contentDOM` to
`this.children`.

#### Parameters

| Parameter  | Type                                             | Description                                          |
| ---------- | ------------------------------------------------ | ---------------------------------------------------- |
| `viewDesc` | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md) | View desc to update (changes as we enter/exit marks) |
| `view`     | `PmEditorView`                                   | The editor view                                      |
| `pos`      | `number`                                         | -                                                    |

#### Returns

`void`

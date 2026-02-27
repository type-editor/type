[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/viewdesc](../../README.md) / [ViewTreeUpdater](../README.md) / ViewTreeUpdater

# Class: ViewTreeUpdater

Defined in: [ViewTreeUpdater.ts:29](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/viewdesc/src/view-desc/ViewTreeUpdater.ts#L29)

Helper class for incrementally updating a tree of mark descs and
the widget and node descs inside of them.

This class maintains a cursor through the existing view desc tree while
iterating through the new document content, trying to reuse existing
view descs where possible. It handles:

- Nested mark descs (maintains a stack as it enters/exits marks)
- Node and widget descs
- DOM composition protection (won't modify locked nodes)

## Constructors

### Constructor

```ts
new ViewTreeUpdater(
   top,
   lock,
   view): ViewTreeUpdater;
```

Defined in: [ViewTreeUpdater.ts:62](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/viewdesc/src/view-desc/ViewTreeUpdater.ts#L62)

Creates a new ViewTreeUpdater.

#### Parameters

| Parameter | Type                                                         | Description                                                           |
| --------- | ------------------------------------------------------------ | --------------------------------------------------------------------- |
| `top`     | [`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md) | The top-level node view description to update                         |
| `lock`    | `Node`                                                       | A DOM node that should not be modified (typically during composition) |
| `view`    | `PmEditorView`                                               | The editor view                                                       |

#### Returns

`ViewTreeUpdater`

## Accessors

### changed

#### Get Signature

```ts
get changed(): boolean;
```

Defined in: [ViewTreeUpdater.ts:72](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/viewdesc/src/view-desc/ViewTreeUpdater.ts#L72)

##### Returns

`boolean`

## Methods

### addNode()

```ts
addNode(
   node,
   outerDeco,
   innerDeco,
   pos): void;
```

Defined in: [ViewTreeUpdater.ts:281](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/viewdesc/src/view-desc/ViewTreeUpdater.ts#L281)

Insert the node as a newly created node desc.

#### Parameters

| Parameter   | Type                      | Description                    |
| ----------- | ------------------------- | ------------------------------ |
| `node`      | `Node_2`                  | The node to add                |
| `outerDeco` | readonly `PmDecoration`[] | Outer decorations for the node |
| `innerDeco` | `DecorationSource`        | Inner decorations for the node |
| `pos`       | `number`                  | Document position of the node  |

#### Returns

`void`

---

### addTextblockHacks()

```ts
addTextblockHacks(): void;
```

Defined in: [ViewTreeUpdater.ts:326](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/viewdesc/src/view-desc/ViewTreeUpdater.ts#L326)

Make sure a textblock looks and behaves correctly in contentEditable.

Adds BR elements to empty blocks or blocks that don't end with newlines,
ensuring they display correctly and can accept cursor placement.
On some browsers, also adds IMG separators to work around cursor bugs.

#### Returns

`void`

---

### destroyRemaining()

```ts
destroyRemaining(): void;
```

Defined in: [ViewTreeUpdater.ts:79](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/viewdesc/src/view-desc/ViewTreeUpdater.ts#L79)

Destroy all remaining children in `this.top` from the current index onwards.

#### Returns

`void`

---

### findIndexWithChild()

```ts
findIndexWithChild(domNode): number;
```

Defined in: [ViewTreeUpdater.ts:180](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/viewdesc/src/view-desc/ViewTreeUpdater.ts#L180)

Find the index of the child that contains a given DOM node.

#### Parameters

| Parameter | Type   | Description                |
| --------- | ------ | -------------------------- |
| `domNode` | `Node` | The DOM node to search for |

#### Returns

`number`

The child index, or -1 if not found

---

### findNodeMatch()

```ts
findNodeMatch(
   node,
   outerDeco,
   innerDeco,
   index): boolean;
```

Defined in: [ViewTreeUpdater.ts:117](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/viewdesc/src/view-desc/ViewTreeUpdater.ts#L117)

Try to find a node desc matching the given data. Skip over it and
return true when successful.

#### Parameters

| Parameter   | Type                      | Description                           |
| ----------- | ------------------------- | ------------------------------------- |
| `node`      | `Node_2`                  | The node to find a match for          |
| `outerDeco` | readonly `PmDecoration`[] | Outer decorations for the node        |
| `innerDeco` | `DecorationSource`        | Inner decorations for the node        |
| `index`     | `number`                  | The index in the parent's child array |

#### Returns

`boolean`

True if a match was found and used

---

### placeWidget()

```ts
placeWidget(widget, pos): void;
```

Defined in: [ViewTreeUpdater.ts:300](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/viewdesc/src/view-desc/ViewTreeUpdater.ts#L300)

Place a widget decoration at the current position.
Reuses existing widget if it matches, otherwise creates a new one.

#### Parameters

| Parameter | Type           | Description                      |
| --------- | -------------- | -------------------------------- |
| `widget`  | `PmDecoration` | The widget decoration to place   |
| `pos`     | `number`       | Document position for the widget |

#### Returns

`void`

---

### syncToMarks()

```ts
syncToMarks(
   marks,
   inline,
   parentIndex): void;
```

Defined in: [ViewTreeUpdater.ts:97](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/viewdesc/src/view-desc/ViewTreeUpdater.ts#L97)

Syncs the current stack of mark descs with the given array of marks.

This maintains proper mark nesting by:

1. Finding how many marks from the stack can be kept
2. Popping marks that don't match
3. Pushing new marks or reusing existing ones

The stack stores pairs of [ViewDesc, index], so depth = stack.length / 2

#### Parameters

| Parameter     | Type              | Description                   |
| ------------- | ----------------- | ----------------------------- |
| `marks`       | readonly `Mark`[] | The marks to sync to          |
| `inline`      | `boolean`         | Whether the content is inline |
| `parentIndex` | `number`          | -                             |

#### Returns

`void`

---

### updateNextNode()

```ts
updateNextNode(
   node,
   outerDeco,
   innerDeco,
   index,
   pos): boolean;
```

Defined in: [ViewTreeUpdater.ts:213](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/viewdesc/src/view-desc/ViewTreeUpdater.ts#L213)

Try to update the next node, if any, to the given data. Checks
pre-matches to avoid overwriting nodes that could still be used.

#### Parameters

| Parameter   | Type                      | Description                       |
| ----------- | ------------------------- | --------------------------------- |
| `node`      | `Node_2`                  | The node to update to             |
| `outerDeco` | readonly `PmDecoration`[] | Outer decorations for the node    |
| `innerDeco` | `DecorationSource`        | Inner decorations for the node    |
| `index`     | `number`                  | The node's index in its parent    |
| `pos`       | `number`                  | The document position of the node |

#### Returns

`boolean`

True if an update was performed

---

### updateNodeAt()

```ts
updateNodeAt(
   node,
   outerDeco,
   innerDeco,
   index): boolean;
```

Defined in: [ViewTreeUpdater.ts:156](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/viewdesc/src/view-desc/ViewTreeUpdater.ts#L156)

Try to update the node view at a specific index.

#### Parameters

| Parameter   | Type                      | Description                     |
| ----------- | ------------------------- | ------------------------------- |
| `node`      | `Node_2`                  | The node to update to           |
| `outerDeco` | readonly `PmDecoration`[] | Outer decorations for the node  |
| `innerDeco` | `DecorationSource`        | Inner decorations for the node  |
| `index`     | `number`                  | The index in the children array |

#### Returns

`boolean`

True if the update succeeded

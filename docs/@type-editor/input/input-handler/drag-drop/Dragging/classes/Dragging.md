[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/drag-drop/Dragging](../README.md) / Dragging

# Class: Dragging

Defined in: [input-handler/drag-drop/Dragging.ts:9](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/input-handler/drag-drop/Dragging.ts#L9)

Represents an active drag operation, storing information about what
is being dragged and whether it's a move or copy operation.

## Implements

- `PmDragging`

## Constructors

### Constructor

```ts
new Dragging(
   slice,
   move,
   nodeSelection?): Dragging;
```

Defined in: [input-handler/drag-drop/Dragging.ts:26](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/input-handler/drag-drop/Dragging.ts#L26)

Creates a new Dragging instance.

#### Parameters

| Parameter        | Type          | Description                                 |
| ---------------- | ------------- | ------------------------------------------- |
| `slice`          | `Slice`       | The content being dragged                   |
| `move`           | `boolean`     | Whether this is a move (vs. copy) operation |
| `nodeSelection?` | `PmSelection` | Optional node selection being dragged       |

#### Returns

`Dragging`

#### Throws

Error if nodeSelection is provided but is not a NodeSelection

## Accessors

### move

#### Get Signature

```ts
get move(): boolean;
```

Defined in: [input-handler/drag-drop/Dragging.ts:41](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/input-handler/drag-drop/Dragging.ts#L41)

Whether this is a move operation

##### Returns

`boolean`

#### Implementation of

```ts
PmDragging.move;
```

---

### nodeSelection

#### Get Signature

```ts
get nodeSelection(): PmSelection;
```

Defined in: [input-handler/drag-drop/Dragging.ts:46](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/input-handler/drag-drop/Dragging.ts#L46)

The node selection being dragged, if any

##### Returns

`PmSelection`

#### Implementation of

```ts
PmDragging.nodeSelection;
```

---

### slice

#### Get Signature

```ts
get slice(): Slice;
```

Defined in: [input-handler/drag-drop/Dragging.ts:36](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/input-handler/drag-drop/Dragging.ts#L36)

The content slice being dragged

##### Returns

`Slice`

#### Implementation of

```ts
PmDragging.slice;
```

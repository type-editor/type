[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [state/Branch](../README.md) / Item

# Class: Item

Defined in: [state/Branch.ts:25](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/history/src/state/Branch.ts#L25)

Represents a single item in the history branch.

An item can contain a step (an actual change), a position map (for tracking position changes),
and optionally a selection bookmark (marking the start of an event).

## Constructors

### Constructor

```ts
new Item(
   map,
   step?,
   selection?,
   mirrorOffset?): Item;
```

Defined in: [state/Branch.ts:42](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/history/src/state/Branch.ts#L42)

Creates a new history item.

#### Parameters

| Parameter       | Type                | Description                                                                                                                                                            |
| --------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `map`           | `PmStepMap`         | The (forward) step map for this item                                                                                                                                   |
| `step?`         | `PmStep`            | The inverted step (optional)                                                                                                                                           |
| `selection?`    | `SelectionBookmark` | If non-null, this item is the start of a group, and this selection is the starting selection for the group (the one that was active before the first step was applied) |
| `mirrorOffset?` | `number`            | If this item is the inverse of a previous mapping on the stack, this points at the inverse's offset                                                                    |

#### Returns

`Item`

## Accessors

### map

#### Get Signature

```ts
get map(): StepMap;
```

Defined in: [state/Branch.ts:55](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/history/src/state/Branch.ts#L55)

Gets the position map for this item.

##### Returns

`StepMap`

---

### mirrorOffset

#### Get Signature

```ts
get mirrorOffset(): number;
```

Defined in: [state/Branch.ts:76](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/history/src/state/Branch.ts#L76)

Gets the mirror offset for this item, if any.

##### Returns

`number`

---

### selection

#### Get Signature

```ts
get selection(): SelectionBookmark;
```

Defined in: [state/Branch.ts:69](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/history/src/state/Branch.ts#L69)

Gets the selection bookmark for this item, if any.

##### Returns

`SelectionBookmark`

---

### step

#### Get Signature

```ts
get step(): PmStep;
```

Defined in: [state/Branch.ts:62](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/history/src/state/Branch.ts#L62)

Gets the step (change) for this item, if any.

##### Returns

`PmStep`

## Methods

### merge()

```ts
merge(other): Item;
```

Defined in: [state/Branch.ts:89](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/history/src/state/Branch.ts#L89)

Attempts to merge this item with another item.

Two items can be merged if both have steps, and the other item doesn't mark
the start of a new event (no selection).

#### Parameters

| Parameter | Type   | Description            |
| --------- | ------ | ---------------------- |
| `other`   | `Item` | The item to merge with |

#### Returns

`Item`

A new merged item, or undefined if merging is not possible

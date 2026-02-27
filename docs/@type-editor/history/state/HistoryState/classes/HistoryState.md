[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [state/HistoryState](../README.md) / HistoryState

# Class: HistoryState

Defined in: [state/HistoryState.ts:28](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/history/src/state/HistoryState.ts#L28)

Represents the complete undo/redo history state for an editor.

This tracks both the undo (done) and redo (undone) branches, as well as
metadata about the previous transaction for determining event grouping.
Will be stored in the plugin state when the history plugin is active.

## Constructors

### Constructor

```ts
new HistoryState(
   done,
   undone,
   prevRanges,
   prevTime,
   prevComposition): HistoryState;
```

Defined in: [state/HistoryState.ts:44](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/history/src/state/HistoryState.ts#L44)

Creates a new history state.

#### Parameters

| Parameter         | Type                                       | Description                                     |
| ----------------- | ------------------------------------------ | ----------------------------------------------- |
| `done`            | [`Branch`](../../Branch/classes/Branch.md) | The undo history branch                         |
| `undone`          | [`Branch`](../../Branch/classes/Branch.md) | The redo history branch                         |
| `prevRanges`      | readonly `number`[]                        | The position ranges of the previous transaction |
| `prevTime`        | `number`                                   | The timestamp of the previous transaction       |
| `prevComposition` | `number`                                   | The composition ID of the previous transaction  |

#### Returns

`HistoryState`

## Accessors

### done

#### Get Signature

```ts
get done(): Branch;
```

Defined in: [state/HistoryState.ts:59](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/history/src/state/HistoryState.ts#L59)

Gets the undo history branch.

##### Returns

[`Branch`](../../Branch/classes/Branch.md)

#### Set Signature

```ts
set done(branch): void;
```

Defined in: [state/HistoryState.ts:66](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/history/src/state/HistoryState.ts#L66)

Sets the undo history branch.

##### Parameters

| Parameter | Type                                       |
| --------- | ------------------------------------------ |
| `branch`  | [`Branch`](../../Branch/classes/Branch.md) |

##### Returns

`void`

---

### prevComposition

#### Get Signature

```ts
get prevComposition(): number;
```

Defined in: [state/HistoryState.ts:94](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/history/src/state/HistoryState.ts#L94)

Gets the composition ID of the previous transaction.

##### Returns

`number`

---

### prevRanges

#### Get Signature

```ts
get prevRanges(): readonly number[];
```

Defined in: [state/HistoryState.ts:80](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/history/src/state/HistoryState.ts#L80)

Gets the position ranges from the previous transaction.

##### Returns

readonly `number`[]

---

### prevTime

#### Get Signature

```ts
get prevTime(): number;
```

Defined in: [state/HistoryState.ts:87](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/history/src/state/HistoryState.ts#L87)

Gets the timestamp of the previous transaction.

##### Returns

`number`

---

### undone

#### Get Signature

```ts
get undone(): Branch;
```

Defined in: [state/HistoryState.ts:73](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/history/src/state/HistoryState.ts#L73)

Gets the redo history branch.

##### Returns

[`Branch`](../../Branch/classes/Branch.md)

## Methods

### createClosed()

```ts
static createClosed(done, undone): HistoryState;
```

Defined in: [state/HistoryState.ts:115](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/history/src/state/HistoryState.ts#L115)

Creates a closed history state, which prevents grouping with previous changes.
This is used when the history should start a new group for the next transaction.

#### Parameters

| Parameter | Type                                       | Description                         |
| --------- | ------------------------------------------ | ----------------------------------- |
| `done`    | [`Branch`](../../Branch/classes/Branch.md) | The undo history branch to preserve |
| `undone`  | [`Branch`](../../Branch/classes/Branch.md) | The redo history branch to preserve |

#### Returns

`HistoryState`

A new HistoryState with reset metadata to prevent grouping

---

### createEmpty()

```ts
static createEmpty(): HistoryState;
```

Defined in: [state/HistoryState.ts:103](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/history/src/state/HistoryState.ts#L103)

Creates an empty history state with no undo or redo history.

#### Returns

`HistoryState`

A new HistoryState with empty branches and initial metadata

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [state/Branch](../README.md) / Branch

# Class: Branch

Defined in: [state/Branch.ts:106](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/history/src/state/Branch.ts#L106)

Represents a branch in the history tree (either undo or redo history).

A branch maintains a sequence of items that represent the history of changes,
where each item can contain a step (an actual change) and/or a position map
(for transforming positions through the change).

## Constructors

### Constructor

```ts
new Branch(items, eventCount): Branch;
```

Defined in: [state/Branch.ts:124](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/history/src/state/Branch.ts#L124)

**`Internal`**

Creates a new branch.

#### Parameters

| Parameter    | Type                                                                                              | Description                                             |
| ------------ | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `items`      | [`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;[`Item`](Item.md)&gt; | The sequence of history items                           |
| `eventCount` | `number`                                                                                          | The number of events (groups of changes) in this branch |

#### Returns

`Branch`

## Properties

| Property                            | Modifier   | Type     | Defined in                                                                                                                                         |
| ----------------------------------- | ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-empty"></a> `empty` | `readonly` | `Branch` | [state/Branch.ts:108](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/history/src/state/Branch.ts#L108) |

## Accessors

### eventCount

#### Get Signature

```ts
get eventCount(): number;
```

Defined in: [state/Branch.ts:132](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/history/src/state/Branch.ts#L132)

Gets the number of events in this branch.

##### Returns

`number`

## Methods

### addMaps()

```ts
addMaps(maps): Branch;
```

Defined in: [state/Branch.ts:269](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/history/src/state/Branch.ts#L269)

Adds position maps to the branch without associated steps.

This is used when changes occur that don't need to be undoable
but still need to be tracked for position mapping.

#### Parameters

| Parameter | Type                   | Description               |
| --------- | ---------------------- | ------------------------- |
| `maps`    | readonly `PmStepMap`[] | Array of step maps to add |

#### Returns

`Branch`

A new branch with the maps added, or this branch if it has no events

---

### addTransform()

```ts
addTransform(
   transform,
   selection,
   histOptions,
   preserveItems): Branch;
```

Defined in: [state/Branch.ts:218](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/history/src/state/Branch.ts#L218)

Creates a new branch with the given transform added to the history.

This method processes all steps in the transform, inverts them for undo,
and attempts to merge consecutive items when possible to save memory.

#### Parameters

| Parameter       | Type                                                                                             | Description                                                        |
| --------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `transform`     | `TransformDocument`                                                                              | The transform containing the steps to add                          |
| `selection`     | `SelectionBookmark`                                                                              | The selection bookmark marking the start of a new event (optional) |
| `histOptions`   | `Required`&lt;[`HistoryOptions`](../../../types/HistoryOptions/interfaces/HistoryOptions.md)&gt; | History configuration options (depth and delay)                    |
| `preserveItems` | `boolean`                                                                                        | Whether to preserve items exactly for rebasing                     |

#### Returns

`Branch`

A new branch with the transform added

---

### popEvent()

```ts
popEvent(state, preserveItems): HistoryEventState;
```

Defined in: [state/Branch.ts:146](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/history/src/state/Branch.ts#L146)

Pops the latest event off the branch's history and applies it to a document transform.

This method retrieves the most recent history event, applies its steps in reverse
to the current state, and returns the modified state along with the remaining history.

#### Parameters

| Parameter       | Type            | Description                                                       |
| --------------- | --------------- | ----------------------------------------------------------------- |
| `state`         | `PmEditorState` | The current editor state                                          |
| `preserveItems` | `boolean`       | Whether to preserve items for rebasing (needed for collaboration) |

#### Returns

[`HistoryEventState`](../../../types/HistoryEventState/interfaces/HistoryEventState.md)

The history event state with remaining branch, transform, and selection, or null if no events exist

---

### rebased()

```ts
rebased(rebasedTransform, rebasedCount): Branch;
```

Defined in: [state/Branch.ts:288](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/history/src/state/Branch.ts#L288)

Adjusts the branch when remote changes are rebased in collaborative editing.

When the collaboration module receives remote changes, the history needs to adjust
the steps that were rebased on top of those changes and include position maps
for the remote changes in its array of items.

#### Parameters

| Parameter          | Type                | Description                                  |
| ------------------ | ------------------- | -------------------------------------------- |
| `rebasedTransform` | `TransformDocument` | The transform containing the rebased changes |
| `rebasedCount`     | `number`            | The number of steps that were rebased        |

#### Returns

`Branch`

A new branch with the rebased adjustments applied

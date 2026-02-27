[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [columnresizing/ResizeState](../README.md) / ResizeState

# Class: ResizeState

Defined in: [tables/src/columnresizing/ResizeState.ts:13](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/tables/src/columnresizing/ResizeState.ts#L13)

Represents the current state of column resizing within the editor.
This class is immutable - all state changes return a new instance.

## Constructors

### Constructor

```ts
new ResizeState(activeHandle, dragging?): ResizeState;
```

Defined in: [tables/src/columnresizing/ResizeState.ts:27](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/tables/src/columnresizing/ResizeState.ts#L27)

Creates a new ResizeState instance.

#### Parameters

| Parameter      | Type                                                                        | Description                                                                                                                                                           |
| -------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `activeHandle` | `number`                                                                    | The document position of the currently active resize handle, or [NO_ACTIVE_HANDLE](../../no-active-handle/variables/NO_ACTIVE_HANDLE.md) (-1) if no handle is active. |
| `dragging?`    | [`Dragging`](../../../types/columnresizing/Dragging/interfaces/Dragging.md) | The current drag state, or `null`/`undefined` if not dragging.                                                                                                        |

#### Returns

`ResizeState`

## Accessors

### activeHandle

#### Get Signature

```ts
get activeHandle(): number;
```

Defined in: [tables/src/columnresizing/ResizeState.ts:36](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/tables/src/columnresizing/ResizeState.ts#L36)

The document position of the currently active resize handle.
Returns -1 if no handle is active.

##### Returns

`number`

---

### dragging

#### Get Signature

```ts
get dragging(): Dragging;
```

Defined in: [tables/src/columnresizing/ResizeState.ts:43](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/tables/src/columnresizing/ResizeState.ts#L43)

The current drag state, or `undefined` if no drag is in progress.

##### Returns

[`Dragging`](../../../types/columnresizing/Dragging/interfaces/Dragging.md)

## Methods

### apply()

```ts
apply(transaction): ResizeState;
```

Defined in: [tables/src/columnresizing/ResizeState.ts:56](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/tables/src/columnresizing/ResizeState.ts#L56)

Applies a transaction to produce a new state. Handles three cases:

1. Handle position change (mouse moved near/away from column edge)
2. Dragging state change (started/stopped dragging)
3. Document changes while a handle is active (remap handle position)

#### Parameters

| Parameter     | Type            | Description               |
| ------------- | --------------- | ------------------------- |
| `transaction` | `PmTransaction` | The transaction to apply. |

#### Returns

`ResizeState`

A new ResizeState reflecting the transaction's changes, or `this` if unchanged.

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/view](../../../README.md) / [dom-observer/SelectionState](../README.md) / SelectionState

# Class: SelectionState

Defined in: [dom-observer/SelectionState.ts:8](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/SelectionState.ts#L8)

Represents the state of a DOM selection, tracking anchor and focus positions.
This is used to detect selection changes efficiently.

## Implements

- `PmSelectionState`

## Constructors

### Constructor

```ts
new SelectionState(): SelectionState;
```

#### Returns

`SelectionState`

## Accessors

### anchorNode

#### Get Signature

```ts
get anchorNode(): Node;
```

Defined in: [dom-observer/SelectionState.ts:15](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/SelectionState.ts#L15)

##### Returns

`Node`

#### Implementation of

```ts
PmSelectionState.anchorNode;
```

---

### anchorOffset

#### Get Signature

```ts
get anchorOffset(): number;
```

Defined in: [dom-observer/SelectionState.ts:19](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/SelectionState.ts#L19)

##### Returns

`number`

#### Implementation of

```ts
PmSelectionState.anchorOffset;
```

---

### focusNode

#### Get Signature

```ts
get focusNode(): Node;
```

Defined in: [dom-observer/SelectionState.ts:23](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/SelectionState.ts#L23)

##### Returns

`Node`

#### Implementation of

```ts
PmSelectionState.focusNode;
```

## Methods

### clear()

```ts
clear(): void;
```

Defined in: [dom-observer/SelectionState.ts:41](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/SelectionState.ts#L41)

Clears the selection state by resetting all nodes to null.

#### Returns

`void`

#### Implementation of

```ts
PmSelectionState.clear;
```

---

### eq()

```ts
eq(sel): boolean;
```

Defined in: [dom-observer/SelectionState.ts:53](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/SelectionState.ts#L53)

Checks if the given selection range equals this selection state.

#### Parameters

| Parameter | Type                | Description                    |
| --------- | ------------------- | ------------------------------ |
| `sel`     | `DOMSelectionRange` | The selection range to compare |

#### Returns

`boolean`

true if both selections are identical

#### Implementation of

```ts
PmSelectionState.eq;
```

---

### set()

```ts
set(sel): void;
```

Defined in: [dom-observer/SelectionState.ts:31](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/SelectionState.ts#L31)

Updates the selection state with new values.

#### Parameters

| Parameter | Type                | Description                          |
| --------- | ------------------- | ------------------------------------ |
| `sel`     | `DOMSelectionRange` | The DOM selection range to copy from |

#### Returns

`void`

#### Implementation of

```ts
PmSelectionState.set;
```

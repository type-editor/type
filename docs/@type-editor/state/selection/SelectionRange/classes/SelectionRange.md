[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/state](../../../README.md) / [selection/SelectionRange](../README.md) / SelectionRange

# Class: SelectionRange

Defined in: [state/src/selection/SelectionRange.ts:10](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/state/src/selection/SelectionRange.ts#L10)

Represents a selected range in a document.
A range has a start position ($from) and an end position ($to).
Most selections consist of a single range, but some selection types
may use multiple ranges to represent discontinuous selections.

## Implements

- `PmSelectionRange`

## Constructors

### Constructor

```ts
new SelectionRange($from, $to): SelectionRange;
```

Defined in: [state/src/selection/SelectionRange.ts:30](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/state/src/selection/SelectionRange.ts#L30)

Create a range.

#### Parameters

| Parameter | Type          | Description                                      |
| --------- | ------------- | ------------------------------------------------ |
| `$from`   | `ResolvedPos` | The lower bound of the range (resolved position) |
| `$to`     | `ResolvedPos` | The upper bound of the range (resolved position) |

#### Returns

`SelectionRange`

## Accessors

### $from

#### Get Signature

```ts
get $from(): ResolvedPos;
```

Defined in: [state/src/selection/SelectionRange.ts:40](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/state/src/selection/SelectionRange.ts#L40)

The resolved lower bound of the range.

##### Returns

`ResolvedPos`

The starting position

#### Implementation of

```ts
PmSelectionRange.$from;
```

---

### $to

#### Get Signature

```ts
get $to(): ResolvedPos;
```

Defined in: [state/src/selection/SelectionRange.ts:49](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/state/src/selection/SelectionRange.ts#L49)

The resolved upper bound of the range.

##### Returns

`ResolvedPos`

The ending position

#### Implementation of

```ts
PmSelectionRange.$to;
```

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/decoration](../../../README.md) / [decoration/DecorationGroup](../README.md) / DecorationGroup

# Class: DecorationGroup

Defined in: [decoration/DecorationGroup.ts:22](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/decoration/src/decoration/DecorationGroup.ts#L22)

**`Internal`**

An abstraction that allows the code dealing with decorations to
treat multiple DecorationSet objects as if it were a single object
with (a subset of) the same interface. This is used when multiple
decoration sources need to be combined.

DecorationGroup is used internally when multiple plugins provide
decorations for the same view. It efficiently combines multiple
decoration sets without merging them into a single set, which allows
for better performance when mapping through changes.

## Extends

- [`AbstractDecorationSource`](../../AbstractDecorationSource/classes/AbstractDecorationSource.md)

## Implements

- `DecorationSource`

## Constructors

### Constructor

```ts
new DecorationGroup(members): DecorationGroup;
```

Defined in: [decoration/DecorationGroup.ts:32](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/decoration/src/decoration/DecorationGroup.ts#L32)

Creates a new decoration group from multiple decoration sets.

#### Parameters

| Parameter | Type                                                                       | Description                                |
| --------- | -------------------------------------------------------------------------- | ------------------------------------------ |
| `members` | readonly [`DecorationSet`](../../DecorationSet/classes/DecorationSet.md)[] | Array of decoration sets to group together |

#### Returns

`DecorationGroup`

#### Overrides

[`AbstractDecorationSource`](../../AbstractDecorationSource/classes/AbstractDecorationSource.md).[`constructor`](../../AbstractDecorationSource/classes/AbstractDecorationSource.md#constructor)

## Properties

| Property                                                                                | Modifier   | Type                              | Default value | Description                                                        | Inherited from                                                                                                                                                                                                                                    | Defined in                                                                                                                                                                                        |
| --------------------------------------------------------------------------------------- | ---------- | --------------------------------- | ------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-empty_decoration_widget_options"></a> `EMPTY_DECORATION_WIDGET_OPTIONS` | `readonly` | `Record`&lt;`string`, `never`&gt; | `{}`          | Empty options object used as default to avoid repeated allocations | [`AbstractDecorationSource`](../../AbstractDecorationSource/classes/AbstractDecorationSource.md).[`EMPTY_DECORATION_WIDGET_OPTIONS`](../../AbstractDecorationSource/classes/AbstractDecorationSource.md#property-empty_decoration_widget_options) | [decoration/AbstractDecorationSource.ts:14](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/decoration/src/decoration/AbstractDecorationSource.ts#L14) |

## Methods

### eq()

```ts
eq(other): boolean;
```

Defined in: [decoration/DecorationGroup.ts:89](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/decoration/src/decoration/DecorationGroup.ts#L89)

Check if this decoration group is equal to another.

#### Parameters

| Parameter | Type              | Description                          |
| --------- | ----------------- | ------------------------------------ |
| `other`   | `DecorationGroup` | The decoration group to compare with |

#### Returns

`boolean`

True if the groups are equal

#### Implementation of

```ts
DecorationSource.eq;
```

---

### forChild()

```ts
forChild(offset, child):
  | DecorationSet
  | DecorationSource;
```

Defined in: [decoration/DecorationGroup.ts:60](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/decoration/src/decoration/DecorationGroup.ts#L60)

Get decorations relevant for a child node from all sets in the group.

#### Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `offset`  | `number` | The offset position of the child node |
| `child`   | `Node_2` | The child node                        |

#### Returns

\| [`DecorationSet`](../../DecorationSet/classes/DecorationSet.md)
\| `DecorationSource`

A decoration source for the child node

#### Implementation of

```ts
DecorationSource.forChild;
```

---

### forEachSet()

```ts
forEachSet(callbackFunc): void;
```

Defined in: [decoration/DecorationGroup.ts:197](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/decoration/src/decoration/DecorationGroup.ts#L197)

Iterate over all decoration sets in this group, calling the callback
for each one.

#### Parameters

| Parameter      | Type              | Description                               |
| -------------- | ----------------- | ----------------------------------------- |
| `callbackFunc` | (`set`) => `void` | Function to call with each decoration set |

#### Returns

`void`

#### Implementation of

```ts
DecorationSource.forEachSet;
```

---

### locals()

```ts
locals(node): readonly PmDecoration[];
```

Defined in: [decoration/DecorationGroup.ts:108](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/decoration/src/decoration/DecorationGroup.ts#L108)

Get all local decorations from all sets in the group, with overlaps removed.

#### Parameters

| Parameter | Type     | Description                     |
| --------- | -------- | ------------------------------- |
| `node`    | `Node_2` | The node to get decorations for |

#### Returns

readonly `PmDecoration`[]

Array of decorations with overlaps removed

#### Implementation of

```ts
DecorationSource.locals;
```

---

### map()

```ts
map(mapping, doc): DecorationSource;
```

Defined in: [decoration/DecorationGroup.ts:44](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/decoration/src/decoration/DecorationGroup.ts#L44)

Map all decoration sets in this group through document changes.

#### Parameters

| Parameter | Type      | Description                               |
| --------- | --------- | ----------------------------------------- |
| `mapping` | `Mapping` | The mapping representing document changes |
| `doc`     | `Node_2`  | The updated document node                 |

#### Returns

`DecorationSource`

A new decoration source with mapped decorations

#### Implementation of

```ts
DecorationSource.map;
```

---

### removeOverlap()

```ts
protected removeOverlap(spans): PmDecoration[];
```

Defined in: [decoration/AbstractDecorationSource.ts:25](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/decoration/src/decoration/AbstractDecorationSource.ts#L25)

Scan a sorted array of decorations for partially overlapping spans,
and split those so that only fully overlapping spans are left (to
make subsequent rendering easier). Will return the input array if
no partially overlapping spans are found (the common case).

#### Parameters

| Parameter | Type                      | Description                         |
| --------- | ------------------------- | ----------------------------------- |
| `spans`   | readonly `PmDecoration`[] | The array of decorations to process |

#### Returns

`PmDecoration`[]

A new array with overlaps removed, or the original if no overlaps exist

#### Inherited from

[`AbstractDecorationSource`](../../AbstractDecorationSource/classes/AbstractDecorationSource.md).[`removeOverlap`](../../AbstractDecorationSource/classes/AbstractDecorationSource.md#removeoverlap)

---

### from()

```ts
static from(members): DecorationSource;
```

Defined in: [decoration/DecorationGroup.ts:159](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/decoration/src/decoration/DecorationGroup.ts#L159)

Create a group for the given array of decoration sources, or return
a single set when possible. This factory method handles flattening
nested groups and optimizes for common cases.

This method automatically optimizes the result:

- Returns empty set if no members
- Returns the single member if only one
- Flattens nested groups into a single level

#### Parameters

| Parameter | Type                          | Description                                                                       |
| --------- | ----------------------------- | --------------------------------------------------------------------------------- |
| `members` | readonly `DecorationSource`[] | Array of decoration sources (DecorationSet or DecorationGroup instances) to group |

#### Returns

`DecorationSource`

A decoration source (may be empty set, single set, or flattened group)

---

### sortDecorations()

```ts
protected static sortDecorations(spans): PmDecoration[];
```

Defined in: [decoration/AbstractDecorationSource.ts:96](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/decoration/src/decoration/AbstractDecorationSource.ts#L96)

Comparator function used to sort decorations by position.
Decorations with lower start positions come first, and within
a set with the same start position, those with smaller end
positions come first.

#### Parameters

| Parameter | Type             |
| --------- | ---------------- |
| `spans`   | `PmDecoration`[] |

#### Returns

`PmDecoration`[]

A comparator function for sorting decorations

#### Inherited from

[`AbstractDecorationSource`](../../AbstractDecorationSource/classes/AbstractDecorationSource.md).[`sortDecorations`](../../AbstractDecorationSource/classes/AbstractDecorationSource.md#sortdecorations)

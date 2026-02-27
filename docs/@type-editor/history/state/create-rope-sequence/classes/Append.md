[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [state/create-rope-sequence](../README.md) / Append

# Class: Append&lt;T&gt;

Defined in: [state/create-rope-sequence.ts:407](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L407)

Internal node in the rope sequence tree structure.
Combines two child rope sequences (left and right) without copying their elements.

## Extends

- `AbstractRopeSequence`&lt;`T`&gt;

## Type Parameters

| Type Parameter | Description                                      |
| -------------- | ------------------------------------------------ |
| `T`            | The type of elements stored in this rope subtree |

## Implements

- [`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt;

## Constructors

### Constructor

```ts
new Append<T>(left, right): Append<T>;
```

Defined in: [state/create-rope-sequence.ts:432](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L432)

Create an internal node combining two rope sequences.

#### Parameters

| Parameter | Type                                                                                | Description                   |
| --------- | ----------------------------------------------------------------------------------- | ----------------------------- |
| `left`    | [`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt; | The left child rope sequence  |
| `right`   | [`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt; | The right child rope sequence |

#### Returns

`Append`&lt;`T`&gt;

#### Overrides

```ts
AbstractRopeSequence<T>.constructor
```

## Properties

| Property                                              | Modifier   | Type     | Default value | Description                                                                                                                                     | Overrides                                                                                                                                                                              | Inherited from                        | Defined in                                                                                                                                                                     |
| ----------------------------------------------------- | ---------- | -------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="property-depth"></a> `depth`                   | `readonly` | `number` | `undefined`   | The depth of this subtree in the overall rope structure.                                                                                        | [`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md).[`depth`](../../../types/RopeSequence/interfaces/RopeSequence.md#property-depth) `AbstractRopeSequence.depth` | -                                     | [state/create-rope-sequence.ts:412](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L412) |
| <a id="property-good_leaf_size"></a> `GOOD_LEAF_SIZE` | `readonly` | `200`    | `200`         | The maximum size for a leaf node before it should be split into an internal node. This value balances between memory efficiency and tree depth. | -                                                                                                                                                                                      | `AbstractRopeSequence.GOOD_LEAF_SIZE` | [state/create-rope-sequence.ts:23](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L23)   |

## Accessors

### length

#### Get Signature

```ts
get length(): number;
```

Defined in: [state/create-rope-sequence.ts:440](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L440)

The total number of elements in this rope sequence.

##### Returns

`number`

The total number of elements in this rope sequence.

#### Implementation of

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md).[`length`](../../../types/RopeSequence/interfaces/RopeSequence.md#property-length)

#### Overrides

```ts
AbstractRopeSequence.length;
```

## Methods

### append()

```ts
append(other): RopeSequence<T>;
```

Defined in: [state/create-rope-sequence.ts:46](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L46)

Append an array or other rope to this one, returning a new rope.

This operation is optimized to reuse existing structure when possible and only
creates new nodes as necessary. If the current rope is empty, returns the other rope.
Attempts to perform leaf-level merging before creating internal nodes.

#### Parameters

| Parameter | Type                                                                                            | Description                          |
| --------- | ----------------------------------------------------------------------------------------------- | ------------------------------------ |
| `other`   | \| [`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt; \| `T`[] | The array or rope sequence to append |

#### Returns

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt;

A new rope sequence containing all elements from this rope followed by elements from other

#### Implementation of

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md).[`append`](../../../types/RopeSequence/interfaces/RopeSequence.md#append)

#### Inherited from

```ts
AbstractRopeSequence.append;
```

---

### appendInner()

```ts
appendInner(other): RopeSequence<T>;
```

Defined in: [state/create-rope-sequence.ts:501](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L501)

Internal method to create an Append node combining two ropes.
Can be overridden by subclasses to implement balancing strategies.

#### Parameters

| Parameter | Type                                                                                | Description                 |
| --------- | ----------------------------------------------------------------------------------- | --------------------------- |
| `other`   | [`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt; | The rope sequence to append |

#### Returns

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt;

A new rope sequence combining this and other

#### Implementation of

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md).[`appendInner`](../../../types/RopeSequence/interfaces/RopeSequence.md#appendinner)

#### Overrides

```ts
AbstractRopeSequence.appendInner;
```

---

### flatten()

```ts
flatten(): T[];
```

Defined in: [state/create-rope-sequence.ts:449](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L449)

Recursively flattens both child ropes and concatenates the results.

#### Returns

`T`[]

A single array containing all elements from both child ropes

#### Implementation of

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md).[`flatten`](../../../types/RopeSequence/interfaces/RopeSequence.md#flatten)

#### Overrides

```ts
AbstractRopeSequence.flatten;
```

---

### forEach()

```ts
forEach(
   callbackFunc,
   from?,
   to?): void;
```

Defined in: [state/create-rope-sequence.ts:152](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L152)

Call the given function for each element between the given indices.

This is more efficient than looping over indices and calling `get`, because it doesn't
have to descend the tree for every element. The callback can return false to stop iteration early.

When from \> to, iterates in reverse order.

#### Parameters

| Parameter      | Type                              | Default value | Description                                                                    |
| -------------- | --------------------------------- | ------------- | ------------------------------------------------------------------------------ |
| `callbackFunc` | (`element`, `index`) => `boolean` | `undefined`   | Callback function to execute for each element. Return false to stop iteration. |
| `from`         | `number`                          | `0`           | The start index (inclusive), defaults to 0                                     |
| `to`           | `number`                          | `...`         | The end index (exclusive), defaults to the length of the rope                  |

#### Returns

`void`

#### Implementation of

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md).[`forEach`](../../../types/RopeSequence/interfaces/RopeSequence.md#foreach)

#### Inherited from

```ts
AbstractRopeSequence.forEach;
```

---

### forEachInner()

```ts
forEachInner(
   callbackFunc,
   from,
   to,
   start): boolean;
```

Defined in: [state/create-rope-sequence.ts:453](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L453)

Internal implementation of forward forEach operation.

#### Parameters

| Parameter      | Type                              | Description                                            |
| -------------- | --------------------------------- | ------------------------------------------------------ |
| `callbackFunc` | (`element`, `index`) => `boolean` | -                                                      |
| `from`         | `number`                          | The start index within this subtree (inclusive)        |
| `to`           | `number`                          | The end index within this subtree (exclusive)          |
| `start`        | `number`                          | The offset to add to indices when calling the callback |

#### Returns

`boolean`

False if iteration was stopped early, undefined otherwise

#### Implementation of

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md).[`forEachInner`](../../../types/RopeSequence/interfaces/RopeSequence.md#foreachinner)

#### Overrides

```ts
AbstractRopeSequence.forEachInner;
```

---

### forEachInvertedInner()

```ts
forEachInvertedInner(
   callbackFunc,
   from,
   to,
   start): boolean;
```

Defined in: [state/create-rope-sequence.ts:469](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L469)

Internal implementation of reverse forEach operation.

#### Parameters

| Parameter      | Type                              | Description                                            |
| -------------- | --------------------------------- | ------------------------------------------------------ |
| `callbackFunc` | (`element`, `index`) => `boolean` | -                                                      |
| `from`         | `number`                          | The start index within this subtree (inclusive)        |
| `to`           | `number`                          | The end index within this subtree (exclusive)          |
| `start`        | `number`                          | The offset to add to indices when calling the callback |

#### Returns

`boolean`

False if iteration was stopped early, undefined otherwise

#### Implementation of

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md).[`forEachInvertedInner`](../../../types/RopeSequence/interfaces/RopeSequence.md#foreachinvertedinner)

#### Overrides

```ts
AbstractRopeSequence.forEachInvertedInner;
```

---

### from()

```ts
protected from(values): RopeSequence<T>;
```

Defined in: [state/create-rope-sequence.ts:542](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L542)

Create a rope sequence from an array or return the rope if already a rope.

#### Parameters

| Parameter | Type                                                                                            | Description                           |
| --------- | ----------------------------------------------------------------------------------------------- | ------------------------------------- |
| `values`  | \| [`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt; \| `T`[] | The array or rope sequence to convert |

#### Returns

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt;

A rope sequence

#### Overrides

```ts
AbstractRopeSequence.from;
```

---

### get()

```ts
get(i): T;
```

Defined in: [state/create-rope-sequence.ts:133](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L133)

Retrieve the element at the given position from this rope.

This operation has O(log n) time complexity as it needs to traverse
the tree structure to find the element.

#### Parameters

| Parameter | Type     | Description                                    |
| --------- | -------- | ---------------------------------------------- |
| `i`       | `number` | The index of the element to retrieve (0-based) |

#### Returns

`T`

The element at the specified index, or undefined if the index is out of bounds

#### Implementation of

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md).[`get`](../../../types/RopeSequence/interfaces/RopeSequence.md#get)

#### Inherited from

```ts
AbstractRopeSequence.get;
```

---

### getEmptySequence()

```ts
protected getEmptySequence(): RopeSequence<T>;
```

Defined in: [state/create-rope-sequence.ts:538](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L538)

Get an empty rope sequence of the same type.

#### Returns

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt;

An empty rope sequence

#### Overrides

```ts
AbstractRopeSequence.getEmptySequence;
```

---

### getInner()

```ts
protected getInner(elementIndex): T;
```

Defined in: [state/create-rope-sequence.ts:514](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L514)

Retrieves an element by determining which child rope contains it.

#### Parameters

| Parameter      | Type     | Description                          |
| -------------- | -------- | ------------------------------------ |
| `elementIndex` | `number` | The index of the element to retrieve |

#### Returns

`T`

The element at the specified index

#### Overrides

```ts
AbstractRopeSequence.getInner;
```

---

### leafAppend()

```ts
leafAppend(other): RopeSequence<T>;
```

Defined in: [state/create-rope-sequence.ts:485](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L485)

Try to append another rope to this one at the leaf level.

This is an optimization that attempts to merge small sequences without creating
additional tree nodes. Returns undefined if merging is not possible.

#### Parameters

| Parameter | Type                                                                                | Description                 |
| --------- | ----------------------------------------------------------------------------------- | --------------------------- |
| `other`   | [`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt; | The rope sequence to append |

#### Returns

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt;

A new merged rope sequence, or undefined if leaf-level append is not possible

#### Implementation of

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md).[`leafAppend`](../../../types/RopeSequence/interfaces/RopeSequence.md#leafappend)

#### Overrides

```ts
AbstractRopeSequence.leafAppend;
```

---

### leafPrepend()

```ts
leafPrepend(other): RopeSequence<T>;
```

Defined in: [state/create-rope-sequence.ts:493](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L493)

Try to prepend another rope to this one at the leaf level.

This is an optimization that attempts to merge small sequences without creating
additional tree nodes. Returns undefined if merging is not possible.

#### Parameters

| Parameter | Type                                                                                | Description                  |
| --------- | ----------------------------------------------------------------------------------- | ---------------------------- |
| `other`   | [`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt; | The rope sequence to prepend |

#### Returns

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt;

A new merged rope sequence, or undefined if leaf-level prepend is not possible

#### Implementation of

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md).[`leafPrepend`](../../../types/RopeSequence/interfaces/RopeSequence.md#leafprepend)

#### Overrides

```ts
AbstractRopeSequence.leafPrepend;
```

---

### map()

```ts
map<U>(
   callbackFunc,
   from?,
   to?): U[];
```

Defined in: [state/create-rope-sequence.ts:174](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L174)

Map the given function over the elements of the rope, producing a flat array.

Creates a new array by applying the callback function to each element in the
specified range of the rope sequence.

#### Type Parameters

| Type Parameter | Description                                 |
| -------------- | ------------------------------------------- |
| `U`            | The type of elements in the resulting array |

#### Parameters

| Parameter      | Type                        | Default value | Description                                                   |
| -------------- | --------------------------- | ------------- | ------------------------------------------------------------- |
| `callbackFunc` | (`element`, `index`) => `U` | `undefined`   | Function to apply to each element                             |
| `from`         | `number`                    | `0`           | The start index (inclusive), defaults to 0                    |
| `to`           | `number`                    | `...`         | The end index (exclusive), defaults to the length of the rope |

#### Returns

`U`[]

A new array containing the transformed elements

#### Implementation of

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md).[`map`](../../../types/RopeSequence/interfaces/RopeSequence.md#map)

#### Inherited from

```ts
AbstractRopeSequence.map;
```

---

### prepend()

```ts
prepend(other): RopeSequence<T>;
```

Defined in: [state/create-rope-sequence.ts:88](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L88)

Prepend an array or other rope to this one, returning a new rope.

This is implemented by converting the input to a rope and appending the current rope to it.

#### Parameters

| Parameter | Type                                                                                            | Description                           |
| --------- | ----------------------------------------------------------------------------------------------- | ------------------------------------- |
| `other`   | \| [`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt; \| `T`[] | The array or rope sequence to prepend |

#### Returns

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt;

A new rope sequence containing all elements from other followed by elements from this rope

#### Implementation of

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md).[`prepend`](../../../types/RopeSequence/interfaces/RopeSequence.md#prepend)

#### Inherited from

```ts
AbstractRopeSequence.prepend;
```

---

### slice()

```ts
slice(from?, to?): RopeSequence<T>;
```

Defined in: [state/create-rope-sequence.ts:117](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L117)

Create a rope representing a sub-sequence of this rope.

Returns a new rope containing only the elements between the specified indices.
Indices are clamped to valid bounds automatically.

#### Parameters

| Parameter | Type     | Default value | Description                                                   |
| --------- | -------- | ------------- | ------------------------------------------------------------- |
| `from`    | `number` | `0`           | The start index (inclusive), defaults to 0                    |
| `to`      | `number` | `...`         | The end index (exclusive), defaults to the length of the rope |

#### Returns

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt;

A new rope sequence containing elements from [from, to)

#### Implementation of

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md).[`slice`](../../../types/RopeSequence/interfaces/RopeSequence.md#slice)

#### Inherited from

```ts
AbstractRopeSequence.slice;
```

---

### sliceInner()

```ts
protected sliceInner(from, to): RopeSequence<T>;
```

Defined in: [state/create-rope-sequence.ts:524](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/history/src/state/create-rope-sequence.ts#L524)

Internal implementation of slice operation.
Assumes from and to are already validated and within bounds.

#### Parameters

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `from`    | `number` | The start index (inclusive) |
| `to`      | `number` | The end index (exclusive)   |

#### Returns

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt;

A new rope sequence containing elements from [from, to)

#### Overrides

```ts
AbstractRopeSequence.sliceInner;
```

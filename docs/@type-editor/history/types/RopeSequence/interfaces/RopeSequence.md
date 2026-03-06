[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [types/RopeSequence](../README.md) / RopeSequence

# Interface: RopeSequence&lt;T&gt;

Defined in: [types/RopeSequence.ts:2](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/RopeSequence.ts#L2)

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Properties

| Property                              | Modifier   | Type     | Description                                                                                                           | Defined in                                                                                                                                                   |
| ------------------------------------- | ---------- | -------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <a id="property-depth"></a> `depth`   | `readonly` | `number` | The depth of the tree structure. Leaf nodes have depth 0, internal nodes have depth max(left.depth, right.depth) + 1. | [types/RopeSequence.ts:8](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/RopeSequence.ts#L8)   |
| <a id="property-length"></a> `length` | `readonly` | `number` | The total number of elements in this rope sequence.                                                                   | [types/RopeSequence.ts:13](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/RopeSequence.ts#L13) |

## Methods

### append()

```ts
append(other): RopeSequence<T>;
```

Defined in: [types/RopeSequence.ts:25](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/RopeSequence.ts#L25)

Append an array or other rope to this one, returning a new rope.

This operation is optimized to reuse existing structure when possible and only
creates new nodes as necessary. If the current rope is empty, returns the other rope.
Attempts to perform leaf-level merging before creating internal nodes.

#### Parameters

| Parameter | Type                               | Description                          |
| --------- | ---------------------------------- | ------------------------------------ |
| `other`   | `RopeSequence`&lt;`T`&gt; \| `T`[] | The array or rope sequence to append |

#### Returns

`RopeSequence`&lt;`T`&gt;

A new rope sequence containing all elements from this rope followed by elements from other

---

### appendInner()

```ts
appendInner(other): RopeSequence<T>;
```

Defined in: [types/RopeSequence.ts:44](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/RopeSequence.ts#L44)

Internal method to create an Append node combining two ropes.
Can be overridden by subclasses to implement balancing strategies.

#### Parameters

| Parameter | Type                      | Description                 |
| --------- | ------------------------- | --------------------------- |
| `other`   | `RopeSequence`&lt;`T`&gt; | The rope sequence to append |

#### Returns

`RopeSequence`&lt;`T`&gt;

A new rope sequence combining this and other

---

### flatten()

```ts
flatten(): T[];
```

Defined in: [types/RopeSequence.ts:101](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/RopeSequence.ts#L101)

#### Returns

`T`[]

---

### forEach()

```ts
forEach(
   callbackFunc,
   from?,
   to?): void;
```

Defined in: [types/RopeSequence.ts:81](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/RopeSequence.ts#L81)

Call the given function for each element between the given indices.

This is more efficient than looping over indices and calling `get`, because it doesn't
have to descend the tree for every element. The callback can return false to stop iteration early.

When from \> to, iterates in reverse order.

#### Parameters

| Parameter      | Type                              | Description                                                                    |
| -------------- | --------------------------------- | ------------------------------------------------------------------------------ |
| `callbackFunc` | (`element`, `index`) => `boolean` | Callback function to execute for each element. Return false to stop iteration. |
| `from?`        | `number`                          | The start index (inclusive), defaults to 0                                     |
| `to?`          | `number`                          | The end index (exclusive), defaults to the length of the rope                  |

#### Returns

`void`

---

### forEachInner()

```ts
forEachInner(
   f,
   from,
   to,
   start): boolean;
```

Defined in: [types/RopeSequence.ts:107](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/RopeSequence.ts#L107)

#### Parameters

| Parameter | Type                              |
| --------- | --------------------------------- |
| `f`       | (`element`, `index`) => `boolean` |
| `from`    | `number`                          |
| `to`      | `number`                          |
| `start`   | `number`                          |

#### Returns

`boolean`

---

### forEachInvertedInner()

```ts
forEachInvertedInner(
   f,
   from,
   to,
   start): boolean;
```

Defined in: [types/RopeSequence.ts:109](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/RopeSequence.ts#L109)

#### Parameters

| Parameter | Type                              |
| --------- | --------------------------------- |
| `f`       | (`element`, `index`) => `boolean` |
| `from`    | `number`                          |
| `to`      | `number`                          |
| `start`   | `number`                          |

#### Returns

`boolean`

---

### get()

```ts
get(i): T;
```

Defined in: [types/RopeSequence.ts:67](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/RopeSequence.ts#L67)

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

---

### leafAppend()

```ts
leafAppend(other): RopeSequence<T>;
```

Defined in: [types/RopeSequence.ts:103](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/RopeSequence.ts#L103)

#### Parameters

| Parameter | Type                      |
| --------- | ------------------------- |
| `other`   | `RopeSequence`&lt;`T`&gt; |

#### Returns

`RopeSequence`&lt;`T`&gt;

---

### leafPrepend()

```ts
leafPrepend(other): RopeSequence<T>;
```

Defined in: [types/RopeSequence.ts:105](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/RopeSequence.ts#L105)

#### Parameters

| Parameter | Type                      |
| --------- | ------------------------- |
| `other`   | `RopeSequence`&lt;`T`&gt; |

#### Returns

`RopeSequence`&lt;`T`&gt;

---

### map()

```ts
map<U>(
   callbackFunc,
   from,
   to): U[];
```

Defined in: [types/RopeSequence.ts:97](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/RopeSequence.ts#L97)

Map the given function over the elements of the rope, producing a flat array.

Creates a new array by applying the callback function to each element in the
specified range of the rope sequence.

#### Type Parameters

| Type Parameter | Description                                 |
| -------------- | ------------------------------------------- |
| `U`            | The type of elements in the resulting array |

#### Parameters

| Parameter      | Type                        | Description                                                   |
| -------------- | --------------------------- | ------------------------------------------------------------- |
| `callbackFunc` | (`element`, `index`) => `U` | Function to apply to each element                             |
| `from`         | `number`                    | The start index (inclusive), defaults to 0                    |
| `to`           | `number`                    | The end index (exclusive), defaults to the length of the rope |

#### Returns

`U`[]

A new array containing the transformed elements

---

### prepend()

```ts
prepend(other): RopeSequence<T>;
```

Defined in: [types/RopeSequence.ts:35](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/RopeSequence.ts#L35)

Prepend an array or other rope to this one, returning a new rope.

This is implemented by converting the input to a rope and appending the current rope to it.

#### Parameters

| Parameter | Type                               | Description                           |
| --------- | ---------------------------------- | ------------------------------------- |
| `other`   | `RopeSequence`&lt;`T`&gt; \| `T`[] | The array or rope sequence to prepend |

#### Returns

`RopeSequence`&lt;`T`&gt;

A new rope sequence containing all elements from other followed by elements from this rope

---

### slice()

```ts
slice(from?, to?): RopeSequence<T>;
```

Defined in: [types/RopeSequence.ts:56](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/types/RopeSequence.ts#L56)

Create a rope representing a sub-sequence of this rope.

Returns a new rope containing only the elements between the specified indices.
Indices are clamped to valid bounds automatically.

#### Parameters

| Parameter | Type     | Description                                                   |
| --------- | -------- | ------------------------------------------------------------- |
| `from?`   | `number` | The start index (inclusive), defaults to 0                    |
| `to?`     | `number` | The end index (exclusive), defaults to the length of the rope |

#### Returns

`RopeSequence`&lt;`T`&gt;

A new rope sequence containing elements from [from, to)

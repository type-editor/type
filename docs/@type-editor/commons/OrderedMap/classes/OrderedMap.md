[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commons](../../README.md) / [OrderedMap](../README.md) / OrderedMap

# Class: OrderedMap&lt;T&gt;

Defined in: [OrderedMap.ts:7](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L7)

Persistent data structure representing an ordered mapping from
strings to values, with some convenient update methods.

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Constructors

### Constructor

```ts
new OrderedMap<T>(content): OrderedMap<T>;
```

Defined in: [OrderedMap.ts:19](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L19)

Create a new OrderedMap with the given content array.

#### Parameters

| Parameter | Type                | Description                                                            |
| --------- | ------------------- | ---------------------------------------------------------------------- |
| `content` | (`string` \| `T`)[] | Array of alternating keys and values [key1, value1, key2, value2, ...] |

#### Returns

`OrderedMap`&lt;`T`&gt;

## Accessors

### size

#### Get Signature

```ts
get size(): number;
```

Defined in: [OrderedMap.ts:30](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L30)

The amount of keys in this map.

##### Returns

`number`

---

### type

#### Get Signature

```ts
get type(): string;
```

Defined in: [OrderedMap.ts:23](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L23)

##### Returns

`string`

## Methods

### addBefore()

```ts
addBefore(
   place,
   key,
   value): OrderedMap<T>;
```

Defined in: [OrderedMap.ts:172](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L172)

Add the given key/value before `place`. If `place` is not found,
the new key is added to the end.

#### Parameters

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `place`   | `string` | The key to add before |
| `key`     | `string` | The key to add        |
| `value`   | `T`      | The value to add      |

#### Returns

`OrderedMap`&lt;`T`&gt;

A new OrderedMap with the key added before the place key

---

### addToEnd()

```ts
addToEnd(key, value): OrderedMap<T>;
```

Defined in: [OrderedMap.ts:158](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L158)

Add a new key to the end of the map.

#### Parameters

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `key`     | `string` | The key to add   |
| `value`   | `T`      | The value to add |

#### Returns

`OrderedMap`&lt;`T`&gt;

A new OrderedMap with the key added at the end

---

### addToStart()

```ts
addToStart(key, value): OrderedMap<T>;
```

Defined in: [OrderedMap.ts:148](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L148)

Add a new key to the start of the map.

#### Parameters

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `key`     | `string` | The key to add   |
| `value`   | `T`      | The value to add |

#### Returns

`OrderedMap`&lt;`T`&gt;

A new OrderedMap with the key added at the start

---

### append()

```ts
append(map): OrderedMap<T>;
```

Defined in: [OrderedMap.ts:211](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L211)

Create a new map by appending the keys in this map that don't
appear in `map` after the keys in `map`.

#### Parameters

| Parameter | Type                                                     | Description                     |
| --------- | -------------------------------------------------------- | ------------------------------- |
| `map`     | `OrderedMap`&lt;`T`&gt; \| `Record`&lt;`string`, `T`&gt; | The map to append, or an object |

#### Returns

`OrderedMap`&lt;`T`&gt;

A new OrderedMap with the appended keys

---

### find()

```ts
find(key): number;
```

Defined in: [OrderedMap.ts:82](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L82)

**`Internal`**

Find the index of a key in the content array.

#### Parameters

| Parameter | Type     | Description     |
| --------- | -------- | --------------- |
| `key`     | `string` | The key to find |

#### Returns

`number`

The index of the key, or -1 if not found

---

### forEach()

```ts
forEach(f): void;
```

Defined in: [OrderedMap.ts:185](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L185)

Call the given function for each key/value pair in the map, in
order.

#### Parameters

| Parameter | Type                       | Description                              |
| --------- | -------------------------- | ---------------------------------------- |
| `f`       | (`key`, `value`) => `void` | Function to call for each key/value pair |

#### Returns

`void`

---

### get()

```ts
get(key): T;
```

Defined in: [OrderedMap.ts:97](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L97)

Retrieve the value stored under `key`, or return undefined when
no such key exists.

#### Parameters

| Parameter | Type     | Description         |
| --------- | -------- | ------------------- |
| `key`     | `string` | The key to retrieve |

#### Returns

`T`

The value associated with the key, or undefined

---

### prepend()

```ts
prepend(map): OrderedMap<T>;
```

Defined in: [OrderedMap.ts:197](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L197)

Create a new map by prepending the keys in this map that don't
appear in `map` before the keys in `map`.

#### Parameters

| Parameter | Type                                                     | Description                      |
| --------- | -------------------------------------------------------- | -------------------------------- |
| `map`     | `OrderedMap`&lt;`T`&gt; \| `Record`&lt;`string`, `T`&gt; | The map to prepend, or an object |

#### Returns

`OrderedMap`&lt;`T`&gt;

A new OrderedMap with the prepended keys

---

### remove()

```ts
remove(key): OrderedMap<T>;
```

Defined in: [OrderedMap.ts:131](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L131)

Return a map with the given key removed, if it existed.

#### Parameters

| Parameter | Type     | Description       |
| --------- | -------- | ----------------- |
| `key`     | `string` | The key to remove |

#### Returns

`OrderedMap`&lt;`T`&gt;

A new OrderedMap with the key removed

---

### subtract()

```ts
subtract(map): OrderedMap<T>;
```

Defined in: [OrderedMap.ts:225](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L225)

Create a map containing all the keys in this map that don't
appear in `map`.

#### Parameters

| Parameter | Type                                                     | Description                       |
| --------- | -------------------------------------------------------- | --------------------------------- |
| `map`     | `OrderedMap`&lt;`T`&gt; \| `Record`&lt;`string`, `T`&gt; | The map to subtract, or an object |

#### Returns

`OrderedMap`&lt;`T`&gt;

A new OrderedMap with the subtracted keys

---

### toObject()

```ts
toObject(): Record<string, T>;
```

Defined in: [OrderedMap.ts:245](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L245)

Turn ordered map into a plain object.

#### Returns

`Record`&lt;`string`, `T`&gt;

A plain object representation of the map

---

### update()

```ts
update(
   key,
   value,
   newKey?): OrderedMap<T>;
```

Defined in: [OrderedMap.ts:111](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L111)

Create a new map by replacing the value of `key` with a new
value, or adding a binding to the end of the map. If `newKey` is
given, the key of the binding will be replaced with that key.

#### Parameters

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `key`     | `string` | The key to update     |
| `value`   | `T`      | The new value         |
| `newKey?` | `string` | Optional new key name |

#### Returns

`OrderedMap`&lt;`T`&gt;

A new OrderedMap with the update applied

---

### from()

```ts
static from<T>(value): OrderedMap<T>;
```

Defined in: [OrderedMap.ts:41](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commons/src/OrderedMap.ts#L41)

Return a map with the given content. If null, create an empty
map. If given an ordered map, return that map itself. If given an
object, create a map from the object's properties.

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

#### Parameters

| Parameter | Type                                                     | Description                    |
| --------- | -------------------------------------------------------- | ------------------------------ |
| `value`   | `OrderedMap`&lt;`T`&gt; \| `Record`&lt;`string`, `T`&gt; | The value to create a map from |

#### Returns

`OrderedMap`&lt;`T`&gt;

An OrderedMap

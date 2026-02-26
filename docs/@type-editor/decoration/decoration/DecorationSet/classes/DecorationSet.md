[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/decoration](../../../README.md) / [decoration/DecorationSet](../README.md) / DecorationSet

# Class: DecorationSet

Defined in: [decoration/DecorationSet.ts:37](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/DecorationSet.ts#L37)

A collection of [decorations](#view.Decoration), organized in such
a way that the drawing algorithm can efficiently use and compare
them. This is a persistent data structure—it is not modified,
updates create a new value.

The decoration set organizes decorations hierarchically according to
the document structure, allowing for efficient updates when the document
changes. Decorations are stored both locally (applying to the current node)
and in child sets (applying to child nodes).

## Example

```typescript
// Create a decoration set from decorations
const decorations = [Decoration.inline(0, 5, { class: "highlight" })];
const decoSet = DecorationSet.create(doc, decorations);

// Map through a document change
const mapped = decoSet.map(mapping, newDoc);

// Find decorations in a range
const found = decoSet.find(10, 20);
```

## Extends

- [`AbstractDecorationSource`](../../AbstractDecorationSource/classes/AbstractDecorationSource.md)

## Implements

- `DecorationSource`

## Constructors

### Constructor

```ts
new DecorationSet(local?, children?): DecorationSet;
```

Defined in: [decoration/DecorationSet.ts:61](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/DecorationSet.ts#L61)

Creates a new decoration set.

#### Parameters

| Parameter   | Type                                     | Description                                                                |
| ----------- | ---------------------------------------- | -------------------------------------------------------------------------- |
| `local?`    | readonly `PmDecoration`[]                | Decorations that apply to this node level                                  |
| `children?` | readonly (`number` \| `DecorationSet`)[] | Child decoration sets in the format [startPos, endPos, DecorationSet, ...] |

#### Returns

`DecorationSet`

#### Overrides

[`AbstractDecorationSource`](../../AbstractDecorationSource/classes/AbstractDecorationSource.md).[`constructor`](../../AbstractDecorationSource/classes/AbstractDecorationSource.md#constructor)

## Properties

| Property                                                                                | Modifier   | Type                              | Default value | Description                                                                                    | Inherited from                                                                                                                                                                                                                                    | Defined in                                                                                                                                                                                        |
| --------------------------------------------------------------------------------------- | ---------- | --------------------------------- | ------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-empty"></a> `empty`                                                     | `static`   | `DecorationSet`                   | `undefined`   | The empty set of decorations. Use this constant instead of creating new empty decoration sets. | -                                                                                                                                                                                                                                                 | [decoration/DecorationSet.ts:510](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/DecorationSet.ts#L510)                     |
| <a id="property-empty_decoration_widget_options"></a> `EMPTY_DECORATION_WIDGET_OPTIONS` | `readonly` | `Record`&lt;`string`, `never`&gt; | `{}`          | Empty options object used as default to avoid repeated allocations                             | [`AbstractDecorationSource`](../../AbstractDecorationSource/classes/AbstractDecorationSource.md).[`EMPTY_DECORATION_WIDGET_OPTIONS`](../../AbstractDecorationSource/classes/AbstractDecorationSource.md#property-empty_decoration_widget_options) | [decoration/AbstractDecorationSource.ts:14](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/AbstractDecorationSource.ts#L14) |

## Accessors

### children

#### Get Signature

```ts
get children(): readonly (number | DecorationSet)[];
```

Defined in: [decoration/DecorationSet.ts:90](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/DecorationSet.ts#L90)

Get child decoration sets organized as [startPos, endPos, DecorationSet, ...].

The array contains triplets where each triplet represents a child node:

- Index i: start position of the child
- Index i+1: end position of the child (startPos + nodeSize)
- Index i+2: DecorationSet containing decorations for that child

##### Returns

readonly (`number` \| `DecorationSet`)[]

Read-only array of child positions and decoration sets

---

### local

#### Get Signature

```ts
get local(): readonly PmDecoration[];
```

Defined in: [decoration/DecorationSet.ts:76](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/DecorationSet.ts#L76)

Get the decorations that apply directly at this node level.

These are decorations that don't belong to any child node, such as
decorations that span across multiple children or widgets placed
between children.

##### Returns

readonly `PmDecoration`[]

Read-only array of local decorations

## Methods

### add()

```ts
add(doc, decorations): DecorationSet;
```

Defined in: [decoration/DecorationSet.ts:233](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/DecorationSet.ts#L233)

Add the given array of decorations to the ones in the set,
producing a new set. Consumes the `decorations` array. Needs
access to the current document to create the appropriate tree
structure.

#### Parameters

| Parameter     | Type             | Description                                      |
| ------------- | ---------------- | ------------------------------------------------ |
| `doc`         | `Node_2`         | The document node to organize decorations around |
| `decorations` | `PmDecoration`[] | Array of decorations to add (will be mutated)    |

#### Returns

`DecorationSet`

A new decoration set with the added decorations

---

### eq()

```ts
eq(other): boolean;
```

Defined in: [decoration/DecorationSet.ts:439](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/DecorationSet.ts#L439)

Check if this decoration set is equal to another decoration set.

#### Parameters

| Parameter | Type            | Description                        |
| --------- | --------------- | ---------------------------------- |
| `other`   | `DecorationSet` | The decoration set to compare with |

#### Returns

`boolean`

True if the decoration sets are equal

#### Implementation of

```ts
DecorationSource.eq;
```

---

### find()

```ts
find(
   start?,
   end?,
   predicate?): PmDecoration[];
```

Defined in: [decoration/DecorationSet.ts:121](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/DecorationSet.ts#L121)

Find all decorations in this set which touch the given range
(including decorations that start or end directly at the
boundaries) and match the given predicate on their spec. When
`start` and `end` are omitted, all decorations in the set are
considered. When `predicate` isn't given, all decorations are
assumed to match.

#### Parameters

| Parameter    | Type                  | Description                                           |
| ------------ | --------------------- | ----------------------------------------------------- |
| `start?`     | `number`              | Starting position of the range to search (default: 0) |
| `end?`       | `number`              | Ending position of the range to search (default: 1e9) |
| `predicate?` | (`spec`) => `boolean` | Optional function to filter decorations by their spec |

#### Returns

`PmDecoration`[]

Array of decorations that match the criteria

---

### forChild()

```ts
forChild(offset, node):
  | DecorationSet
  | DecorationGroup;
```

Defined in: [decoration/DecorationSet.ts:388](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/DecorationSet.ts#L388)

Get the decorations relevant for a child node.

#### Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `offset`  | `number` | The offset position of the child node |
| `node`    | `Node_2` | The child node                        |

#### Returns

\| `DecorationSet`
\| [`DecorationGroup`](../../DecorationGroup/classes/DecorationGroup.md)

A decoration set or group for the child node

#### Implementation of

```ts
DecorationSource.forChild;
```

---

### forEachSet()

```ts
forEachSet(callbackFunc): void;
```

Defined in: [decoration/DecorationSet.ts:518](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/DecorationSet.ts#L518)

Iterate over all decoration sets, calling the callback for each one.
For a single DecorationSet, this just calls the callback once with itself.

#### Parameters

| Parameter      | Type              | Description                               |
| -------------- | ----------------- | ----------------------------------------- |
| `callbackFunc` | (`set`) => `void` | Function to call with this decoration set |

#### Returns

`void`

#### Implementation of

```ts
DecorationSource.forEachSet;
```

---

### locals()

```ts
locals(node): PmDecoration[];
```

Defined in: [decoration/DecorationSet.ts:475](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/DecorationSet.ts#L475)

Get the local decorations for a node, with overlaps removed.

#### Parameters

| Parameter | Type     | Description                     |
| --------- | -------- | ------------------------------- |
| `node`    | `Node_2` | The node to get decorations for |

#### Returns

`PmDecoration`[]

Array of decorations with overlaps removed

#### Implementation of

```ts
DecorationSource.locals;
```

---

### localsInner()

```ts
localsInner(node): readonly PmDecoration[];
```

Defined in: [decoration/DecorationSet.ts:486](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/DecorationSet.ts#L486)

Get the local decorations for a node, filtering out inline decorations
if the node contains block content.

#### Parameters

| Parameter | Type     | Description                     |
| --------- | -------- | ------------------------------- |
| `node`    | `Node_2` | The node to get decorations for |

#### Returns

readonly `PmDecoration`[]

Array of local decorations appropriate for the node

---

### map()

```ts
map(
   mapping,
   doc,
   options?): DecorationSet;
```

Defined in: [decoration/DecorationSet.ts:170](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/DecorationSet.ts#L170)

Map the set of decorations in response to a change in the
document.

#### Parameters

| Parameter           | Type                                             | Description                                                              |
| ------------------- | ------------------------------------------------ | ------------------------------------------------------------------------ |
| `mapping`           | `Mapping`                                        | The mapping object representing document changes                         |
| `doc`               | `Node_2`                                         | The updated document node                                                |
| `options?`          | \{ `onRemove?`: (`decorationSpec`) => `void`; \} | Optional configuration object                                            |
| `options.onRemove?` | (`decorationSpec`) => `void`                     | Callback invoked for each decoration that gets dropped, passing its spec |

#### Returns

`DecorationSet`

A new decoration set with mapped decorations

#### Implementation of

```ts
DecorationSource.map;
```

---

### mapInner()

```ts
mapInner(
   mapping,
   node,
   offset,
   oldOffset,
   options): DecorationSet;
```

Defined in: [decoration/DecorationSet.ts:189](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/DecorationSet.ts#L189)

Internal recursive method to map decorations through document changes.

#### Parameters

| Parameter           | Type                                             | Description                                   |
| ------------------- | ------------------------------------------------ | --------------------------------------------- |
| `mapping`           | `Mapping`                                        | The mapping object                            |
| `node`              | `Node_2`                                         | The current node being processed              |
| `offset`            | `number`                                         | Current position offset in the new document   |
| `oldOffset`         | `number`                                         | Position offset in the old document           |
| `options`           | \{ `onRemove?`: (`decorationSpec`) => `void`; \} | Configuration with optional onRemove callback |
| `options.onRemove?` | (`decorationSpec`) => `void`                     | -                                             |

#### Returns

`DecorationSet`

A new mapped decoration set

---

### remove()

```ts
remove(decorations): DecorationSet;
```

Defined in: [decoration/DecorationSet.ts:299](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/DecorationSet.ts#L299)

Create a new set that contains the decorations in this set, minus
the ones in the given array.

#### Parameters

| Parameter     | Type             | Description                    |
| ------------- | ---------------- | ------------------------------ |
| `decorations` | `PmDecoration`[] | Array of decorations to remove |

#### Returns

`DecorationSet`

A new decoration set without the removed decorations, or this if nothing changed

---

### removeOverlap()

```ts
protected removeOverlap(spans): PmDecoration[];
```

Defined in: [decoration/AbstractDecorationSource.ts:25](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/AbstractDecorationSource.ts#L25)

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

### create()

```ts
static create(doc, decorations): DecorationSet;
```

Defined in: [decoration/DecorationSet.ts:104](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/DecorationSet.ts#L104)

Create a set of decorations, using the structure of the given
document. This will consume (modify) the `decorations` array, so
you must make a copy if you want need to preserve that.

#### Parameters

| Parameter     | Type             | Description                                        |
| ------------- | ---------------- | -------------------------------------------------- |
| `doc`         | `Node_2`         | The document node to organize decorations around   |
| `decorations` | `PmDecoration`[] | Array of decorations to organize (will be mutated) |

#### Returns

`DecorationSet`

A new decoration set organized by the document structure

---

### sortDecorations()

```ts
protected static sortDecorations(spans): PmDecoration[];
```

Defined in: [decoration/AbstractDecorationSource.ts:96](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/AbstractDecorationSource.ts#L96)

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

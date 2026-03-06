[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [state/create-rope-sequence](../README.md) / createRopeSequence

# Function: createRopeSequence()

```ts
function createRopeSequence<T>(values): RopeSequence<T>;
```

Defined in: [state/create-rope-sequence.ts:575](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/history/src/state/create-rope-sequence.ts#L575)

Create a rope sequence from an array or return the rope if already a rope sequence.

This is a factory function that efficiently handles both array and rope sequence inputs.
If the input is already a rope sequence, it returns it unchanged. If it's an array,
it creates a new Leaf node, or returns an empty rope if the array is empty.

## Type Parameters

| Type Parameter | Description                               |
| -------------- | ----------------------------------------- |
| `T`            | The type of elements in the rope sequence |

## Parameters

| Parameter | Type                                                                                            | Description                           |
| --------- | ----------------------------------------------------------------------------------------------- | ------------------------------------- |
| `values`  | \| `T`[] \| [`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt; | The array or rope sequence to convert |

## Returns

[`RopeSequence`](../../../types/RopeSequence/interfaces/RopeSequence.md)&lt;`T`&gt;

A rope sequence containing the provided elements

## Example

```typescript
const rope1 = createRopeSequence([1, 2, 3]);
const rope2 = createRopeSequence(rope1); // Returns rope1
const empty = createRopeSequence([]); // Returns Leaf.EMPTY
```

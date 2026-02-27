[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/transpose](../README.md) / transpose

# Function: transpose()

```ts
function transpose<T>(array): T[][];
```

Defined in: [tables/src/utils/transpose.ts:25](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/utils/transpose.ts#L25)

Transposes a 2D array by flipping columns to rows.

Transposition is a familiar algebra concept where the matrix is flipped
along its diagonal. For more details, see:
https://en.wikipedia.org/wiki/Transpose

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Parameters

| Parameter | Type                      |
| --------- | ------------------------- |
| `array`   | readonly readonly `T`[][] |

## Returns

`T`[][]

## Example

```javascript
const arr = [
  ["a1", "a2", "a3"],
  ["b1", "b2", "b3"],
  ["c1", "c2", "c3"],
  ["d1", "d2", "d3"],
];

const result = transpose(arr);
result ===
  [
    ["a1", "b1", "c1", "d1"],
    ["a2", "b2", "c2", "d2"],
    ["a3", "b3", "c3", "d3"],
  ];
```

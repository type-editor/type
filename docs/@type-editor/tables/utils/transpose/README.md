[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / utils/transpose

# utils/transpose

## Functions

<table>
<thead>
<tr>
<th>Function</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[transpose](functions/transpose.md)

</td>
<td>

Transposes a 2D array by flipping columns to rows.

Transposition is a familiar algebra concept where the matrix is flipped
along its diagonal. For more details, see:
https://en.wikipedia.org/wiki/Transpose

**Example**

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

</td>
</tr>
</tbody>
</table>

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / elements/util/compare-deep

# elements/util/compare-deep

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

[compareDeep](functions/compareDeep.md)

</td>
<td>

Performs a deep equality comparison between two values.

This function recursively compares objects and arrays by their structure and content,
rather than by reference. It supports nested structures and handles various data types
including primitives, arrays, and plain objects.

**Comparison behavior:**

- Primitives are compared using Object.is (handles NaN correctly)
- Arrays are compared element-by-element (order matters)
- Objects are compared property-by-property (order doesn't matter)
- null and undefined are compared using strict equality
- Circular references are detected and handled safely

**Note:** This function is designed for comparing plain objects and arrays typically used
in ProseMirror attributes. It does not handle special object types like Date, RegExp,
Map, Set, or custom class instances.

**Example**

```typescript
compareDeep(1, 1); // true
compareDeep([1, 2], [1, 2]); // true
compareDeep({ a: 1 }, { a: 1 }); // true
compareDeep({ a: 1 }, { a: 2 }); // false
compareDeep([1, 2], [2, 1]); // false
compareDeep(NaN, NaN); // true
```

</td>
</tr>
</tbody>
</table>

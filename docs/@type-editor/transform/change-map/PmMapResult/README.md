[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/transform](../../README.md) / change-map/PmMapResult

# change-map/PmMapResult

## Classes

<table>
<thead>
<tr>
<th>Class</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[PmMapResult](classes/PmMapResult.md)

</td>
<td>

An object representing a mapped position with additional information about the mapping.

This class implements the `IMapResult` interface and provides detailed feedback about
what happened to a position during a document transformation. It includes the mapped
position itself, deletion information (as bitwise flags and convenient boolean properties),
and recovery values for handling mirrored transformations in collaborative editing scenarios.

The deletion flags indicate whether content was deleted before, after, or across the
position, which is crucial for correctly handling selections and cursor positions during
document changes.

**Example**

```typescript
// Map a position through a deletion
const stepMap = new StepMap([5, 10, 0]); // Delete 10 chars at position 5
const result = stepMap.mapResult(8, 1);

console.log(result.pos); // 5 (maps to deletion start)
console.log(result.deleted); // true (position was deleted)
console.log(result.deletedAcross); // true (deletion spans across position)
console.log(result.recover); // Recovery value if mirror exists, or null
```

**See**

- IMapResult for the interface definition
- StepMap.mapResult for the primary way to create MapResult instances

</td>
</tr>
</tbody>
</table>

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/editor-types](../../../README.md) / types/transform/MapResult

# types/transform/MapResult

## Interfaces

<table>
<thead>
<tr>
<th>Interface</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[MapResult](interfaces/MapResult.md)

</td>
<td>

An object representing a mapped position with additional information about the mapping.

This interface provides detailed feedback about what happened to a position during mapping,
including whether content was deleted and recovery information for mirrored transformations.
It is returned by the `mapResult()` method of objects implementing the `Mappable` interface.

**Example**

```typescript
const stepMap = new StepMap([2, 4, 0]); // Delete 4 characters at position 2
const result = stepMap.mapResult(4, 1);
console.log(result.pos); // Mapped position (2)
console.log(result.deleted); // true - position was deleted
console.log(result.deletedAcross); // true - deleted content spans across position
```

</td>
</tr>
</tbody>
</table>

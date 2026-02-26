[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/editor-types](../../../README.md) / types/transform/Mappable

# types/transform/Mappable

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

[Mappable](interfaces/Mappable.md)

</td>
<td>

Interface for objects that can map positions through document changes.

Objects implementing this interface provide position mapping functionality,
which is essential for tracking how positions in a document correspond to
positions after transformations (insertions, deletions, replacements).

The `assoc` parameter determines position behavior at boundaries:

- When `assoc` is -1 (left), the position is associated with the content before it
- When `assoc` is 1 (right), the position is associated with the content after it
- This matters when content is inserted exactly at the position

**Example**

```typescript
const stepMap = new StepMap([0, 0, 5]); // Insert 5 characters at position 0
const newPos = stepMap.map(0, 1); // Returns 5 (position moves after insertion)
const stayPos = stepMap.map(0, -1); // Returns 0 (position stays before insertion)
```

</td>
</tr>
</tbody>
</table>

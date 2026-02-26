[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/transform](../../README.md) / change-map/Mapping

# change-map/Mapping

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

[Mapping](classes/Mapping.md)

</td>
<td>

A mapping represents a pipeline of zero or more [step maps](#transform.StepMap).

Mappings are used to track how positions in a document change as transformations
are applied. They have special provisions for losslessly handling mapping positions
through a series of steps in which some steps are inverted versions of earlier steps.
This is essential for '[rebasing](/docs/guide/#transform.rebasing)' steps in
collaborative editing or history management scenarios.

**Example**

```typescript
// Create a mapping with step maps
const mapping = new Mapping();
mapping.appendMap(new StepMap([2, 0, 4])); // Insert 4 chars at position 2

// Map a position through the transformation
const newPos = mapping.map(5); // Returns 9 (5 + 4)

// Handle mirrored steps (undo/redo)
mapping.appendMap(deleteStep, 0); // Mirror with first step
```

</td>
</tr>
</tbody>
</table>

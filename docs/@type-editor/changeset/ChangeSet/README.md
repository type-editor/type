[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/changeset](../README.md) / ChangeSet

# ChangeSet

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

[ChangeSet](classes/ChangeSet.md)

</td>
<td>

A change set tracks the changes to a document from a given point in the past.

It condenses a number of step maps down to a flat sequence of replacements,
and simplifies replacements that partially undo themselves by comparing their content.

The ChangeSet maintains two coordinate systems:

- **A coordinates**: Positions in the original (starting) document
- **B coordinates**: Positions in the current (modified) document

**Example**

```typescript
// Create a changeset tracking from a document
const changeSet = ChangeSet.create(startDoc);

// Add steps as they occur
const updated = changeSet.addSteps(newDoc, stepMaps, metadata);

// Access the tracked changes
for (const change of updated.changes) {
  console.log(
    `Replaced ${change.fromA}-${change.toA} with content at ${change.fromB}-${change.toB}`,
  );
}
```

</td>
</tr>
</tbody>
</table>

[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / auto-join

# auto-join

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

[autoJoin](functions/autoJoin.md)

</td>
<td>

Wraps a command to automatically join adjacent nodes when they become joinable
after the command executes.

This higher-order function takes a command and a joinability criterion, and returns
a new command that will automatically join adjacent nodes that meet the criterion
after the original command's transformation is applied.

Nodes are considered joinable when they are of the same type and when the
`isJoinable` predicate returns true for them. If an array of strings is passed
instead, nodes are joinable if their type name is in the array.

**Example**

```typescript
// Join nodes of specific types
const wrappedCommand = autoJoin(myCommand, ["paragraph", "heading"]);

// Join nodes based on custom logic
const wrappedCommand = autoJoin(myCommand, (before, after) => {
  return before.attrs.level === after.attrs.level;
});
```

</td>
</tr>
</tbody>
</table>

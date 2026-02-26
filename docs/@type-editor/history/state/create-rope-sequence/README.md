[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/history](../../README.md) / state/create-rope-sequence

# state/create-rope-sequence

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

[Append](classes/Append.md)

</td>
<td>

Internal node in the rope sequence tree structure.
Combines two child rope sequences (left and right) without copying their elements.

</td>
</tr>
<tr>
<td>

[Leaf](classes/Leaf.md)

</td>
<td>

Leaf node in the rope sequence tree structure.
Contains an array of actual elements with no child nodes.

</td>
</tr>
</tbody>
</table>

## Variables

<table>
<thead>
<tr>
<th>Variable</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[EMPTY_ROPESEQUENCE](variables/EMPTY_ROPESEQUENCE.md)

</td>
<td>

A shared empty rope sequence instance for optimization purposes.
Use this instead of creating new empty rope sequences.

</td>
</tr>
</tbody>
</table>

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

[createRopeSequence](functions/createRopeSequence.md)

</td>
<td>

Create a rope sequence from an array or return the rope if already a rope sequence.

This is a factory function that efficiently handles both array and rope sequence inputs.
If the input is already a rope sequence, it returns it unchanged. If it's an array,
it creates a new Leaf node, or returns an empty rope if the array is empty.

**Example**

```typescript
const rope1 = createRopeSequence([1, 2, 3]);
const rope2 = createRopeSequence(rope1); // Returns rope1
const empty = createRopeSequence([]); // Returns Leaf.EMPTY
```

</td>
</tr>
</tbody>
</table>

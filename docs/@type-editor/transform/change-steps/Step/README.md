[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/transform](../../README.md) / change-steps/Step

# change-steps/Step

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

[Step](classes/Step.md)

</td>
<td>

A step object represents an atomic change. It generally applies
only to the document it was created for, since the positions
stored in it will only make sense for that document.

New steps are defined by creating classes that extend `Step`,
overriding the `apply`, `invert`, `map`, `getMap` and `fromJSON`
methods, and registering your class with a unique
JSON-serialization identifier using
[`Step.jsonID`](#transform.Step^jsonID).

</td>
</tr>
</tbody>
</table>

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

[StepImplementation](interfaces/StepImplementation.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>

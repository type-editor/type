[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/inputrules](../../README.md) / builder/wrapping-input-rule

# builder/wrapping-input-rule

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

[wrappingInputRule](functions/wrappingInputRule.md)

</td>
<td>

Build an input rule for automatically wrapping a textblock when a
given string is typed. The `regexp` argument is
directly passed through to the `InputRule` constructor. You'll
probably want the regexp to start with `^`, so that the pattern can
only occur at the start of a textblock.

`nodeType` is the type of node to wrap in. If it needs attributes,
you can either pass them directly, or pass a function that will
compute them from the regular expression match.

By default, if there's a node with the same type above the newly
wrapped node, the rule will try to [join](#transform.Transform.join) those
two nodes. You can pass a join predicate, which takes a regular
expression match and the node before the wrapped node, and can
return a boolean to indicate whether a join should happen.

</td>
</tr>
</tbody>
</table>

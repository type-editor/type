[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/model](../../README.md) / content-parser/ContentMatcher

# content-parser/ContentMatcher

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

[ContentMatcher](classes/ContentMatcher.md)

</td>
<td>

Compiles content expressions into a deterministic finite automaton (DFA).

The compilation process follows these steps:

1. Build a Non-deterministic Finite Automaton (NFA) from the expression AST
2. Convert the NFA to a DFA using subset construction
3. Validate the DFA for dead-end states (non-generatable required content)

For background on NFA/DFA construction, see:
https://swtch.com/~rsc/regexp/regexp1.html

</td>
</tr>
</tbody>
</table>

[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/model](../../README.md) / content-parser/ContentParser

# content-parser/ContentParser

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

[ContentParser](classes/ContentParser.md)

</td>
<td>

Parser for ProseMirror content expressions.

Content expressions use a regular-expression-like syntax to describe
what content is allowed in a node. For example:

- "paragraph+" means one or more paragraphs
- "heading | paragraph" means a heading or paragraph
- "block\{2,4\}" means 2 to 4 block elements

The parser converts these expressions into a ContentMatch automaton
that can efficiently validate and match node sequences.

</td>
</tr>
</tbody>
</table>

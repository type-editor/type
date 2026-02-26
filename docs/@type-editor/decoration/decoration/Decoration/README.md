[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/decoration](../../README.md) / decoration/Decoration

# decoration/Decoration

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

[Decoration](classes/Decoration.md)

</td>
<td>

Decoration objects can be provided to the view through the
[`decorations` prop](#view.EditorProps.decorations). They come in
several variants—see the static members of this class for details.

Decorations allow you to add styling, attributes, or widgets to the
editor view without modifying the underlying document. They are used
for features like syntax highlighting, collaborative cursors, search
results, and inline UI elements.

Provides static methods to create different types of decorations:

- Widget decorations: Insert DOM nodes at specific positions
- Inline decorations: Apply styling to ranges of inline content
- Node decorations: Apply styling to entire block nodes

**Example**

```typescript
// Create an inline decoration to highlight text
Decoration.inline(from, to, { class: "highlight" });

// Create a widget decoration to insert a DOM element
Decoration.widget(pos, () => document.createElement("button"));

// Create a node decoration to style a block
Decoration.node(from, to, { class: "selected-paragraph" });
```

</td>
</tr>
</tbody>
</table>

[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/editor-types](../../../../README.md) / types/view/decoration/InlineDecorationOptions

# types/view/decoration/InlineDecorationOptions

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

[InlineDecorationOptions](interfaces/InlineDecorationOptions.md)

</td>
<td>

Options for inline decorations that control how the decoration behaves
when the document is edited at its boundaries.

**Example**

```typescript
// Non-inclusive decoration (default)
// Typing at boundaries won't include new text
const decoration1 = Decoration.inline(0, 5, { class: "highlight" });

// Fully inclusive decoration
// Typing at either boundary will include new text
const decoration2 = Decoration.inline(
  0,
  5,
  { class: "highlight" },
  { inclusiveStart: true, inclusiveEnd: true },
);

// Start-inclusive only
// Typing at the start includes new text, at the end does not
const decoration3 = Decoration.inline(
  0,
  5,
  { class: "highlight" },
  { inclusiveStart: true },
);
```

</td>
</tr>
</tbody>
</table>

[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/menu](../README.md) / MenuBarBuilder

# MenuBarBuilder

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

[MenuBarBuilder](classes/MenuBarBuilder.md)

</td>
<td>

Builder for constructing a ProseMirror menu bar plugin.

Use `addMenuGroup` to add flat groups of items to the toolbar, and
`addDropDown` to add dropdown menus. Finish with `build()` to
produce the configured `Plugin` instance.

**Example**

```ts
const plugin = new MenuBarBuilder()
  .addMenuGroup(boldItem, italicItem)
  .addDropDown({ label: "Insert" }, tableItem, imageItem)
  .build();
```

</td>
</tr>
</tbody>
</table>

## Type Aliases

<table>
<thead>
<tr>
<th>Type Alias</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[MenuElementInput](type-aliases/MenuElementInput.md)

</td>
<td>

Accepted input types for a single menu element entry in a group or dropdown.
Arrays of `MenuElement` are flattened, while falsy values (`null`, `undefined`) are ignored.

</td>
</tr>
</tbody>
</table>

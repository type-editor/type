[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/menu](../../README.md) / menu-items/link-item

# menu-items/link-item

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

[linkItem](functions/linkItem.md)

</td>
<td>

Creates a menu item for adding, editing, or removing links in the editor.

This function returns a MenuItem that opens a dialog allowing users to:

- Add a new link to selected text
- Edit an existing link's URL or target
- Remove an existing link
- Open an existing link in a new window

**Example**

```typescript
const linkMenuItem = linkItem("Insert Link", schema.marks.link);
```

</td>
</tr>
</tbody>
</table>

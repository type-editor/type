[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / [menu-items/link-item](../README.md) / linkItem

# Function: linkItem()

```ts
function linkItem(title?, linkMarkType?, codeBlockNodeType?): MenuItem;
```

Defined in: [packages/menu/src/menu-items/link-item.ts:64](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/menu/src/menu-items/link-item.ts#L64)

Creates a menu item for adding, editing, or removing links in the editor.

This function returns a MenuItem that opens a dialog allowing users to:

- Add a new link to selected text
- Edit an existing link's URL or target
- Remove an existing link
- Open an existing link in a new window

## Parameters

| Parameter           | Type       | Default value             | Description                                                                                    |
| ------------------- | ---------- | ------------------------- | ---------------------------------------------------------------------------------------------- |
| `title`             | `string`   | `'Link'`                  | The display title for the menu item (default: 'Link')                                          |
| `linkMarkType`      | `MarkType` | `schema.marks.link`       | The mark type used for links (default: schema.marks.link)                                      |
| `codeBlockNodeType` | `NodeType` | `schema.nodes.code_block` | used to identify code blocks where link editing is disabled (default: schema.nodes.code_block) |

## Returns

[`MenuItem`](../../../menubar/MenuItem/classes/MenuItem.md)

A configured MenuItem for link operations

## Example

```typescript
const linkMenuItem = linkItem("Insert Link", schema.marks.link);
```

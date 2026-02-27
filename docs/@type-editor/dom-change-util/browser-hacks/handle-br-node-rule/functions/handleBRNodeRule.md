[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [browser-hacks/handle-br-node-rule](../README.md) / handleBRNodeRule

# Function: handleBRNodeRule()

```ts
function handleBRNodeRule(dom): Omit<TagParseRule, "tag">;
```

Defined in: [browser-hacks/handle-br-node-rule.ts:33](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/dom-change-util/src/dom-change/browser-hacks/handle-br-node-rule.ts#L33)

Handles parsing rules for BR nodes, working around Safari quirks.

Safari has several quirks related to BR elements that require special handling:

1. **List/Table Cell Deletion (issues #708, #862):**
   When deleting the last character in a list item or table cell, Safari
   replaces the list item/cell with a BR directly in the parent list/table node.
   This creates invalid HTML structure (BR as direct child of UL/OL) that needs
   to be corrected during parsing by wrapping it in a proper list item.

2. **Trailing BR in Tables:**
   Safari sometimes adds trailing BR elements in table rows/cells that should
   be ignored during parsing as they're artifacts of the contentEditable behavior.

The function examines the parent node to determine which quirk is occurring
and returns the appropriate parse rule to handle it correctly.

## Parameters

| Parameter | Type   | Description                                                                                                |
| --------- | ------ | ---------------------------------------------------------------------------------------------------------- |
| `dom`     | `Node` | The BR DOM node that needs special handling. Must have a parentNode for any of the special cases to apply. |

## Returns

`Omit`&lt;`TagParseRule`, `"tag"`&gt;

A parse rule for the BR node: - For Safari list quirk: Returns a skipDiv rule that wraps the BR in a list item structure - For trailing BRs or Safari table quirk: Returns an ignore rule to skip the BR - Otherwise: Returns null for default BR handling

## See

- https://github.com/ProseMirror/prosemirror/issues/708
- https://github.com/ProseMirror/prosemirror/issues/862

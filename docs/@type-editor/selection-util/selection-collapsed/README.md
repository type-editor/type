[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/selection-util](../README.md) / selection-collapsed

# selection-collapsed

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

[selectionCollapsed](functions/selectionCollapsed.md)

</td>
<td>

Checks if a DOM selection is collapsed (has no range).

Work around Chrome issue https://bugs.chromium.org/p/chromium/issues/detail?id=447523
(isCollapsed inappropriately returns true in shadow DOM)

This function uses `isEquivalentPosition` to properly detect collapsed selections
by comparing the focus and anchor positions, which works correctly in Shadow DOM.

**Example**

```typescript
const selection = window.getSelection();
const isCollapsed = selectionCollapsed(selection);
```

</td>
</tr>
</tbody>
</table>

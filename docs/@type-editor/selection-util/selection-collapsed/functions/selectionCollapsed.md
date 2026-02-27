[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/selection-util](../../README.md) / [selection-collapsed](../README.md) / selectionCollapsed

# Function: selectionCollapsed()

```ts
function selectionCollapsed(domSel): boolean;
```

Defined in: [selection-collapsed.ts:22](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/selection-util/src/selection/selection-collapsed.ts#L22)

Checks if a DOM selection is collapsed (has no range).

Work around Chrome issue https://bugs.chromium.org/p/chromium/issues/detail?id=447523
(isCollapsed inappropriately returns true in shadow DOM)

This function uses `isEquivalentPosition` to properly detect collapsed selections
by comparing the focus and anchor positions, which works correctly in Shadow DOM.

## Parameters

| Parameter | Type                | Description                      |
| --------- | ------------------- | -------------------------------- |
| `domSel`  | `DOMSelectionRange` | The DOM selection range to check |

## Returns

`boolean`

True if the selection is collapsed, false otherwise

## Example

```typescript
const selection = window.getSelection();
const isCollapsed = selectionCollapsed(selection);
```

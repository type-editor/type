[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [input/handle-mouse-down](../README.md) / handleMouseDown

# Function: handleMouseDown()

```ts
function handleMouseDown(view, startEvent): void;
```

Defined in: [tables/src/input/handle-mouse-down.ts:40](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/input/handle-mouse-down.ts#L40)

Handles mouse down events for table cell selection.

This handler enables cell selection by dragging across table cells.
It supports:

- Shift+click to extend an existing cell selection
- Click and drag to create a new cell selection
- Ignores right-click and Ctrl/Cmd+click

## Parameters

| Parameter    | Type           | Description                                          |
| ------------ | -------------- | ---------------------------------------------------- |
| `view`       | `PmEditorView` | The editor view.                                     |
| `startEvent` | `MouseEvent`   | The mouse down event that initiated the interaction. |

## Returns

`void`

## Example

```typescript
// Use in a ProseMirror plugin
new Plugin({
  props: {
    handleDOMEvents: {
      mousedown: handleMouseDown,
    },
  },
});
```

# @type-editor/dropcursor

This is a refactored version of the [prosemirror-dropcursor](https://github.com/ProseMirror/prosemirror-dropcursor) module.

This module implements a plugin that displays a visual drop cursor indicator when content
is dragged over the editor. The drop cursor helps users see where dragged content will be 
inserted, appearing as a colored line or block at the potential drop position during 
drag-and-drop operations.

## Installation

```bash
npm install @type-editor/dropcursor
```

## Usage

```typescript
import { EditorState } from '@type-editor/state';
import { EditorView } from '@type-editor/view';
import { dropCursor } from '@type-editor/dropcursor';

const state = EditorState.create({
  schema: mySchema,
  plugins: [
    dropCursor({ color: 'blue', width: 2 })
  ]
});

const view = new EditorView(document.querySelector('#editor'), { state });
```

## API

### dropCursor

Creates a plugin that displays a visual drop cursor indicator when content is dragged over the editor.

```typescript
function dropCursor(options?: DropCursorOptions): Plugin
```

**Parameters:**

- `options` - Optional configuration for the drop cursor appearance

**Returns:** A ProseMirror plugin instance

### DropCursorOptions

Configuration options for the drop cursor plugin.

```typescript
interface DropCursorOptions {
  color?: string | false;
  width?: number;
  class?: string;
}
```

| Option  | Type              | Default   | Description                                                                               |
|---------|-------------------|-----------|-------------------------------------------------------------------------------------------|
| `color` | `string \| false` | `"black"` | The color of the cursor. Set to `false` to apply no color and rely only on the CSS class. |
| `width` | `number`          | `1`       | The precise width of the cursor in pixels.                                                |
| `class` | `string`          | —         | A CSS class name to add to the cursor element for custom styling.                         |

## Node Spec Integration

Nodes may add a `disableDropCursor` property to their spec to control whether the drop cursor
can appear inside them. This can be:

- **Boolean**: `true` to disable the drop cursor, `false` to enable it
- **Function**: `(view: EditorView, pos: number, event: DragEvent) => boolean` for dynamic control

### Example

```typescript
const imageNode = {
  // ...other spec properties...
  disableDropCursor: true  // Never show drop cursor inside this node
};

const customNode = {
  // ...other spec properties...
  disableDropCursor: (view, pos, event) => {
    // Dynamically decide based on context
    return event.dataTransfer?.types.includes('text/plain') ?? false;
  }
};
```

## Styling

The drop cursor element can be styled via CSS using the `class` option:

```typescript
dropCursor({ class: 'my-drop-cursor', color: false })
```

```css
.my-drop-cursor {
  background-color: #3b82f6;
  box-shadow: 0 0 4px rgba(59, 130, 246, 0.5);
}
```

## License

MIT

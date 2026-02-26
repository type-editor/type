# @type-editor/gapcursor

This is a refactored version of the [prosemirror-gapcursor](https://github.com/ProseMirror/prosemirror-gapcursor) module.

This module implements a gap cursor plugin for Type Editor. A gap cursor is a
block-level cursor that can be used to focus positions that don't allow
regular selection (such as positions that have a leaf block node, table, or
the end of the document both before and after them).

## Installation

```bash
npm install @type-editor/gapcursor
```

## Usage

### Basic Setup

```typescript
import { gapCursor } from '@type-editor/gapcursor';
import { EditorState } from '@type-editor/state';

const state = EditorState.create({
  // ... your schema and doc
  plugins: [
    gapCursor(),
    // ... other plugins
  ]
});
```

### Styling

You'll need to include the gap cursor styles for the cursor to be visible.
Import the CSS file from the package:

```css
@import '@type-editor/gapcursor/style/gapcursor.css';
```

Or include it in your bundler configuration. The gap cursor is rendered as a
short, blinking horizontal stripe with the class `ProseMirror-gapcursor`.

You can also define your own styles for the `.ProseMirror-gapcursor` class.

## Documentation

### gapCursor

```typescript
function gapCursor(): Plugin
```

Creates a gap cursor plugin for the editor.

When enabled, this plugin will:
- Capture clicks near positions that don't have a normally selectable position
- Handle arrow key navigation to move into/out of gap cursor positions
- Create gap cursor selections for valid positions
- Handle composition input to avoid IME conflicts
- Render the gap cursor with the `ProseMirror-gapcursor` CSS class

**Returns:** A configured `Plugin` instance.

---

### GapCursor

```typescript
class GapCursor extends Selection
```

Represents a gap cursor selection - a cursor positioned between block nodes
where regular text selection is not possible.

Gap cursors are used in positions where the document structure doesn't allow
normal text cursors, such as between two adjacent block nodes (e.g., between
two code blocks or between a heading and an image).

Both `$anchor` and `$head` properties point at the same cursor position since
gap cursors don't represent a range but a single point between nodes.

#### Constructor

```typescript
constructor($pos: ResolvedPos)
```

Creates a new gap cursor at the given position.

- **`$pos`**: The resolved position where the gap cursor should be placed.
  Both anchor and head will be set to this position.

#### Static Methods

##### `GapCursor.valid`

```typescript
static valid($pos: ResolvedPos): boolean
```

Checks whether a gap cursor is valid at the given position.

A gap cursor is valid when:
1. The parent is not a text block (gap cursors can't exist within text)
2. There's a "closed" node before the position (block or atom node)
3. There's a "closed" node after the position (block or atom node)
4. The parent allows gap cursors (via `allowGapCursor` spec or default content type)

- **`$pos`**: The resolved position to check.
- **Returns:** `true` if a gap cursor can be placed at this position, `false` otherwise.

##### `GapCursor.findGapCursorFrom`

```typescript
static findGapCursorFrom($pos: ResolvedPos, dir: number, mustMove?: boolean): ResolvedPos | null
```

Searches for a valid gap cursor position starting from the given position.

This method performs a depth-first search through the document tree to find
the nearest valid gap cursor position in the specified direction.

- **`$pos`**: The starting resolved position for the search.
- **`dir`**: The search direction: positive values move forward, negative values move backward.
- **`mustMove`**: If `true`, the search will not return the starting position even if valid. Defaults to `false`.
- **Returns:** The resolved position of a valid gap cursor, or `null` if none is found.

**Example:**

```typescript
// Find the next gap cursor position moving forward
const nextGap = GapCursor.findGapCursorFrom($currentPos, 1, true);
```

##### `GapCursor.fromJSON`

```typescript
static fromJSON(doc: Node, json: SelectionJSON): GapCursor
```

Deserializes a gap cursor from its JSON representation.

- **`doc`**: The document to resolve the position in.
- **`json`**: The serialized gap cursor data containing the position.
- **Returns:** A new `GapCursor` instance at the deserialized position.
- **Throws:** `RangeError` if the JSON doesn't contain a valid numeric position.

## Customizing Gap Cursor Behavior

### `allowGapCursor` Node Spec Property

By default, gap cursors are only allowed in places where the default content
node (in the schema content constraints) is a textblock node. You can customize
this by adding an `allowGapCursor` property to your node specs:

- If set to `true`, gap cursors are allowed everywhere in that node.
- If set to `false`, gap cursors are never allowed in that node.

**Example:**

```typescript
const schema = new Schema({
  nodes: {
    // ... other nodes
    code_block: {
      content: 'text*',
      marks: '',
      group: 'block',
      code: true,
      defining: true,
      allowGapCursor: true, // Allow gap cursors around code blocks
      // ... other specs
    },
    image: {
      inline: true,
      attrs: { src: {} },
      group: 'inline',
      draggable: true,
      allowGapCursor: false, // Never allow gap cursors around images
      // ... other specs
    }
  }
});
```

### `createGapCursor` Node Spec Property

By default, leaf blocks and isolating nodes will allow gap cursors to appear
next to them. You can add a `createGapCursor: true` property to a block node's
spec to make gap cursors appear next to other nodes as well.

## License

MIT

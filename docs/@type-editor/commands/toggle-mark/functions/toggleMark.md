[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [toggle-mark](../README.md) / toggleMark

# Function: toggleMark()

```ts
function toggleMark(markType, attrs?, options?): Command;
```

Defined in: [toggle-mark.ts:77](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/commands/src/toggle-mark.ts#L77)

Creates a command that toggles a mark on the current selection.

This command factory creates commands that add or remove marks (like bold, italic,
links, etc.) from the selected content. The behavior is context-aware:

**Empty Selection (Cursor)**: Toggles the mark in stored marks, affecting subsequent
typed text.

**Range Selection**: Adds or removes the mark from the selected content based on the
current state and configured options.

**Toggle Logic**:

- If `removeWhenPresent` is `true` (default): Removes the mark if any selected content
  has it, otherwise adds it
- If `removeWhenPresent` is `false`: Adds the mark if any selected content lacks it,
  otherwise removes it

The command automatically handles:

- Schema validation (only applies where the mark is allowed)
- Whitespace exclusion (configurable)
- Atomic inline nodes (configurable)
- Complex selection ranges

## Parameters

| Parameter  | Type                                                                                 | Default value                 | Description                                                          |
| ---------- | ------------------------------------------------------------------------------------ | ----------------------------- | -------------------------------------------------------------------- |
| `markType` | `MarkType`                                                                           | `undefined`                   | The type of mark to toggle                                           |
| `attrs`    | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;                                    | `null`                        | Optional attributes for the mark (e.g., `{ href: "..." }` for links) |
| `options`  | [`ToggleMarkOptions`](../../types/ToggleMarkOptions/interfaces/ToggleMarkOptions.md) | `DEFAULT_TOGGLE_MARK_OPTIONS` | Configuration options for toggle behavior                            |

## Returns

`Command`

A command that toggles the mark

## Example

```typescript
// Create basic formatting commands
const toggleBold = toggleMark(schema.marks.strong);
const toggleItalic = toggleMark(schema.marks.em);
const toggleCode = toggleMark(schema.marks.code);

// Create a link toggle with attributes
const toggleLink = (href: string) => toggleMark(schema.marks.link, { href });

// Use in a keymap
const keymap = {
  "Mod-b": toggleBold,
  "Mod-i": toggleItalic,
  "Mod-`": toggleCode,
};

// Custom toggle behavior
const toggleStrikethrough = toggleMark(schema.marks.strikethrough, null, {
  removeWhenPresent: false, // Additive behavior
  includeWhitespace: true, // Include whitespace
});

// Toggle with attribute-based differentiation
const setFontSize = (size: number) =>
  toggleMark(schema.marks.fontSize, { size });
```

[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/keymap](../README.md) / keymap

# keymap

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

[keydownHandler](functions/keydownHandler.md)

</td>
<td>

Creates a keydown handler function from a set of key bindings.

Given a set of bindings (using the same format as [keymap](functions/keymap.md)), this function returns
a [keydown handler](#view.EditorProps.handleKeyDown) that handles them. The handler will
attempt to match the keydown event against the bindings, trying multiple strategies:

1. Direct match with modifiers
2. For single-character keys with Shift, try without Shift modifier
3. For keys with modifiers, fall back to keyCode-based matching (handles keyboard layout differences)

The function handles platform-specific edge cases, such as Ctrl-Alt on Windows (used for AltGr).

**Example**

```typescript
const handler = keydownHandler({
  Enter: insertParagraph,
  "Mod-b": toggleBold,
});
// Use in EditorProps: { handleKeyDown: handler }
```

</td>
</tr>
<tr>
<td>

[keymap](functions/keymap.md)

</td>
<td>

Creates a keymap plugin for the given set of key bindings.

Bindings should map key names to [command](#commands)-style functions, which will be called
with `(EditorState, dispatch, EditorView)` arguments, and should return `true` when they've
handled the key. Note that the view argument isn't part of the command protocol, but can be
used as an escape hatch if a binding needs to directly interact with the UI.

Key names may be strings like `"Shift-Ctrl-Enter"`—a key identifier prefixed with zero or
more modifiers. Key identifiers are based on the strings that can appear in
[`KeyEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key).
Use lowercase letters to refer to letter keys (or uppercase letters if you want shift to
be held). You may use `"Space"` as an alias for the `" "` name.

Modifiers can be given in any order. `Shift-` (or `s-`), `Alt-` (or `a-`), `Ctrl-` (or
`c-` or `Control-`) and `Cmd-` (or `m-` or `Meta-`) are recognized. For characters that
are created by holding shift, the `Shift-` prefix is implied, and should not be added
explicitly.

You can use `Mod-` as a shorthand for `Cmd-` on Mac and `Ctrl-` on other platforms.

You can add multiple keymap plugins to an editor. The order in which they appear determines
their precedence (the ones early in the array get to dispatch first).

**Example**

```typescript
const myKeymap = keymap({
  "Mod-Enter": insertHardBreak,
  "Ctrl-b": toggleBold,
  "Alt-ArrowUp": joinUp,
});
```

</td>
</tr>
</tbody>
</table>

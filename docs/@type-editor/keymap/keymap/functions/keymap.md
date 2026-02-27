[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/keymap](../../README.md) / [keymap](../README.md) / keymap

# Function: keymap()

```ts
function keymap(bindings): Plugin_2;
```

Defined in: [keymap.ts:43](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/keymap/src/keymap.ts#L43)

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

## Parameters

| Parameter  | Type                                | Description                                                                   |
| ---------- | ----------------------------------- | ----------------------------------------------------------------------------- |
| `bindings` | `Record`&lt;`string`, `Command`&gt; | A record mapping key name strings to command functions that handle those keys |

## Returns

`Plugin_2`

A plugin instance that handles keydown events according to the provided bindings

## Example

```typescript
const myKeymap = keymap({
  "Mod-Enter": insertHardBreak,
  "Ctrl-b": toggleBold,
  "Alt-ArrowUp": joinUp,
});
```

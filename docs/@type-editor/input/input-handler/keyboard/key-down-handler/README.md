[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/input](../../../README.md) / input-handler/keyboard/key-down-handler

# input-handler/keyboard/key-down-handler

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

[captureKeyDown](functions/captureKeyDown.md)

</td>
<td>

Captures and handles key down events in the editor, intercepting certain key combinations
to provide custom behavior for navigation, deletion, and selection operations.

This function acts as the main entry point for keyboard event handling, delegating to
specialized functions based on the key pressed and active modifiers.

</td>
</tr>
<tr>
<td>

[keyDownHandler](functions/keyDownHandler.md)

</td>
<td>

Handles keydown events in the editor. Manages composition state, platform-specific
quirks (iOS Enter handling, Chrome Android composition), and delegates to custom
handlers or built-in command handlers.

</td>
</tr>
</tbody>
</table>

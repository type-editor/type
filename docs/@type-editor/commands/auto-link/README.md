[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/commands](../README.md) / auto-link

# auto-link

## Type Aliases

<table>
<thead>
<tr>
<th>Type Alias</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[AutoLinkTriggerKey](type-aliases/AutoLinkTriggerKey.md)

</td>
<td>

Type definition for the trigger key that activates auto-linking.

</td>
</tr>
</tbody>
</table>

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

[autoLink](functions/autoLink.md)

</td>
<td>

Automatically converts URLs to clickable links when Enter or Space is pressed.

This command detects URLs in the editor and automatically wraps them with a link mark
when the user presses Enter or Space. It supports both explicit protocols (http://, https://)
and implicit URLs (example.com).

**Example**

```typescript
// Create an auto-link command for the Enter key
const autoLinkOnEnter = autoLink("Enter");

// Create an auto-link command for the Space key with a custom mark type
const autoLinkOnSpace = autoLink("Space", customLinkMarkType);
```

**Remarks**

- The command will not create a link if one already exists at the cursor position
- For Enter key: matches URLs that span the entire line from the start
- for Space key: matches URLs that appear after whitespace or at the start
- URLs are automatically normalized to include the https:// protocol if missing
- Returns `true` for Enter key (to indicate the command handled the event)
- Returns `false` for Space key (to allow default behavior)

</td>
</tr>
</tbody>
</table>

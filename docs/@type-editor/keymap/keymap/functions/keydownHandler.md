[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/keymap](../../README.md) / [keymap](../README.md) / keydownHandler

# Function: keydownHandler()

```ts
function keydownHandler(bindings): (view, event) => boolean;
```

Defined in: [keymap.ts:72](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/keymap/src/keymap.ts#L72)

Creates a keydown handler function from a set of key bindings.

Given a set of bindings (using the same format as [keymap](keymap.md)), this function returns
a [keydown handler](#view.EditorProps.handleKeyDown) that handles them. The handler will
attempt to match the keydown event against the bindings, trying multiple strategies:

1. Direct match with modifiers
2. For single-character keys with Shift, try without Shift modifier
3. For keys with modifiers, fall back to keyCode-based matching (handles keyboard layout differences)

The function handles platform-specific edge cases, such as Ctrl-Alt on Windows (used for AltGr).

## Parameters

| Parameter  | Type                                | Description                                            |
| ---------- | ----------------------------------- | ------------------------------------------------------ |
| `bindings` | `Record`&lt;`string`, `Command`&gt; | A record mapping key name strings to command functions |

## Returns

A keydown event handler function that can be used in EditorProps

```ts
(view, event): boolean;
```

### Parameters

| Parameter | Type            |
| --------- | --------------- |
| `view`    | `PmEditorView`  |
| `event`   | `KeyboardEvent` |

### Returns

`boolean`

## Example

```typescript
const handler = keydownHandler({
  Enter: insertParagraph,
  "Mod-b": toggleBold,
});
// Use in EditorProps: { handleKeyDown: handler }
```

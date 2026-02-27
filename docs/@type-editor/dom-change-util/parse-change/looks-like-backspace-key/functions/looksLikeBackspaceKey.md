[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [parse-change/looks-like-backspace-key](../README.md) / looksLikeBackspaceKey

# Function: looksLikeBackspaceKey()

```ts
function looksLikeBackspaceKey(view, doc, change, $from, $to): boolean;
```

Defined in: [parse-change/looks-like-backspace-key.ts:33](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/dom-change-util/src/dom-change/parse-change/looks-like-backspace-key.ts#L33)

Checks if the change looks like the effect of pressing the Backspace key.

Similar to Enter detection, some backspace operations (especially block joins)
are better handled through the Backspace key handler. This function detects
if a change looks like a backspace operation by checking:

- The selection anchor is after the change start (backspacing backwards)
- The change matches the backspace pattern (see looksLikeBackspace)
- A handleKeyDown plugin accepts the Backspace key event

The detailed backspace detection logic is in the looksLikeBackspace function.

## Parameters

| Parameter | Type                                                                                      | Description                                                    |
| --------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `view`    | `PmEditorView`                                                                            | The editor view containing selection state and plugin handlers |
| `doc`     | `Node_2`                                                                                  | The current document (before the change)                       |
| `change`  | [`DocumentChange`](../../../types/dom-change/DocumentChange/interfaces/DocumentChange.md) | The detected document change                                   |
| `$from`   | `ResolvedPos`                                                                             | Start position in the parsed (new) document (resolved)         |
| `$to`     | `ResolvedPos`                                                                             | End position in the parsed (new) document (resolved)           |

## Returns

`boolean`

True if the change looks like Backspace and a key handler accepted it,
false if the change should be processed as a normal DOM change

## See

[looksLikeBackspace](../../looks-like-backspace/functions/looksLikeBackspace.md) for detailed backspace detection logic

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [parse-change/looks-like-enter-key](../README.md) / looksLikeEnterKey

# Function: looksLikeEnterKey()

```ts
function looksLikeEnterKey(
  view,
  parse,
  $from,
  $to,
  inlineChange,
  addedNodes,
): boolean;
```

Defined in: [parse-change/looks-like-enter-key.ts:41](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/dom-change-util/src/dom-change/parse-change/looks-like-enter-key.ts#L41)

Checks if the change looks like the effect of pressing the Enter key.

Sometimes it's better to handle block creation through the Enter key handler
rather than as a DOM change. This function detects those cases using two
different strategies:

**iOS Enter Detection:**
iOS specifically tracks Enter key presses. If a recent Enter was detected
and either the change is not inline or block elements (DIV/P) were added,
treat it as an Enter key press.

**Generic Block Enter Detection:**
For other platforms, detect Enter by checking if:

- Change is not inline (block-level)
- Positions are within document bounds
- Positions are in different parents or not in inline content
- Content between positions is whitespace-only (empty paragraph)

If detected, the change is delegated to the handleKeyDown plugin system
with an Enter key event.

## Parameters

| Parameter      | Type                                                                                                  | Description                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `view`         | `PmEditorView`                                                                                        | The editor view containing input state and plugin handlers   |
| `parse`        | [`ParseBetweenResult`](../../../types/dom-change/ParseBetweenResult/interfaces/ParseBetweenResult.md) | Parsed document information from the DOM                     |
| `$from`        | `ResolvedPos`                                                                                         | Start position in the parsed document (resolved)             |
| `$to`          | `ResolvedPos`                                                                                         | End position in the parsed document (resolved)               |
| `inlineChange` | `boolean`                                                                                             | Whether the change is within inline content (vs block-level) |
| `addedNodes`   | readonly `Node`[]                                                                                     | Array of DOM nodes that were added during the mutation       |

## Returns

`boolean`

True if the change looks like Enter and a key handler accepted it,
false if the change should be processed as a normal DOM change

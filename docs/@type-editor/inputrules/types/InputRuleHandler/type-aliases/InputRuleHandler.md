[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/inputrules](../../../README.md) / [types/InputRuleHandler](../README.md) / InputRuleHandler

# Type Alias: InputRuleHandler()

```ts
type InputRuleHandler = (state, match, start, end) => Transaction | null;
```

Defined in: [types/InputRuleHandler.ts:13](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/inputrules/src/types/InputRuleHandler.ts#L13)

A function that handles the application of an input rule.

## Parameters

| Parameter | Type               | Description                                                           |
| --------- | ------------------ | --------------------------------------------------------------------- |
| `state`   | `PmEditorState`    | The current editor state                                              |
| `match`   | `RegExpMatchArray` | The RegExp match array containing the matched text and capture groups |
| `start`   | `number`           | The starting position of the matched text in the document             |
| `end`     | `number`           | The ending position of the matched text in the document               |

## Returns

`Transaction` \| `null`

A transaction describing the rule's effect, or null if the input was not handled

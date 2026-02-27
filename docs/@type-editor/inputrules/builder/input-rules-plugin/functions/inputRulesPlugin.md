[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/inputrules](../../../README.md) / [builder/input-rules-plugin](../README.md) / inputRulesPlugin

# Function: inputRulesPlugin()

```ts
function inputRulesPlugin(config): PmPlugin<{
  from: number;
  text: string;
  to: number;
  transform: Transaction;
}>;
```

Defined in: [builder/input-rules-plugin.ts:17](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/inputrules/src/builder/input-rules-plugin.ts#L17)

Create an input rules plugin. When enabled, it will cause text
input that matches any of the given rules to trigger the rule's
action.

## Parameters

| Parameter      | Type                                                                              | Description                                     |
| -------------- | --------------------------------------------------------------------------------- | ----------------------------------------------- |
| `config`       | \{ `rules`: readonly [`InputRule`](../../../InputRule/classes/InputRule.md)[]; \} | Configuration object containing the rules array |
| `config.rules` | readonly [`InputRule`](../../../InputRule/classes/InputRule.md)[]                 | Array of input rules to apply                   |

## Returns

`PmPlugin`&lt;\{
`from`: `number`;
`text`: `string`;
`to`: `number`;
`transform`: `Transaction`;
\}&gt;

A ProseMirror plugin that handles input rule matching and application

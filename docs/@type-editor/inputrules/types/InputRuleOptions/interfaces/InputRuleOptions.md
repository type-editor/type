[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/inputrules](../../../README.md) / [types/InputRuleOptions](../README.md) / InputRuleOptions

# Interface: InputRuleOptions

Defined in: [types/InputRuleOptions.ts:6](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/inputrules/src/types/InputRuleOptions.ts#L6)

Configuration options for input rules.

## Properties

| Property                                       | Type                  | Default value | Description                                                                                                                                                                                                           | Defined in                                                                                                                                                              |
| ---------------------------------------------- | --------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-incode"></a> `inCode?`         | `boolean` \| `"only"` | `false`       | Controls whether the rule applies inside code nodes. - `false` (default): Rule will not apply in code nodes - `true`: Rule will apply everywhere, including code nodes - `'only'`: Rule will only apply in code nodes | [types/InputRuleOptions.ts:23](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/inputrules/src/types/InputRuleOptions.ts#L23) |
| <a id="property-incodemark"></a> `inCodeMark?` | `boolean`             | `true`        | Controls whether the rule applies inside code marks. - `false`: Rule will not fire inside marks marked as code - `true` (default): Rule will fire inside code marks                                                   | [types/InputRuleOptions.ts:32](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/inputrules/src/types/InputRuleOptions.ts#L32) |
| <a id="property-undoable"></a> `undoable?`     | `boolean`             | `true`        | When set to false, the undoInputRule command will not work on this rule. Defaults to `true`.                                                                                                                          | [types/InputRuleOptions.ts:13](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/inputrules/src/types/InputRuleOptions.ts#L13) |

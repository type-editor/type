[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/inputrules](../../../README.md) / [builder/textblock-type-input-rule](../README.md) / textblockTypeInputRule

# Function: textblockTypeInputRule()

```ts
function textblockTypeInputRule(regexp, nodeType, getAttrs?): InputRule;
```

Defined in: [builder/textblock-type-input-rule.ts:18](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/inputrules/src/builder/textblock-type-input-rule.ts#L18)

Build an input rule that changes the type of a textblock when the
matched text is typed into it. You'll usually want to start your
regexp with `^` to that it is only matched at the start of a
textblock. The optional `getAttrs` parameter can be used to compute
the new node's attributes, and works the same as in the
`wrappingInputRule` function.

## Parameters

| Parameter  | Type                                                                                                                   | Default value |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- | ------------- |
| `regexp`   | `RegExp`                                                                                                               | `undefined`   |
| `nodeType` | `NodeType`                                                                                                             | `undefined`   |
| `getAttrs` | \| `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; \| (`match`) => `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; | `null`        |

## Returns

[`InputRule`](../../../InputRule/classes/InputRule.md)

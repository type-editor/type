[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/inputrules](../../README.md) / [InputRule](../README.md) / InputRule

# Class: InputRule

Defined in: [InputRule.ts:13](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/inputrules/src/InputRule.ts#L13)

Input rules are regular expressions describing a piece of text
that, when typed, causes something to happen. This might be
changing two dashes into an emdash, wrapping a paragraph starting
with `'> '` into a blockquote, or something entirely different.

## Constructors

### Constructor

```ts
new InputRule(
   match,
   handler,
   options?): InputRule;
```

Defined in: [InputRule.ts:41](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/inputrules/src/InputRule.ts#L41)

Create an input rule. The rule applies when the user typed
something and the text directly in front of the cursor matches
`match`, which should end with `$`.

The `handler` can be a string, in which case the matched text, or
the first matched group in the regexp, is replaced by that
string.

Or it can be a function, which will be called with the match
array produced by
[`RegExp.exec`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec),
as well as the start and end of the matched range, and which can
return a [transaction](#state.Transaction) that describes the
rule's effect, or null to indicate the input was not handled.

#### Parameters

| Parameter | Type                                                                                               | Description                                                              |
| --------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `match`   | `RegExp`                                                                                           | The regular expression to match against typed text. Should end with `$`. |
| `handler` | \| `string` \| [`InputRuleHandler`](../../types/InputRuleHandler/type-aliases/InputRuleHandler.md) | Either a replacement string or a function that returns a transaction     |
| `options` | [`InputRuleOptions`](../../types/InputRuleOptions/interfaces/InputRuleOptions.md)                  | Additional configuration options for the rule                            |

#### Returns

`InputRule`

## Accessors

### handler

#### Get Signature

```ts
get handler(): InputRuleHandler;
```

Defined in: [InputRule.ts:59](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/inputrules/src/InputRule.ts#L59)

The handler function that applies the rule's transformation.

##### Returns

[`InputRuleHandler`](../../types/InputRuleHandler/type-aliases/InputRuleHandler.md)

---

### inCode

#### Get Signature

```ts
get inCode(): boolean | "only";
```

Defined in: [InputRule.ts:73](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/inputrules/src/InputRule.ts#L73)

Whether this rule applies inside code nodes.

##### Returns

`boolean` \| `"only"`

---

### inCodeMark

#### Get Signature

```ts
get inCodeMark(): boolean;
```

Defined in: [InputRule.ts:80](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/inputrules/src/InputRule.ts#L80)

Whether this rule applies inside code marks.

##### Returns

`boolean`

---

### match

#### Get Signature

```ts
get match(): RegExp;
```

Defined in: [InputRule.ts:52](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/inputrules/src/InputRule.ts#L52)

The regular expression pattern for this rule.

##### Returns

`RegExp`

---

### undoable

#### Get Signature

```ts
get undoable(): boolean;
```

Defined in: [InputRule.ts:66](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/inputrules/src/InputRule.ts#L66)

Whether this rule can be undone with the undoInputRule command.

##### Returns

`boolean`

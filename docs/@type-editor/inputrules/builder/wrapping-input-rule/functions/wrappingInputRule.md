[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/inputrules](../../../README.md) / [builder/wrapping-input-rule](../README.md) / wrappingInputRule

# Function: wrappingInputRule()

```ts
function wrappingInputRule(
  regexp,
  nodeType,
  getAttrs?,
  joinPredicate?,
): InputRule;
```

Defined in: [builder/wrapping-input-rule.ts:29](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/inputrules/src/builder/wrapping-input-rule.ts#L29)

Build an input rule for automatically wrapping a textblock when a
given string is typed. The `regexp` argument is
directly passed through to the `InputRule` constructor. You'll
probably want the regexp to start with `^`, so that the pattern can
only occur at the start of a textblock.

`nodeType` is the type of node to wrap in. If it needs attributes,
you can either pass them directly, or pass a function that will
compute them from the regular expression match.

By default, if there's a node with the same type above the newly
wrapped node, the rule will try to [join](#transform.Transform.join) those
two nodes. You can pass a join predicate, which takes a regular
expression match and the node before the wrapped node, and can
return a boolean to indicate whether a join should happen.

## Parameters

| Parameter        | Type                                                                                                                     | Default value |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------- |
| `regexp`         | `RegExp`                                                                                                                 | `undefined`   |
| `nodeType`       | `NodeType`                                                                                                               | `undefined`   |
| `getAttrs`       | \| `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; \| (`matches`) => `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; | `null`        |
| `joinPredicate?` | (`match`, `node`) => `boolean`                                                                                           | `undefined`   |

## Returns

[`InputRule`](../../../InputRule/classes/InputRule.md)

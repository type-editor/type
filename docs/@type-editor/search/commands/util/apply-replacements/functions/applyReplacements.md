[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/search](../../../../README.md) / [commands/util/apply-replacements](../README.md) / applyReplacements

# Function: applyReplacements()

```ts
function applyReplacements(transaction, replacements): void;
```

Defined in: [commands/util/apply-replacements.ts:12](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/search/src/commands/util/apply-replacements.ts#L12)

Applies all replacement ranges to a transaction in reverse order.

## Parameters

| Parameter      | Type                                                                                      | Description                              |
| -------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------- |
| `transaction`  | `PmTransaction`                                                                           | The transaction to apply replacements to |
| `replacements` | [`ReplacementRange`](../../../../types/ReplacementRange/interfaces/ReplacementRange.md)[] | Array of replacement ranges to apply     |

## Returns

`void`

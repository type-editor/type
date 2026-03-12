[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/state/plugin/StateField](../README.md) / StateFieldApplyFunction

# Type Alias: StateFieldApplyFunction()&lt;T&gt;

```ts
type StateFieldApplyFunction<T> = (transaction, value, oldState, newState) => T;
```

Defined in: [packages/editor-types/src/types/state/plugin/StateField.ts:7](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/editor-types/src/types/state/plugin/StateField.ts#L7)

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Parameters

| Parameter     | Type                                                                               |
| ------------- | ---------------------------------------------------------------------------------- |
| `transaction` | [`PmTransaction`](../../../PmTransaction/interfaces/PmTransaction.md)              |
| `value`       | `T`                                                                                |
| `oldState`    | [`PmEditorState`](../../../editor-state/PmEditorState/interfaces/PmEditorState.md) |
| `newState`    | [`PmEditorState`](../../../editor-state/PmEditorState/interfaces/PmEditorState.md) |

## Returns

`T`

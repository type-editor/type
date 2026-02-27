[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/state](../../../README.md) / [types/Command](../README.md) / DispatchFunction

# Type Alias: DispatchFunction()

```ts
type DispatchFunction = (transaction) => void;
```

Defined in: [state/src/types/Command.ts:16](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/types/Command.ts#L16)

Commands are functions that take a state and a an optional
transaction dispatch function and...

- determine whether they apply to this state
- if not, return false
- if `dispatch` was passed, perform their effect, possibly by
  passing a transaction to `dispatch`
- return true

In some cases, the editor view is passed as a third argument.

## Parameters

| Parameter     | Type            |
| ------------- | --------------- |
| `transaction` | `PmTransaction` |

## Returns

`void`

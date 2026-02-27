[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/state](../../../README.md) / [types/Command](../README.md) / DispatchFunction

# Type Alias: DispatchFunction()

```ts
type DispatchFunction = (transaction) => void;
```

Defined in: [state/src/types/Command.ts:16](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/types/Command.ts#L16)

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

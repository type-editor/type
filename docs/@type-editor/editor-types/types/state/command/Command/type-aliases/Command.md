[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/state/command/Command](../README.md) / Command

# Type Alias: Command()

```ts
type Command = (state, dispatch?, view?) => boolean;
```

Defined in: [packages/editor-types/src/types/state/command/Command.ts:17](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/state/command/Command.ts#L17)

Commands are functions that take a state and a an optional
transaction dispatch function and...

- determine whether they apply to this state
- if not, return false
- if `dispatch` was passed, perform their effect, possibly by
  passing a transaction to `dispatch`
- return true

In some cases, the editor view is passed as a third argument.

## Parameters

| Parameter   | Type                                                                               |
| ----------- | ---------------------------------------------------------------------------------- |
| `state`     | [`PmEditorState`](../../../editor-state/PmEditorState/interfaces/PmEditorState.md) |
| `dispatch?` | [`DispatchFunction`](../../DispatchFunction/type-aliases/DispatchFunction.md)      |
| `view?`     | [`PmEditorView`](../../../../view/PmEditorView/interfaces/PmEditorView.md)         |

## Returns

`boolean`

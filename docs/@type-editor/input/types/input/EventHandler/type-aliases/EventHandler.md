[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [types/input/EventHandler](../README.md) / EventHandler

# Type Alias: EventHandler()&lt;T&gt;

```ts
type EventHandler<T> = (view, event) => boolean | void;
```

Defined in: [types/input/EventHandler.ts:11](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/types/input/EventHandler.ts#L11)

Type definition for event handler functions used in the editor.

## Type Parameters

| Type Parameter        | Description                     |
| --------------------- | ------------------------------- |
| `T` _extends_ `Event` | The type of event being handled |

## Parameters

| Parameter | Type           | Description              |
| --------- | -------------- | ------------------------ |
| `view`    | `PmEditorView` | The editor view instance |
| `event`   | `T`            | The DOM event            |

## Returns

`boolean` \| `void`

True if the event was handled and should not be processed further

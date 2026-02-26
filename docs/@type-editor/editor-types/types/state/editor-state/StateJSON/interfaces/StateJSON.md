[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/state/editor-state/StateJSON](../README.md) / StateJSON

# Interface: StateJSON

Defined in: [packages/editor-types/src/types/state/editor-state/StateJSON.ts:10](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/editor-state/StateJSON.ts#L10)

JSON representation of an editor state.
Used for serialization/deserialization of state.

## Indexable

```ts
[prop: string]: unknown
```

Additional plugin-specific fields

## Properties

| Property                                                     | Type                                                                            | Description                                   | Defined in                                                                                                                                                                                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-doc"></a> `doc`                              | `NodeJSON`                                                                      | The document in JSON format                   | [packages/editor-types/src/types/state/editor-state/StateJSON.ts:12](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/editor-state/StateJSON.ts#L12) |
| <a id="property-scrolltoselection"></a> `scrollToSelection?` | `number`                                                                        | Optional scroll-to-selection counter          | [packages/editor-types/src/types/state/editor-state/StateJSON.ts:18](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/editor-state/StateJSON.ts#L18) |
| <a id="property-selection"></a> `selection?`                 | [`SelectionJSON`](../../../selection/SelectionJSON/interfaces/SelectionJSON.md) | Optional selection in JSON format             | [packages/editor-types/src/types/state/editor-state/StateJSON.ts:14](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/editor-state/StateJSON.ts#L14) |
| <a id="property-storedmarks"></a> `storedMarks?`             | `MarkJSON`[]                                                                    | Optional array of stored marks in JSON format | [packages/editor-types/src/types/state/editor-state/StateJSON.ts:16](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/editor-types/src/types/state/editor-state/StateJSON.ts#L16) |

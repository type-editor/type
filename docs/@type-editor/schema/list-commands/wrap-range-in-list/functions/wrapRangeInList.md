[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/schema](../../../README.md) / [list-commands/wrap-range-in-list](../README.md) / wrapRangeInList

# Function: wrapRangeInList()

```ts
function wrapRangeInList(transaction, range, listType, attrs?): boolean;
```

Defined in: [list-commands/wrap-range-in-list.ts:26](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/schema/src/list-commands/wrap-range-in-list.ts#L26)

Attempts to wrap the given node range in a list of the specified type.

This function handles special cases such as when the range is already at the top
of an existing list item, and determines whether the wrapping operation is possible.

## Parameters

| Parameter     | Type                                              | Default value | Description                                                                                                                                           |
| ------------- | ------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transaction` | `PmTransaction`                                   | `undefined`   | The transaction to add the wrapping operation to. If `null`, the function only queries whether the wrapping is possible without applying any changes. |
| `range`       | `NodeRange`                                       | `undefined`   | The range of nodes to be wrapped in the list.                                                                                                         |
| `listType`    | `NodeType`                                        | `undefined`   | The type of list node to wrap the range in (e.g., bullet_list, ordered_list).                                                                         |
| `attrs`       | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; | `null`        | Optional attributes to apply to the list node. Defaults to `null`.                                                                                    |

## Returns

`boolean`

`true` if the wrapping is possible (and applied if transaction is non-null),
`false` otherwise.

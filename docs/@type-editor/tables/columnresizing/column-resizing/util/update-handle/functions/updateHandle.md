[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/tables](../../../../../README.md) / [columnresizing/column-resizing/util/update-handle](../README.md) / updateHandle

# Function: updateHandle()

```ts
function updateHandle(view, value): void;
```

Defined in: [tables/src/columnresizing/column-resizing/util/update-handle.ts:11](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/tables/src/columnresizing/column-resizing/util/update-handle.ts#L11)

Updates the active resize handle position by dispatching a transaction.

## Parameters

| Parameter | Type           | Description                                                 |
| --------- | -------------- | ----------------------------------------------------------- |
| `view`    | `PmEditorView` | The editor view.                                            |
| `value`   | `number`       | The new handle position, or NO_ACTIVE_HANDLE to deactivate. |

## Returns

`void`

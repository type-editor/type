[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [clipboard/parse/add-context](../README.md) / addContext

# Function: addContext()

```ts
function addContext(slice, context): Slice;
```

Defined in: [clipboard/parse/add-context.ts:13](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/clipboard/parse/add-context.ts#L13)

Re-apply a simple context (list of node-type names and attrs) that was
removed during serialization. The context string is expected to be
JSON produced by `serializeForClipboard`.

## Parameters

| Parameter | Type     | Description                             |
| --------- | -------- | --------------------------------------- |
| `slice`   | `Slice`  | The slice to add context to             |
| `context` | `string` | JSON string containing the context data |

## Returns

`Slice`

A new slice with the context re-applied

[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [stop-native-horizontal-delete](../README.md) / stopNativeHorizontalDelete

# Function: stopNativeHorizontalDelete()

```ts
function stopNativeHorizontalDelete(view, direction): boolean;
```

Defined in: [stop-native-horizontal-delete.ts:32](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/commands/src/stop-native-horizontal-delete.ts#L32)

Prevents native browser delete behavior when deleting non-text nodes.

Handles deletion of atomic nodes (like images, widgets) by creating a proper
transaction instead of letting the browser handle it natively.

## Parameters

| Parameter   | Type           | Description                                                                |
| ----------- | -------------- | -------------------------------------------------------------------------- |
| `view`      | `PmEditorView` | The EditorView instance                                                    |
| `direction` | `Direction`    | Direction of deletion: -1 for backward (backspace), 1 for forward (delete) |

## Returns

`boolean`

True if deletion was handled, false to allow native behavior

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/history](../../../README.md) / [helper/must-preserve-items](../README.md) / mustPreserveItems

# Function: mustPreserveItems()

```ts
function mustPreserveItems(state): boolean;
```

Defined in: [helper/must-preserve-items.ts:17](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/history/src/helper/must-preserve-items.ts#L17)

Checks whether any plugin requires history items to be preserved for rebasing.

When a plugin has the `historyPreserveItems` property in its spec (typically
for collaboration support), history steps must be preserved exactly as they
came in to allow for proper rebasing of concurrent changes.

## Parameters

| Parameter | Type            | Description                                      |
| --------- | --------------- | ------------------------------------------------ |
| `state`   | `PmEditorState` | The editor state containing the plugins to check |

## Returns

`boolean`

True if any plugin requires preserving history items, false otherwise

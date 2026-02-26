[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/util/set-selection-origin](../README.md) / setSelectionOrigin

# Function: setSelectionOrigin()

```ts
function setSelectionOrigin(view, origin): void;
```

Defined in: [input-handler/util/set-selection-origin.ts:8](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/input-handler/util/set-selection-origin.ts#L8)

Records the origin of a selection change for tracking purposes.

## Parameters

| Parameter | Type           | Description                                       |
| --------- | -------------- | ------------------------------------------------- |
| `view`    | `PmEditorView` | The editor view                                   |
| `origin`  | `string`       | The origin type (e.g., 'key', 'pointer', 'paste') |

## Returns

`void`

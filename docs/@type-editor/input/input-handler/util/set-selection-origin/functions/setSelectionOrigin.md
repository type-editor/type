[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/util/set-selection-origin](../README.md) / setSelectionOrigin

# Function: setSelectionOrigin()

```ts
function setSelectionOrigin(view, origin): void;
```

Defined in: [input-handler/util/set-selection-origin.ts:8](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/input/src/input-handler/util/set-selection-origin.ts#L8)

Records the origin of a selection change for tracking purposes.

## Parameters

| Parameter | Type           | Description                                       |
| --------- | -------------- | ------------------------------------------------- |
| `view`    | `PmEditorView` | The editor view                                   |
| `origin`  | `string`       | The origin type (e.g., 'key', 'pointer', 'paste') |

## Returns

`void`

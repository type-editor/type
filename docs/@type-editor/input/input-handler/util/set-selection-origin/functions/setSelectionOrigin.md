[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/util/set-selection-origin](../README.md) / setSelectionOrigin

# Function: setSelectionOrigin()

```ts
function setSelectionOrigin(view, origin): void;
```

Defined in: [input-handler/util/set-selection-origin.ts:8](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/input/src/input-handler/util/set-selection-origin.ts#L8)

Records the origin of a selection change for tracking purposes.

## Parameters

| Parameter | Type           | Description                                       |
| --------- | -------------- | ------------------------------------------------- |
| `view`    | `PmEditorView` | The editor view                                   |
| `origin`  | `string`       | The origin type (e.g., 'key', 'pointer', 'paste') |

## Returns

`void`

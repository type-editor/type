[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/collab](../../../README.md) / [util/get-client-id](../README.md) / getClientID

# Function: getClientID()

```ts
function getClientID(state): string | number;
```

Defined in: [util/get-client-id.ts:13](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/collab/src/util/get-client-id.ts#L13)

Gets the client ID from the collab plugin configuration.

## Parameters

| Parameter | Type            | Description       |
| --------- | --------------- | ----------------- |
| `state`   | `PmEditorState` | The editor state. |

## Returns

`string` \| `number`

The client ID for this editor instance.

## Throws

Error if the collab plugin is not installed.

[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/collab](../../README.md) / [get-version](../README.md) / getVersion

# Function: getVersion()

```ts
function getVersion(state): number;
```

Defined in: [get-version.ts:15](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/collab/src/get-version.ts#L15)

Gets the version up to which the collab plugin has synced with the
central authority.

## Parameters

| Parameter | Type            | Description                                              |
| --------- | --------------- | -------------------------------------------------------- |
| `state`   | `PmEditorState` | The current editor state with the collab plugin enabled. |

## Returns

`number`

The current version number of the collaborative editing state.

## Throws

Error if the collab plugin is not installed.

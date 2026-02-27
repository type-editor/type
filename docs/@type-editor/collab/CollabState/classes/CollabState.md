[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/collab](../../README.md) / [CollabState](../README.md) / CollabState

# Class: CollabState

Defined in: [CollabState.ts:12](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/collab/src/CollabState.ts#L12)

Represents the state of the collaborative editing plugin.

This state field accumulates changes that need to be sent to the
central authority and makes it possible to integrate changes made
by peers into the local document. It tracks the current version
and any unconfirmed local steps.

## Constructors

### Constructor

```ts
new CollabState(version, unconfirmed): CollabState;
```

Defined in: [CollabState.ts:22](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/collab/src/CollabState.ts#L22)

Creates a new CollabState instance.

#### Parameters

| Parameter     | Type                                                              | Description                                                                                                                                                                                             |
| ------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`     | `number`                                                          | The version number of the last update received from the central authority. Starts at 0 or the value of the `version` property in the option object, for the editor's value when the option was enabled. |
| `unconfirmed` | readonly [`Rebaseable`](../../Rebaseable/classes/Rebaseable.md)[] | The local steps that haven't been successfully sent to the server yet.                                                                                                                                  |

#### Returns

`CollabState`

## Properties

| Property                                        | Modifier   | Type                                                              | Description                                                                                                                                                                                             | Defined in                                                                                                                                    |
| ----------------------------------------------- | ---------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-unconfirmed"></a> `unconfirmed` | `readonly` | readonly [`Rebaseable`](../../Rebaseable/classes/Rebaseable.md)[] | The local steps that haven't been successfully sent to the server yet.                                                                                                                                  | [CollabState.ts:24](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/collab/src/CollabState.ts#L24) |
| <a id="property-version"></a> `version`         | `readonly` | `number`                                                          | The version number of the last update received from the central authority. Starts at 0 or the value of the `version` property in the option object, for the editor's value when the option was enabled. | [CollabState.ts:23](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/collab/src/CollabState.ts#L23) |

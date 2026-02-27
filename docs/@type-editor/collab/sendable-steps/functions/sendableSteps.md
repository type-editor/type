[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/collab](../../README.md) / [sendable-steps](../README.md) / sendableSteps

# Function: sendableSteps()

```ts
function sendableSteps(state): SendableSteps;
```

Defined in: [sendable-steps.ts:23](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/collab/src/sendable-steps.ts#L23)

Provides data describing the editor's unconfirmed steps, which need
to be sent to the central authority. Returns null when there is
nothing to send.

The `origins` property holds the _original_ transforms that produced each
step. This can be useful for looking up timestamps and other
metadata for the steps, but note that the steps may have been
rebased, whereas the origin transforms are still the old,
unchanged objects.

## Parameters

| Parameter | Type            | Description                                              |
| --------- | --------------- | -------------------------------------------------------- |
| `state`   | `PmEditorState` | The current editor state with the collab plugin enabled. |

## Returns

[`SendableSteps`](../../types/SendableSteps/interfaces/SendableSteps.md)

An object containing sendable steps data, or null if there's nothing to send.

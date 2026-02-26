[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/collab](../../README.md) / [rebase-steps](../README.md) / rebaseSteps

# Function: rebaseSteps()

```ts
function rebaseSteps(steps, over, transform): Rebaseable[];
```

Defined in: [rebase-steps.ts:20](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/collab/src/rebase-steps.ts#L20)

**`Internal`**

Rebases a set of steps over another set of steps by undoing them,
applying the other steps, and then reapplying the original steps
with proper position mapping.

This is essential for collaborative editing when local changes need
to be rebased over remote changes received from other clients.

## Parameters

| Parameter   | Type                                                              | Description                                               |
| ----------- | ----------------------------------------------------------------- | --------------------------------------------------------- |
| `steps`     | readonly [`Rebaseable`](../../Rebaseable/classes/Rebaseable.md)[] | The local steps to rebase, wrapped as Rebaseable objects. |
| `over`      | readonly `PmStep`[]                                               | The remote steps to rebase over.                          |
| `transform` | `PmTransaction`                                                   | The transform to apply all steps to.                      |

## Returns

[`Rebaseable`](../../Rebaseable/classes/Rebaseable.md)[]

An array of rebased steps that could be successfully reapplied.

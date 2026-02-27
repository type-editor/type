[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/dom-coords-util](../../../../README.md) / [dom-coords/util/restore-scroll-stack](../README.md) / restoreScrollStack

# Function: restoreScrollStack()

```ts
function restoreScrollStack(stack, deltaTop): void;
```

Defined in: [dom-coords/util/restore-scroll-stack.ts:11](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/dom-coords-util/src/dom-coords/util/restore-scroll-stack.ts#L11)

Restore scroll positions from a stack, with an optional vertical adjustment.
Only updates scroll positions that have changed to avoid unnecessary reflows.

## Parameters

| Parameter  | Type                                                                            | Description                                      |
| ---------- | ------------------------------------------------------------------------------- | ------------------------------------------------ |
| `stack`    | [`ScrollPos`](../../../../types/dom-coords/ScrollPos/interfaces/ScrollPos.md)[] | Array of scroll positions to restore             |
| `deltaTop` | `number`                                                                        | Vertical adjustment to apply to scroll positions |

## Returns

`void`

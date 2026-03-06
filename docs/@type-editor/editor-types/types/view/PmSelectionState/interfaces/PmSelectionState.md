[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/editor-types](../../../../README.md) / [types/view/PmSelectionState](../README.md) / PmSelectionState

# Interface: PmSelectionState

Defined in: [packages/editor-types/src/types/view/PmSelectionState.ts:4](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/view/PmSelectionState.ts#L4)

## Properties

| Property                                          | Modifier   | Type     | Defined in                                                                                                                                                                                                  |
| ------------------------------------------------- | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-anchornode"></a> `anchorNode`     | `readonly` | `Node`   | [packages/editor-types/src/types/view/PmSelectionState.ts:5](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/view/PmSelectionState.ts#L5) |
| <a id="property-anchoroffset"></a> `anchorOffset` | `readonly` | `number` | [packages/editor-types/src/types/view/PmSelectionState.ts:6](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/view/PmSelectionState.ts#L6) |
| <a id="property-focusnode"></a> `focusNode`       | `readonly` | `Node`   | [packages/editor-types/src/types/view/PmSelectionState.ts:7](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/view/PmSelectionState.ts#L7) |

## Methods

### clear()

```ts
clear(): void;
```

Defined in: [packages/editor-types/src/types/view/PmSelectionState.ts:18](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/view/PmSelectionState.ts#L18)

Clears the selection state by resetting all nodes to null.

#### Returns

`void`

---

### eq()

```ts
eq(sel): boolean;
```

Defined in: [packages/editor-types/src/types/view/PmSelectionState.ts:25](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/view/PmSelectionState.ts#L25)

Checks if the given selection range equals this selection state.

#### Parameters

| Parameter | Type                                                                               | Description                    |
| --------- | ---------------------------------------------------------------------------------- | ------------------------------ |
| `sel`     | [`DOMSelectionRange`](../../dom/DOMSelectionRange/interfaces/DOMSelectionRange.md) | The selection range to compare |

#### Returns

`boolean`

true if both selections are identical

---

### set()

```ts
set(sel): void;
```

Defined in: [packages/editor-types/src/types/view/PmSelectionState.ts:13](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/view/PmSelectionState.ts#L13)

Updates the selection state with new values.

#### Parameters

| Parameter | Type                                                                               | Description                          |
| --------- | ---------------------------------------------------------------------------------- | ------------------------------------ |
| `sel`     | [`DOMSelectionRange`](../../dom/DOMSelectionRange/interfaces/DOMSelectionRange.md) | The DOM selection range to copy from |

#### Returns

`void`

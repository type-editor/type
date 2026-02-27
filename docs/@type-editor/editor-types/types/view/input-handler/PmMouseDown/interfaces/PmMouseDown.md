[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/view/input-handler/PmMouseDown](../README.md) / PmMouseDown

# Interface: PmMouseDown

Defined in: [packages/editor-types/src/types/view/input-handler/PmMouseDown.ts:3](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmMouseDown.ts#L3)

## Properties

| Property                                                          | Modifier   | Type                                                                                       | Defined in                                                                                                                                                                                                                    |
| ----------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-allowdefault"></a> `allowDefault`                 | `readonly` | `boolean`                                                                                  | [packages/editor-types/src/types/view/input-handler/PmMouseDown.ts:5](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmMouseDown.ts#L5) |
| <a id="property-delayedselectionsync"></a> `delayedSelectionSync` | `public`   | `boolean`                                                                                  | [packages/editor-types/src/types/view/input-handler/PmMouseDown.ts:7](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmMouseDown.ts#L7) |
| <a id="property-mightdrag"></a> `mightDrag`                       | `readonly` | \{ `addAttr`: `boolean`; `node`: `Node_2`; `pos`: `number`; `setUneditable`: `boolean`; \} | [packages/editor-types/src/types/view/input-handler/PmMouseDown.ts:6](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmMouseDown.ts#L6) |
| `mightDrag.addAttr`                                               | `public`   | `boolean`                                                                                  | [packages/editor-types/src/types/view/input-handler/PmMouseDown.ts:6](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmMouseDown.ts#L6) |
| `mightDrag.node`                                                  | `public`   | `Node_2`                                                                                   | [packages/editor-types/src/types/view/input-handler/PmMouseDown.ts:6](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmMouseDown.ts#L6) |
| `mightDrag.pos`                                                   | `public`   | `number`                                                                                   | [packages/editor-types/src/types/view/input-handler/PmMouseDown.ts:6](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmMouseDown.ts#L6) |
| `mightDrag.setUneditable`                                         | `public`   | `boolean`                                                                                  | [packages/editor-types/src/types/view/input-handler/PmMouseDown.ts:6](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmMouseDown.ts#L6) |

## Methods

### done()

```ts
done(): void;
```

Defined in: [packages/editor-types/src/types/view/input-handler/PmMouseDown.ts:13](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/editor-types/src/types/view/input-handler/PmMouseDown.ts#L13)

Cleans up the mouse down state, removing event listeners and
restoring DOM attributes that were modified for dragging.

#### Returns

`void`

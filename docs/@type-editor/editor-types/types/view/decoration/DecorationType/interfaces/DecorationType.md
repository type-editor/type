[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/view/decoration/DecorationType](../README.md) / DecorationType

# Interface: DecorationType

Defined in: [packages/editor-types/src/types/view/decoration/DecorationType.ts:11](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/view/decoration/DecorationType.ts#L11)

Interface representing the different types of decorations that can be applied to the editor.
Each decoration type defines how it is mapped, validated, compared, and destroyed.

## Properties

| Property                          | Type                                                                    | Description                                                                 | Defined in                                                                                                                                                                                                                      |
| --------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-spec"></a> `spec` | [`DecorationSpec`](../../DecorationSpec/type-aliases/DecorationSpec.md) | The specification object containing configuration for this decoration type. | [packages/editor-types/src/types/view/decoration/DecorationType.ts:14](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/view/decoration/DecorationType.ts#L14) |

## Methods

### destroy()

```ts
destroy(dom): void;
```

Defined in: [packages/editor-types/src/types/view/decoration/DecorationType.ts:45](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/view/decoration/DecorationType.ts#L45)

Performs cleanup when the decoration is removed.

#### Parameters

| Parameter | Type   | Description                                  |
| --------- | ------ | -------------------------------------------- |
| `dom`     | `Node` | The DOM node associated with the decoration. |

#### Returns

`void`

---

### eq()

```ts
eq(other): boolean;
```

Defined in: [packages/editor-types/src/types/view/decoration/DecorationType.ts:39](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/view/decoration/DecorationType.ts#L39)

Checks if this decoration type is equal to another.

#### Parameters

| Parameter | Type             | Description                                |
| --------- | ---------------- | ------------------------------------------ |
| `other`   | `DecorationType` | The other decoration type to compare with. |

#### Returns

`boolean`

True if the decoration types are equal, false otherwise.

---

### map()

```ts
map(
   mapping,
   span,
   offset,
   oldOffset): PmDecoration;
```

Defined in: [packages/editor-types/src/types/view/decoration/DecorationType.ts:24](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/view/decoration/DecorationType.ts#L24)

Maps this decoration type through a change in the document.

#### Parameters

| Parameter   | Type                                                                | Description                             |
| ----------- | ------------------------------------------------------------------- | --------------------------------------- |
| `mapping`   | [`Mappable`](../../../../transform/Mappable/interfaces/Mappable.md) | The mapping to apply to the decoration. |
| `span`      | [`PmDecoration`](../../PmDecoration/interfaces/PmDecoration.md)     | The decoration to map.                  |
| `offset`    | `number`                                                            | The current offset in the document.     |
| `oldOffset` | `number`                                                            | The offset before the change.           |

#### Returns

[`PmDecoration`](../../PmDecoration/interfaces/PmDecoration.md)

The mapped decoration, or null if it should be removed.

---

### valid()

```ts
valid(node, span): boolean;
```

Defined in: [packages/editor-types/src/types/view/decoration/DecorationType.ts:32](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/editor-types/src/types/view/decoration/DecorationType.ts#L32)

Validates that this decoration is still valid for the given node.

#### Parameters

| Parameter | Type                                                            | Description                   |
| --------- | --------------------------------------------------------------- | ----------------------------- |
| `node`    | `Node_2`                                                        | The node to validate against. |
| `span`    | [`PmDecoration`](../../PmDecoration/interfaces/PmDecoration.md) | The decoration to validate.   |

#### Returns

`boolean`

True if the decoration is valid, false otherwise.

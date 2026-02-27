[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/view/decoration/PmDecoration](../README.md) / PmDecoration

# Interface: PmDecoration

Defined in: [packages/editor-types/src/types/view/decoration/PmDecoration.ts:16](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/decoration/PmDecoration.ts#L16)

Decoration objects can be provided to the view through the
[`decorations` prop](#view.EditorProps.decorations). They come in
several variants—see the static members of this class for details.

Decorations allow you to add styling, attributes, or widgets to the
editor view without modifying the underlying document. They are used
for features like syntax highlighting, collaborative cursors, search
results, and inline UI elements.

## Properties

| Property                              | Modifier   | Type                                                                    | Defined in                                                                                                                                                                                                                  |
| ------------------------------------- | ---------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-from"></a> `from`     | `readonly` | `number`                                                                | [packages/editor-types/src/types/view/decoration/PmDecoration.ts:18](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/decoration/PmDecoration.ts#L18) |
| <a id="property-inline"></a> `inline` | `readonly` | `boolean`                                                               | [packages/editor-types/src/types/view/decoration/PmDecoration.ts:22](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/decoration/PmDecoration.ts#L22) |
| <a id="property-spec"></a> `spec`     | `readonly` | [`DecorationSpec`](../../DecorationSpec/type-aliases/DecorationSpec.md) | [packages/editor-types/src/types/view/decoration/PmDecoration.ts:21](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/decoration/PmDecoration.ts#L21) |
| <a id="property-to"></a> `to`         | `readonly` | `number`                                                                | [packages/editor-types/src/types/view/decoration/PmDecoration.ts:19](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/decoration/PmDecoration.ts#L19) |
| <a id="property-type"></a> `type`     | `readonly` | [`DecorationType`](../../DecorationType/interfaces/DecorationType.md)   | [packages/editor-types/src/types/view/decoration/PmDecoration.ts:20](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/decoration/PmDecoration.ts#L20) |
| <a id="property-widget"></a> `widget` | `readonly` | `boolean`                                                               | [packages/editor-types/src/types/view/decoration/PmDecoration.ts:23](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/decoration/PmDecoration.ts#L23) |

## Methods

### copy()

```ts
copy(from, to): PmDecoration;
```

Defined in: [packages/editor-types/src/types/view/decoration/PmDecoration.ts:32](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/decoration/PmDecoration.ts#L32)

Create a copy of this decoration with new positions.

#### Parameters

| Parameter | Type     | Description            |
| --------- | -------- | ---------------------- |
| `from`    | `number` | The new start position |
| `to`      | `number` | The new end position   |

#### Returns

`PmDecoration`

A new decoration with the same type but different positions

---

### eq()

```ts
eq(other, offset?): boolean;
```

Defined in: [packages/editor-types/src/types/view/decoration/PmDecoration.ts:41](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/decoration/PmDecoration.ts#L41)

Check if this decoration is equal to another decoration.

#### Parameters

| Parameter | Type           | Description                                             |
| --------- | -------------- | ------------------------------------------------------- |
| `other`   | `PmDecoration` | The decoration to compare with                          |
| `offset?` | `number`       | Optional offset to apply to this decoration's positions |

#### Returns

`boolean`

True if the decorations are equal

---

### map()

```ts
map(
   mapping,
   offset,
   oldOffset): PmDecoration;
```

Defined in: [packages/editor-types/src/types/view/decoration/PmDecoration.ts:51](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/decoration/PmDecoration.ts#L51)

Map this decoration through a document change.

#### Parameters

| Parameter   | Type                                                                | Description                               |
| ----------- | ------------------------------------------------------------------- | ----------------------------------------- |
| `mapping`   | [`Mappable`](../../../../transform/Mappable/interfaces/Mappable.md) | The mapping representing document changes |
| `offset`    | `number`                                                            | The current document offset               |
| `oldOffset` | `number`                                                            | The offset in the old document            |

#### Returns

`PmDecoration`

The mapped decoration or null if it was deleted

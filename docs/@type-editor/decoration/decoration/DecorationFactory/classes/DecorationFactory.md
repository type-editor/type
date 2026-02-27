[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/decoration](../../../README.md) / [decoration/DecorationFactory](../README.md) / DecorationFactory

# Class: DecorationFactory

Defined in: [decoration/DecorationFactory.ts:5](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/decoration/src/decoration/DecorationFactory.ts#L5)

## Constructors

### Constructor

```ts
new DecorationFactory(): DecorationFactory;
```

#### Returns

`DecorationFactory`

## Methods

### createDecoration()

```ts
static createDecoration(
   from,
   to,
   type): PmDecoration;
```

Defined in: [decoration/DecorationFactory.ts:18](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/decoration/src/decoration/DecorationFactory.ts#L18)

Creates a decoration with the given range and type.

This is a low-level method. In most cases, you should use
[Decoration.widget](../../Decoration/classes/Decoration.md#widget-1), [Decoration.inline](../../Decoration/classes/Decoration.md#inline-1), or [Decoration.node](../../Decoration/classes/Decoration.md#node) instead.

#### Parameters

| Parameter | Type             | Description                                               |
| --------- | ---------------- | --------------------------------------------------------- |
| `from`    | `number`         | The start position of the decoration                      |
| `to`      | `number`         | The end position of the decoration                        |
| `type`    | `DecorationType` | The decoration type (WidgetType, InlineType, or NodeType) |

#### Returns

`PmDecoration`

A new decoration instance

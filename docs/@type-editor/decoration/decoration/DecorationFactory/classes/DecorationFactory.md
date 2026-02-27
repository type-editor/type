[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/decoration](../../../README.md) / [decoration/DecorationFactory](../README.md) / DecorationFactory

# Class: DecorationFactory

Defined in: [decoration/DecorationFactory.ts:5](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/decoration/src/decoration/DecorationFactory.ts#L5)

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

Defined in: [decoration/DecorationFactory.ts:18](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/decoration/src/decoration/DecorationFactory.ts#L18)

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

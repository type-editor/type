[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/decoration](../../../README.md) / [decoration/InlineType](../README.md) / InlineType

# Class: InlineType

Defined in: [decoration/InlineType.ts:19](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/decoration/src/decoration/InlineType.ts#L19)

Inline decoration type that applies styling or attributes to a range
of content without changing the document structure.

Inline decorations are used to add visual styling or data attributes to
a range of content, such as highlighting search results, showing tracked
changes, or marking spelling errors. They render as inline elements (like
`<span>`) that wrap the decorated content.

## Extends

- [`AbstractDecorationType`](../../AbstractDecorationType/classes/AbstractDecorationType.md)

## Implements

- `DecorationType`

## Constructors

### Constructor

```ts
new InlineType(attrs, spec?): InlineType;
```

Defined in: [decoration/InlineType.ts:31](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/decoration/src/decoration/InlineType.ts#L31)

Creates a new inline decoration type.

#### Parameters

| Parameter | Type                                                                                         | Description                                      |
| --------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `attrs`   | [`DecorationAttrs`](../../../types/decoration/DecorationAttrs/interfaces/DecorationAttrs.md) | The attributes to apply to the decorated range   |
| `spec?`   | `InlineDecorationOptions`                                                                    | Optional configuration for the inline decoration |

#### Returns

`InlineType`

#### Overrides

[`AbstractDecorationType`](../../AbstractDecorationType/classes/AbstractDecorationType.md).[`constructor`](../../AbstractDecorationType/classes/AbstractDecorationType.md#constructor)

## Properties

| Property                                                                                | Modifier   | Type                              | Default value | Description                                                         | Inherited from                                                                                                                                                                                                                          | Defined in                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------- | ---------- | --------------------------------- | ------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-side"></a> `side`                                                       | `readonly` | `0`                               | `0`           | Inline decorations have no side preference since they span a range. | -                                                                                                                                                                                                                                       | [decoration/InlineType.ts:58](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/decoration/src/decoration/InlineType.ts#L58)                         |
| <a id="property-empty_decoration_widget_options"></a> `EMPTY_DECORATION_WIDGET_OPTIONS` | `readonly` | `Record`&lt;`string`, `never`&gt; | `{}`          | Empty options object used as default to avoid repeated allocations  | [`AbstractDecorationType`](../../AbstractDecorationType/classes/AbstractDecorationType.md).[`EMPTY_DECORATION_WIDGET_OPTIONS`](../../AbstractDecorationType/classes/AbstractDecorationType.md#property-empty_decoration_widget_options) | [decoration/AbstractDecorationType.ts:12](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/decoration/src/decoration/AbstractDecorationType.ts#L12) |

## Accessors

### attrs

#### Get Signature

```ts
get attrs(): DecorationAttrs;
```

Defined in: [decoration/InlineType.ts:40](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/decoration/src/decoration/InlineType.ts#L40)

The attributes to apply to the decorated range (class, style, data-\*, etc.)

##### Returns

[`DecorationAttrs`](../../../types/decoration/DecorationAttrs/interfaces/DecorationAttrs.md)

---

### spec

#### Get Signature

```ts
get spec(): InlineDecorationOptions;
```

Defined in: [decoration/InlineType.ts:49](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/decoration/src/decoration/InlineType.ts#L49)

Get the specification object for this inline decoration.

##### Returns

`InlineDecorationOptions`

The inline decoration options including inclusiveStart and inclusiveEnd

#### Implementation of

```ts
DecorationType.spec;
```

## Methods

### compareObjs()

```ts
protected compareObjs(a, b): boolean;
```

Defined in: [decoration/AbstractDecorationType.ts:22](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/decoration/src/decoration/AbstractDecorationType.ts#L22)

Deep comparison of two objects to check if they have the same properties
and values. This is used to determine if two decoration specs are equal.

#### Parameters

| Parameter | Type                                | Description              |
| --------- | ----------------------------------- | ------------------------ |
| `a`       | `Record`&lt;`string`, `unknown`&gt; | First object to compare  |
| `b`       | `Record`&lt;`string`, `unknown`&gt; | Second object to compare |

#### Returns

`boolean`

True if objects are equal, false otherwise

#### Inherited from

[`AbstractDecorationType`](../../AbstractDecorationType/classes/AbstractDecorationType.md).[`compareObjs`](../../AbstractDecorationType/classes/AbstractDecorationType.md#compareobjs)

---

### destroy()

```ts
destroy(): void;
```

Defined in: [decoration/InlineType.ts:123](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/decoration/src/decoration/InlineType.ts#L123)

Clean up this decoration. Inline decorations have no cleanup needed.

#### Returns

`void`

#### Implementation of

```ts
DecorationType.destroy;
```

---

### eq()

```ts
eq(other): boolean;
```

Defined in: [decoration/InlineType.ts:103](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/decoration/src/decoration/InlineType.ts#L103)

Check if this inline type is equal to another decoration type.

#### Parameters

| Parameter | Type             | Description                               |
| --------- | ---------------- | ----------------------------------------- |
| `other`   | `DecorationType` | The other decoration type to compare with |

#### Returns

`boolean`

True if the types are equal

#### Implementation of

```ts
DecorationType.eq;
```

---

### map()

```ts
map(
   mapping,
   span,
   offset,
   oldOffset): PmDecoration;
```

Defined in: [decoration/InlineType.ts:69](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/decoration/src/decoration/InlineType.ts#L69)

Map this decoration through a document change.

#### Parameters

| Parameter   | Type           | Description                                      |
| ----------- | -------------- | ------------------------------------------------ |
| `mapping`   | `Mappable`     | The mapping object representing document changes |
| `span`      | `PmDecoration` | The decoration being mapped                      |
| `offset`    | `number`       | The current document offset                      |
| `oldOffset` | `number`       | The offset in the old document                   |

#### Returns

`PmDecoration`

The mapped decoration or null if the range collapsed

#### Implementation of

```ts
DecorationType.map;
```

---

### valid()

```ts
valid(_, span): boolean;
```

Defined in: [decoration/InlineType.ts:93](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/decoration/src/decoration/InlineType.ts#L93)

Check if this inline decoration is valid for the given node and span.

#### Parameters

| Parameter | Type           | Description                     |
| --------- | -------------- | ------------------------------- |
| `_`       | `Node_2`       | The node (unused)               |
| `span`    | `PmDecoration` | The decoration span to validate |

#### Returns

`boolean`

True if the span has a positive length

#### Implementation of

```ts
DecorationType.valid;
```

---

### is()

```ts
static is(span): boolean;
```

Defined in: [decoration/InlineType.ts:116](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/decoration/src/decoration/InlineType.ts#L116)

Check if a decoration is an inline decoration.

#### Parameters

| Parameter | Type           | Description             |
| --------- | -------------- | ----------------------- |
| `span`    | `PmDecoration` | The decoration to check |

#### Returns

`boolean`

True if the decoration is an inline type

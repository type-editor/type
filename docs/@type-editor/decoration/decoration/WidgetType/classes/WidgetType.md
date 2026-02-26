[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/decoration](../../../README.md) / [decoration/WidgetType](../README.md) / WidgetType

# Class: WidgetType

Defined in: [decoration/WidgetType.ts:18](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/WidgetType.ts#L18)

Widget decoration type that represents a DOM node inserted at a specific
position in the document. Widgets appear at a single position and don't
span a range.

Widgets are useful for adding inline UI elements like mention suggestions,
inline buttons, or custom markers that don't correspond to actual document
content. The widget's DOM node is inserted into the editor at the specified
position without affecting the document model.

## Extends

- [`AbstractDecorationType`](../../AbstractDecorationType/classes/AbstractDecorationType.md)

## Implements

- `DecorationType`

## Constructors

### Constructor

```ts
new WidgetType(toDOM, spec?): WidgetType;
```

Defined in: [decoration/WidgetType.ts:33](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/WidgetType.ts#L33)

Creates a new widget decoration type.

#### Parameters

| Parameter | Type                                                                                                 | Description                                           |
| --------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `toDOM`   | [`WidgetConstructor`](../../../types/decoration/WidgetConstructor/type-aliases/WidgetConstructor.md) | Function that constructs the DOM node for this widget |
| `spec?`   | `DecorationWidgetOptions`                                                                            | Optional configuration for the widget decoration      |

#### Returns

`WidgetType`

#### Overrides

[`AbstractDecorationType`](../../AbstractDecorationType/classes/AbstractDecorationType.md).[`constructor`](../../AbstractDecorationType/classes/AbstractDecorationType.md#constructor)

## Properties

| Property                                                                                | Modifier   | Type                              | Default value | Description                                                        | Inherited from                                                                                                                                                                                                                          | Defined in                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------- | ---------- | --------------------------------- | ------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-empty_decoration_widget_options"></a> `EMPTY_DECORATION_WIDGET_OPTIONS` | `readonly` | `Record`&lt;`string`, `never`&gt; | `{}`          | Empty options object used as default to avoid repeated allocations | [`AbstractDecorationType`](../../AbstractDecorationType/classes/AbstractDecorationType.md).[`EMPTY_DECORATION_WIDGET_OPTIONS`](../../AbstractDecorationType/classes/AbstractDecorationType.md#property-empty_decoration_widget_options) | [decoration/AbstractDecorationType.ts:12](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/AbstractDecorationType.ts#L12) |

## Accessors

### side

#### Get Signature

```ts
get side(): number;
```

Defined in: [decoration/WidgetType.ts:62](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/WidgetType.ts#L62)

Get the side value that determines whether the widget appears
before (-1) or after (1) the position, or at the position (0).

This affects how the widget is positioned relative to the cursor
and other content at the same position.

##### Returns

`number`

The side value: -1 (before), 0 (at), or 1 (after)

---

### spec

#### Get Signature

```ts
get spec(): DecorationWidgetOptions;
```

Defined in: [decoration/WidgetType.ts:49](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/WidgetType.ts#L49)

Get the specification object for this widget decoration.

##### Returns

`DecorationWidgetOptions`

The widget decoration options including side, stopEvent, ignoreSelection, and key

#### Implementation of

```ts
DecorationType.spec;
```

---

### toDOM

#### Get Signature

```ts
get toDOM(): WidgetConstructor;
```

Defined in: [decoration/WidgetType.ts:40](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/WidgetType.ts#L40)

##### Returns

[`WidgetConstructor`](../../../types/decoration/WidgetConstructor/type-aliases/WidgetConstructor.md)

## Methods

### compareObjs()

```ts
protected compareObjs(a, b): boolean;
```

Defined in: [decoration/AbstractDecorationType.ts:22](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/AbstractDecorationType.ts#L22)

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
destroy(node): void;
```

Defined in: [decoration/WidgetType.ts:129](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/WidgetType.ts#L129)

Clean up this widget decoration when it's removed from the document.
Calls the optional destroy callback if specified.

#### Parameters

| Parameter | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `node`    | `Node` | The DOM node being destroyed |

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

Defined in: [decoration/WidgetType.ts:101](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/WidgetType.ts#L101)

Check if this widget type is equal to another decoration type.

#### Parameters

| Parameter | Type         | Description                               |
| --------- | ------------ | ----------------------------------------- |
| `other`   | `WidgetType` | The other decoration type to compare with |

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

Defined in: [decoration/WidgetType.ts:75](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/WidgetType.ts#L75)

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

The mapped decoration or null if the position was deleted

#### Implementation of

```ts
DecorationType.map;
```

---

### valid()

```ts
valid(): boolean;
```

Defined in: [decoration/WidgetType.ts:91](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/WidgetType.ts#L91)

Check if this widget decoration is valid. Widgets are always valid.

#### Returns

`boolean`

Always returns true

#### Implementation of

```ts
DecorationType.valid;
```

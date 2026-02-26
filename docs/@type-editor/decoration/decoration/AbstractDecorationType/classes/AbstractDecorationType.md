[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/decoration](../../../README.md) / [decoration/AbstractDecorationType](../README.md) / AbstractDecorationType

# Class: AbstractDecorationType

Defined in: [decoration/AbstractDecorationType.ts:9](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/AbstractDecorationType.ts#L9)

Base class for decoration types that provides common functionality
for comparing decoration specifications.

This abstract class serves as a foundation for WidgetType,
InlineType, and NodeType, providing shared utility
methods for comparing decoration specifications.

## Extended by

- [`InlineType`](../../InlineType/classes/InlineType.md)
- [`NodeType`](../../NodeType/classes/NodeType.md)
- [`WidgetType`](../../WidgetType/classes/WidgetType.md)

## Constructors

### Constructor

```ts
new AbstractDecorationType(): AbstractDecorationType;
```

#### Returns

`AbstractDecorationType`

## Properties

| Property                                                                                | Modifier   | Type                              | Default value | Description                                                        | Defined in                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------- | ---------- | --------------------------------- | ------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-empty_decoration_widget_options"></a> `EMPTY_DECORATION_WIDGET_OPTIONS` | `readonly` | `Record`&lt;`string`, `never`&gt; | `{}`          | Empty options object used as default to avoid repeated allocations | [decoration/AbstractDecorationType.ts:12](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/AbstractDecorationType.ts#L12) |

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

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/decoration](../../../README.md) / [decoration/AbstractDecorationSource](../README.md) / AbstractDecorationSource

# Abstract Class: AbstractDecorationSource

Defined in: [decoration/AbstractDecorationSource.ts:11](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/decoration/src/decoration/AbstractDecorationSource.ts#L11)

Base class for decoration sources that provides common functionality
for handling overlapping decorations and sorting.

This abstract class serves as a foundation for DecorationSet and
DecorationGroup, providing shared utility methods for managing
decoration collections.

## Extended by

- [`DecorationGroup`](../../DecorationGroup/classes/DecorationGroup.md)
- [`DecorationSet`](../../DecorationSet/classes/DecorationSet.md)

## Constructors

### Constructor

```ts
new AbstractDecorationSource(): AbstractDecorationSource;
```

#### Returns

`AbstractDecorationSource`

## Properties

| Property                                                                                | Modifier   | Type                              | Default value | Description                                                        | Defined in                                                                                                                                                                                        |
| --------------------------------------------------------------------------------------- | ---------- | --------------------------------- | ------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-empty_decoration_widget_options"></a> `EMPTY_DECORATION_WIDGET_OPTIONS` | `readonly` | `Record`&lt;`string`, `never`&gt; | `{}`          | Empty options object used as default to avoid repeated allocations | [decoration/AbstractDecorationSource.ts:14](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/decoration/src/decoration/AbstractDecorationSource.ts#L14) |

## Methods

### removeOverlap()

```ts
protected removeOverlap(spans): PmDecoration[];
```

Defined in: [decoration/AbstractDecorationSource.ts:25](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/decoration/src/decoration/AbstractDecorationSource.ts#L25)

Scan a sorted array of decorations for partially overlapping spans,
and split those so that only fully overlapping spans are left (to
make subsequent rendering easier). Will return the input array if
no partially overlapping spans are found (the common case).

#### Parameters

| Parameter | Type                      | Description                         |
| --------- | ------------------------- | ----------------------------------- |
| `spans`   | readonly `PmDecoration`[] | The array of decorations to process |

#### Returns

`PmDecoration`[]

A new array with overlaps removed, or the original if no overlaps exist

---

### sortDecorations()

```ts
protected static sortDecorations(spans): PmDecoration[];
```

Defined in: [decoration/AbstractDecorationSource.ts:96](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/decoration/src/decoration/AbstractDecorationSource.ts#L96)

Comparator function used to sort decorations by position.
Decorations with lower start positions come first, and within
a set with the same start position, those with smaller end
positions come first.

#### Parameters

| Parameter | Type             |
| --------- | ---------------- |
| `spans`   | `PmDecoration`[] |

#### Returns

`PmDecoration`[]

A comparator function for sorting decorations

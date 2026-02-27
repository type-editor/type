[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/decoration](../../../README.md) / [decoration/NodeType](../README.md) / NodeType

# Class: NodeType

Defined in: [decoration/NodeType.ts:19](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/decoration/src/decoration/NodeType.ts#L19)

Node decoration type that applies styling or attributes to an entire
node in the document. Node decorations span exactly one node.

Node decorations are used to add styling or attributes to block-level
nodes, such as highlighting an entire paragraph, marking a code block
as having an error, or adding a visual indicator to a selected table cell.
They wrap the entire node's DOM representation.

## Extends

- [`AbstractDecorationType`](../../AbstractDecorationType/classes/AbstractDecorationType.md)

## Implements

- `DecorationType`

## Constructors

### Constructor

```ts
new NodeType(attrs, spec?): NodeType;
```

Defined in: [decoration/NodeType.ts:31](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/decoration/src/decoration/NodeType.ts#L31)

Creates a new node decoration type.

#### Parameters

| Parameter | Type                                                                                         | Description                                    |
| --------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `attrs`   | [`DecorationAttrs`](../../../types/decoration/DecorationAttrs/interfaces/DecorationAttrs.md) | The attributes to apply to the decorated node  |
| `spec?`   | `NodeDecorationOptions`                                                                      | Optional configuration for the node decoration |

#### Returns

`NodeType`

#### Overrides

[`AbstractDecorationType`](../../AbstractDecorationType/classes/AbstractDecorationType.md).[`constructor`](../../AbstractDecorationType/classes/AbstractDecorationType.md#constructor)

## Properties

| Property                                                                                | Modifier   | Type                              | Default value | Description                                                              | Inherited from                                                                                                                                                                                                                          | Defined in                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------- | ---------- | --------------------------------- | ------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-side"></a> `side`                                                       | `readonly` | `0`                               | `0`           | Node decorations have no side preference since they wrap an entire node. | -                                                                                                                                                                                                                                       | [decoration/NodeType.ts:46](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/decoration/src/decoration/NodeType.ts#L46)                             |
| <a id="property-empty_decoration_widget_options"></a> `EMPTY_DECORATION_WIDGET_OPTIONS` | `readonly` | `Record`&lt;`string`, `never`&gt; | `{}`          | Empty options object used as default to avoid repeated allocations       | [`AbstractDecorationType`](../../AbstractDecorationType/classes/AbstractDecorationType.md).[`EMPTY_DECORATION_WIDGET_OPTIONS`](../../AbstractDecorationType/classes/AbstractDecorationType.md#property-empty_decoration_widget_options) | [decoration/AbstractDecorationType.ts:12](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/decoration/src/decoration/AbstractDecorationType.ts#L12) |

## Accessors

### attrs

#### Get Signature

```ts
get attrs(): DecorationAttrs;
```

Defined in: [decoration/NodeType.ts:37](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/decoration/src/decoration/NodeType.ts#L37)

##### Returns

[`DecorationAttrs`](../../../types/decoration/DecorationAttrs/interfaces/DecorationAttrs.md)

---

### spec

#### Get Signature

```ts
get spec(): NodeDecorationOptions;
```

Defined in: [decoration/NodeType.ts:53](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/decoration/src/decoration/NodeType.ts#L53)

Get the specification object for this node decoration.

##### Returns

`NodeDecorationOptions`

The node decoration options and configuration

#### Implementation of

```ts
DecorationType.spec;
```

## Methods

### compareObjs()

```ts
protected compareObjs(a, b): boolean;
```

Defined in: [decoration/AbstractDecorationType.ts:22](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/decoration/src/decoration/AbstractDecorationType.ts#L22)

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

Defined in: [decoration/NodeType.ts:119](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/decoration/src/decoration/NodeType.ts#L119)

Clean up this decoration. Node decorations have no cleanup needed.

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

Defined in: [decoration/NodeType.ts:109](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/decoration/src/decoration/NodeType.ts#L109)

Check if this node type is equal to another decoration type.

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

Defined in: [decoration/NodeType.ts:66](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/decoration/src/decoration/NodeType.ts#L66)

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

The mapped decoration or null if the node was deleted or split

#### Implementation of

```ts
DecorationType.map;
```

---

### valid()

```ts
valid(node, span): boolean;
```

Defined in: [decoration/NodeType.ts:90](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/decoration/src/decoration/NodeType.ts#L90)

Check if this node decoration is valid for the given node and span.
A node decoration is valid only if it spans exactly one non-text node.

#### Parameters

| Parameter | Type           | Description                                   |
| --------- | -------------- | --------------------------------------------- |
| `node`    | `Node_2`       | The parent node containing the decorated node |
| `span`    | `PmDecoration` | The decoration span to validate               |

#### Returns

`boolean`

True if the span covers exactly one non-text child node

#### Implementation of

```ts
DecorationType.valid;
```

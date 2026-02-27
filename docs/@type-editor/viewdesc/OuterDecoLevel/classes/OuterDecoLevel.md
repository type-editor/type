[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/viewdesc](../../README.md) / [OuterDecoLevel](../README.md) / OuterDecoLevel

# Class: OuterDecoLevel

Defined in: [OuterDecoLevel.ts:15](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/viewdesc/src/view-desc/OuterDecoLevel.ts#L15)

Represents a level of outer decoration wrapping, storing HTML attributes
like nodeName, class, style, and other custom attributes as key-value pairs.

Decorations can add multiple wrapper layers around nodes. Each layer can:

- Specify a nodeName to create a new wrapper element
- Add CSS classes
- Add inline styles
- Add custom HTML attributes

For example, a node might be wrapped like:
`<div class="highlight"><span style="color: red">content</span></div>`
This would use two OuterDecoLevel instances.

## Constructors

### Constructor

```ts
new OuterDecoLevel(nodeName?): OuterDecoLevel;
```

Defined in: [OuterDecoLevel.ts:33](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/viewdesc/src/view-desc/OuterDecoLevel.ts#L33)

Creates a new OuterDecoLevel.

#### Parameters

| Parameter   | Type     | Description                                 |
| ----------- | -------- | ------------------------------------------- |
| `nodeName?` | `string` | Optional tag name for this decoration level |

#### Returns

`OuterDecoLevel`

## Accessors

### attributes

#### Get Signature

```ts
get attributes(): ReadonlyMap<string, string>;
```

Defined in: [OuterDecoLevel.ts:67](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/viewdesc/src/view-desc/OuterDecoLevel.ts#L67)

Gets the read-only map of custom attributes (excluding class, style, nodeName).

##### Returns

`ReadonlyMap`&lt;`string`, `string`&gt;

---

### class

#### Get Signature

```ts
get class(): string;
```

Defined in: [OuterDecoLevel.ts:47](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/viewdesc/src/view-desc/OuterDecoLevel.ts#L47)

##### Returns

`string`

#### Set Signature

```ts
set class(className): void;
```

Defined in: [OuterDecoLevel.ts:51](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/viewdesc/src/view-desc/OuterDecoLevel.ts#L51)

##### Parameters

| Parameter   | Type     |
| ----------- | -------- |
| `className` | `string` |

##### Returns

`void`

---

### nodeName

#### Get Signature

```ts
get nodeName(): string;
```

Defined in: [OuterDecoLevel.ts:39](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/viewdesc/src/view-desc/OuterDecoLevel.ts#L39)

##### Returns

`string`

#### Set Signature

```ts
set nodeName(nodeName): void;
```

Defined in: [OuterDecoLevel.ts:43](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/viewdesc/src/view-desc/OuterDecoLevel.ts#L43)

##### Parameters

| Parameter  | Type     |
| ---------- | -------- |
| `nodeName` | `string` |

##### Returns

`void`

---

### style

#### Get Signature

```ts
get style(): string;
```

Defined in: [OuterDecoLevel.ts:55](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/viewdesc/src/view-desc/OuterDecoLevel.ts#L55)

##### Returns

`string`

#### Set Signature

```ts
set style(style): void;
```

Defined in: [OuterDecoLevel.ts:59](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/viewdesc/src/view-desc/OuterDecoLevel.ts#L59)

##### Parameters

| Parameter | Type     |
| --------- | -------- |
| `style`   | `string` |

##### Returns

`void`

## Methods

### setAttribute()

```ts
setAttribute(name, value): void;
```

Defined in: [OuterDecoLevel.ts:77](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/viewdesc/src/view-desc/OuterDecoLevel.ts#L77)

Sets a custom HTML attribute on this decoration level.

#### Parameters

| Parameter | Type     | Description                                   |
| --------- | -------- | --------------------------------------------- |
| `name`    | `string` | The attribute name (e.g., 'data-id', 'title') |
| `value`   | `string` | The attribute value                           |

#### Returns

`void`

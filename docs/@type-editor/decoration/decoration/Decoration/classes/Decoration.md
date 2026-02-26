[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/decoration](../../../README.md) / [decoration/Decoration](../README.md) / Decoration

# Class: Decoration

Defined in: [decoration/Decoration.ts:45](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/Decoration.ts#L45)

Decoration objects can be provided to the view through the
[`decorations` prop](#view.EditorProps.decorations). They come in
several variants—see the static members of this class for details.

Decorations allow you to add styling, attributes, or widgets to the
editor view without modifying the underlying document. They are used
for features like syntax highlighting, collaborative cursors, search
results, and inline UI elements.

Provides static methods to create different types of decorations:

- Widget decorations: Insert DOM nodes at specific positions
- Inline decorations: Apply styling to ranges of inline content
- Node decorations: Apply styling to entire block nodes

## Example

```typescript
// Create an inline decoration to highlight text
Decoration.inline(from, to, { class: "highlight" });

// Create a widget decoration to insert a DOM element
Decoration.widget(pos, () => document.createElement("button"));

// Create a node decoration to style a block
Decoration.node(from, to, { class: "selected-paragraph" });
```

## Implements

- `PmDecoration`

## Constructors

### Constructor

```ts
new Decoration(
   from,
   to,
   type): Decoration;
```

Defined in: [decoration/Decoration.ts:61](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/Decoration.ts#L61)

Creates a new decoration instance.

#### Parameters

| Parameter | Type             | Description                                                         |
| --------- | ---------------- | ------------------------------------------------------------------- |
| `from`    | `number`         | The start position of the decoration                                |
| `to`      | `number`         | The end position. Will be the same as `from` for widget decorations |
| `type`    | `DecorationType` | The type of decoration (widget, inline, or node)                    |

#### Returns

`Decoration`

## Accessors

### from

#### Get Signature

```ts
get from(): number;
```

Defined in: [decoration/Decoration.ts:72](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/Decoration.ts#L72)

Get the start position of this decoration.

##### Returns

`number`

The start position in the document (0-indexed)

#### Implementation of

```ts
PmDecoration.from;
```

---

### inline

#### Get Signature

```ts
get inline(): boolean;
```

Defined in: [decoration/Decoration.ts:111](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/Decoration.ts#L111)

Check if this is an inline decoration.

##### Returns

`boolean`

True if this decoration applies styling to a range of inline content

#### Implementation of

```ts
PmDecoration.inline;
```

---

### spec

#### Get Signature

```ts
get spec(): DecorationSpec;
```

Defined in: [decoration/Decoration.ts:102](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/Decoration.ts#L102)

The spec provided when creating this decoration. Can be useful
if you've stored extra information in that object.

##### Returns

`DecorationSpec`

The decoration specification with options and custom data

#### Implementation of

```ts
PmDecoration.spec;
```

---

### to

#### Get Signature

```ts
get to(): number;
```

Defined in: [decoration/Decoration.ts:83](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/Decoration.ts#L83)

Get the end position of this decoration.

For widget decorations, this will equal `from` since widgets don't span a range.

##### Returns

`number`

The end position in the document (0-indexed)

#### Implementation of

```ts
PmDecoration.to;
```

---

### type

#### Get Signature

```ts
get type(): DecorationType;
```

Defined in: [decoration/Decoration.ts:92](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/Decoration.ts#L92)

Get the type of this decoration.

##### Returns

`DecorationType`

The decoration type (WidgetType, InlineType, or NodeType)

#### Implementation of

```ts
PmDecoration.type;
```

---

### widget

#### Get Signature

```ts
get widget(): boolean;
```

Defined in: [decoration/Decoration.ts:120](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/Decoration.ts#L120)

Check if this is a widget decoration.

##### Returns

`boolean`

True if this decoration inserts a DOM widget at a position

#### Implementation of

```ts
PmDecoration.widget;
```

## Methods

### copy()

```ts
copy(from, to): Decoration;
```

Defined in: [decoration/Decoration.ts:256](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/Decoration.ts#L256)

Create a copy of this decoration with new positions.

#### Parameters

| Parameter | Type     | Description            |
| --------- | -------- | ---------------------- |
| `from`    | `number` | The new start position |
| `to`      | `number` | The new end position   |

#### Returns

`Decoration`

A new decoration with the same type but different positions

#### Implementation of

```ts
PmDecoration.copy;
```

---

### eq()

```ts
eq(other, offset?): boolean;
```

Defined in: [decoration/Decoration.ts:267](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/Decoration.ts#L267)

Check if this decoration is equal to another decoration.

#### Parameters

| Parameter | Type           | Default value | Description                                             |
| --------- | -------------- | ------------- | ------------------------------------------------------- |
| `other`   | `PmDecoration` | `undefined`   | The decoration to compare with                          |
| `offset`  | `number`       | `0`           | Optional offset to apply to this decoration's positions |

#### Returns

`boolean`

True if the decorations are equal

#### Implementation of

```ts
PmDecoration.eq;
```

---

### map()

```ts
map(
   mapping,
   offset,
   oldOffset): Decoration;
```

Defined in: [decoration/Decoration.ts:279](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/Decoration.ts#L279)

Map this decoration through a document change.

#### Parameters

| Parameter   | Type       | Description                               |
| ----------- | ---------- | ----------------------------------------- |
| `mapping`   | `Mappable` | The mapping representing document changes |
| `offset`    | `number`   | The current document offset               |
| `oldOffset` | `number`   | The offset in the old document            |

#### Returns

`Decoration`

The mapped decoration or null if it was deleted

#### Implementation of

```ts
PmDecoration.map;
```

---

### inline()

```ts
static inline(
   from,
   to,
   attrs,
   spec?): Decoration;
```

Defined in: [decoration/Decoration.ts:204](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/Decoration.ts#L204)

Creates an inline decoration, which adds the given attributes to
each inline node between `from` and `to`.

Inline decorations are rendered as inline elements (like `<span>`)
that wrap the decorated content. They are useful for:

- Highlighting search results
- Showing spell-check errors
- Marking tracked changes
- Adding temporary styling

#### Parameters

| Parameter | Type                                                                                         | Description                                                                                                                                                                                                             |
| --------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`    | `number`                                                                                     | The start position of the range to decorate                                                                                                                                                                             |
| `to`      | `number`                                                                                     | The end position of the range to decorate                                                                                                                                                                               |
| `attrs`   | [`DecorationAttrs`](../../../types/decoration/DecorationAttrs/interfaces/DecorationAttrs.md) | Attributes to apply to the decorated range. Can include: - `class`: CSS class name(s) - `style`: Inline CSS styles - `nodeName`: HTML tag name (default: "span") - Any other HTML attributes (e.g., `data-*`, `title`)  |
| `spec?`   | `InlineDecorationOptions`                                                                    | Optional configuration: - `inclusiveStart`: If true, content inserted at the start position is included in the decoration - `inclusiveEnd`: If true, content inserted at the end position is included in the decoration |

#### Returns

`Decoration`

A new inline decoration

#### Example

```typescript
// Highlight search results
const highlight = Decoration.inline(5, 15, {
  class: "search-result",
  style: "background-color: yellow",
});

// Mark a spelling error
const error = Decoration.inline(20, 25, {
  class: "spelling-error",
  title: "Possible spelling mistake",
});
```

---

### node()

```ts
static node(
   from,
   to,
   attrs,
   spec?): Decoration;
```

Defined in: [decoration/Decoration.ts:245](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/Decoration.ts#L245)

Creates a node decoration. `from` and `to` should point precisely
before and after a node in the document. That node, and only that
node, will receive the given attributes.

Node decorations wrap the entire DOM representation of a block-level
node. They are useful for:

- Highlighting selected blocks
- Marking nodes with errors or warnings
- Adding visual indicators to specific paragraphs or code blocks
- Showing collaborative editing cursors at block level

#### Parameters

| Parameter | Type                                                                                         | Description                                                                                                                                                   |
| --------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`    | `number`                                                                                     | The start position of the node (must be exactly at node boundary)                                                                                             |
| `to`      | `number`                                                                                     | The end position of the node (must be exactly at node boundary, equals from + node.nodeSize)                                                                  |
| `attrs`   | [`DecorationAttrs`](../../../types/decoration/DecorationAttrs/interfaces/DecorationAttrs.md) | Attributes to apply to the node. Can include: - `class`: CSS class name(s) - `style`: Inline CSS styles - Any other HTML attributes (e.g., `data-*`, `title`) |
| `spec?`   | `NodeDecorationOptions`                                                                      | Optional configuration for the node decoration                                                                                                                |

#### Returns

`Decoration`

A new node decoration

#### Example

```typescript
// Highlight a selected paragraph
// Assuming a paragraph starts at position 10 and has nodeSize 20
const nodeDecoration = Decoration.node(10, 30, {
  class: "selected-block",
  style: "background-color: lightblue",
});

// Mark a code block with an error
const errorDecoration = Decoration.node(50, 100, {
  class: "error-block",
  "data-error": "Syntax error on line 3",
});
```

---

### widget()

```ts
static widget(
   pos,
   toDOM,
   spec?): Decoration;
```

Defined in: [decoration/Decoration.ts:162](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/decoration/src/decoration/Decoration.ts#L162)

Creates a widget decoration, which is a DOM node that's shown in
the document at the given position. It is recommended that you
delay rendering the widget by passing a function that will be
called when the widget is actually drawn in a view, but you can
also directly pass a DOM node. `getPos` can be used to find the
widget's current document position.

Widget decorations are useful for adding inline UI elements like
buttons, icons, mention suggestions, or other interactive components
that don't correspond to actual document content.

#### Parameters

| Parameter | Type                                                                                                 | Description                                                                                                                                                                                                                                                                                                                                                                                           |
| --------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pos`     | `number`                                                                                             | The position in the document where the widget should appear                                                                                                                                                                                                                                                                                                                                           |
| `toDOM`   | [`WidgetConstructor`](../../../types/decoration/WidgetConstructor/type-aliases/WidgetConstructor.md) | A function that creates the DOM node for this widget, or a DOM node directly. The function receives the editor view and a getPos function that returns the widget's current position.                                                                                                                                                                                                                 |
| `spec?`   | `DecorationWidgetOptions`                                                                            | Optional configuration: - `side`: Number indicating whether widget should appear before (-1), at (0), or after (1) the position - `stopEvent`: Function to prevent certain events from bubbling out of the widget - `ignoreSelection`: If true, selection near the widget won't be drawn - `key`: Unique key for widget comparison and reuse - `destroy`: Callback invoked when the widget is removed |

#### Returns

`Decoration`

A new widget decoration

#### Example

```typescript
// Create a button widget
const widget = Decoration.widget(
  10,
  (view, getPos) => {
    const button = document.createElement("button");
    button.textContent = "Insert";
    button.onclick = () => {
      const pos = getPos();
      // Insert content at position
    };
    return button;
  },
  { side: 1 },
);
```

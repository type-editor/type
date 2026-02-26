[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/viewdesc](../../README.md) / [ViewDescFactory](../README.md) / ViewDescFactory

# Class: ViewDescFactory

Defined in: [ViewDescFactory.ts:21](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDescFactory.ts#L21)

## Constructors

### Constructor

```ts
new ViewDescFactory(): ViewDescFactory;
```

#### Returns

`ViewDescFactory`

## Methods

### createCompositionViewDesc()

```ts
static createCompositionViewDesc(
   parent,
   dom,
   textDOM,
   text): CompositionViewDesc;
```

Defined in: [ViewDescFactory.ts:142](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDescFactory.ts#L142)

Creates a new CompositionViewDesc.

#### Parameters

| Parameter | Type                                             | Description                                              |
| --------- | ------------------------------------------------ | -------------------------------------------------------- |
| `parent`  | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md) | The parent view description in the tree hierarchy        |
| `dom`     | `Node`                                           | The outer DOM node containing the composition            |
| `textDOM` | `Text`                                           | The text node containing the composed (uncommitted) text |
| `text`    | `string`                                         | The current composed text content                        |

#### Returns

[`CompositionViewDesc`](../../CompositionViewDesc/classes/CompositionViewDesc.md)

---

### createMarkViewDesc()

```ts
static createMarkViewDesc(
   parent,
   mark,
   inline,
   view): MarkViewDesc;
```

Defined in: [ViewDescFactory.ts:81](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDescFactory.ts#L81)

Creates a mark view description, using custom mark views if available.

#### Parameters

| Parameter | Type                                             | Description                           |
| --------- | ------------------------------------------------ | ------------------------------------- |
| `parent`  | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md) | The parent view description           |
| `mark`    | `Mark`                                           | The mark to create a view for         |
| `inline`  | `boolean`                                        | Whether the mark is in inline content |
| `view`    | `PmEditorView`                                   | The editor view                       |

#### Returns

[`MarkViewDesc`](../../MarkViewDesc/classes/MarkViewDesc.md)

A new MarkViewDesc instance

---

### createNodeViewDesc()

```ts
static createNodeViewDesc(
   parent,
   node,
   outerDeco,
   innerDeco,
   view,
   pos): NodeViewDesc;
```

Defined in: [ViewDescFactory.ts:43](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDescFactory.ts#L43)

Creates a node view description with optional custom view support.

By default, nodes are rendered using the `toDOM` method from their type spec.
Custom node views can be provided via the `nodeViews` option to override
rendering and behavior.

The factory handles three scenarios:

1. Custom node view (returns CustomNodeViewDesc)
2. Text node (returns TextViewDesc)
3. Standard node (returns NodeViewDesc)

#### Parameters

| Parameter   | Type                                             | Description                               |
| ----------- | ------------------------------------------------ | ----------------------------------------- |
| `parent`    | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md) | The parent view description               |
| `node`      | `Node_2`                                         | The ProseMirror node to create a view for |
| `outerDeco` | readonly `PmDecoration`[]                        | Decorations wrapping this node            |
| `innerDeco` | `DecorationSource`                               | Decorations inside this node              |
| `view`      | `PmEditorView`                                   | The editor view                           |
| `pos`       | `number`                                         | The document position of the node         |

#### Returns

[`NodeViewDesc`](../../NodeViewDesc/classes/NodeViewDesc.md)

A NodeViewDesc or specialized subclass

---

### createTrailingHackViewDesc()

```ts
static createTrailingHackViewDesc(
   parent,
   children,
   dom,
   contentDOM): TrailingHackViewDesc;
```

Defined in: [ViewDescFactory.ts:111](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDescFactory.ts#L111)

Creates a new TrailingHackViewDesc.

#### Parameters

| Parameter    | Type                                               | Description                                                                              |
| ------------ | -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `parent`     | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)   | The parent ViewDesc in the tree hierarchy                                                |
| `children`   | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md)[] | Array of child ViewDesc instances                                                        |
| `dom`        | `Node`                                             | The DOM node this description wraps                                                      |
| `contentDOM` | `HTMLElement`                                      | The DOM node that holds the child views. May be null for descs that don't have children. |

#### Returns

[`TrailingHackViewDesc`](../../TrailingHackViewDesc/classes/TrailingHackViewDesc.md)

---

### createWidgetViewDesc()

```ts
static createWidgetViewDesc(
   parent,
   widget,
   view,
   pos): WidgetViewDesc;
```

Defined in: [ViewDescFactory.ts:127](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/viewdesc/src/view-desc/ViewDescFactory.ts#L127)

Creates a new WidgetViewDesc.

#### Parameters

| Parameter | Type                                             | Description                                       |
| --------- | ------------------------------------------------ | ------------------------------------------------- |
| `parent`  | [`ViewDesc`](../../ViewDesc/classes/ViewDesc.md) | The parent view description in the tree hierarchy |
| `widget`  | `PmDecoration`                                   | The widget decoration to render                   |
| `view`    | `PmEditorView`                                   | The editor view that owns this widget             |
| `pos`     | `number`                                         | The document position where this widget appears   |

#### Returns

[`WidgetViewDesc`](../../WidgetViewDesc/classes/WidgetViewDesc.md)

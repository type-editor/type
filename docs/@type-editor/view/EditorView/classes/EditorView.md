[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/view](../../README.md) / [EditorView](../README.md) / EditorView

# Class: EditorView

Defined in: [EditorView.ts:68](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L68)

An editor view manages the DOM structure that represents an
editable document. Its state and behavior are determined by its
[props](#view.DirectEditorProps).

The view is responsible for:

- Rendering the document state as DOM elements
- Handling user input and converting it to transactions
- Managing selections and keeping them in sync with the DOM
- Coordinating plugin views and custom node views
- Observing external DOM changes (composition, spellcheck, etc.)

## Implements

- `PmEditorView`

## Constructors

### Constructor

```ts
new EditorView(editorContainer, props): EditorView;
```

Defined in: [EditorView.ts:200](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L200)

Create a view. `place` may be a DOM node that the editor should
be appended to, a function that will place it into the document,
or an object whose `mount` property holds the node to use as the
document container. If it is `null`, the editor will not be
added to the document.

#### Parameters

| Parameter         | Type                                                               | Description                                                                                                                                                                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `editorContainer` | \| `Node` \| \{ `mount`: `HTMLElement`; \} \| (`editor`) => `void` | The placement configuration for the editor DOM element. Can be: - A DOM node to append the editor to - A function that receives the editor element and places it in the document - An object with a `mount` property containing an existing element to use - `null` to create the editor without mounting it |
| `props`           | `DirectEditorProps`                                                | The editor properties including initial state and configuration                                                                                                                                                                                                                                              |

#### Returns

`EditorView`

#### Example

```typescript
// Append to a DOM element
const view = new EditorView(document.querySelector("#editor"), {
  state: EditorState.create({ schema }),
});

// Use a custom mounting function
const view = new EditorView(
  (editorElement) => {
    document.body.appendChild(editorElement);
  },
  { state },
);

// Reuse an existing element
const view = new EditorView(
  { mount: document.querySelector("#editor") },
  { state },
);
```

## Accessors

### composing

#### Get Signature

```ts
get composing(): boolean;
```

Defined in: [EditorView.ts:466](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L466)

Holds `true` when a
[composition](https://w3c.github.io/uievents/#events-compositionevents)
is active.

##### Returns

`boolean`

#### Implementation of

```ts
PmEditorView.composing;
```

---

### cursorWrapper

#### Get Signature

```ts
get cursorWrapper(): {
  deco: PmDecoration;
  dom: Node;
};
```

Defined in: [EditorView.ts:361](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L361)

The cursor wrapper widget decoration used to display stored marks
when the cursor is at a position with no text.

##### Returns

```ts
{
  deco: PmDecoration;
  dom: Node;
}
```

| Name   | Type           | Defined in                                                                                                                                  |
| ------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `deco` | `PmDecoration` | [EditorView.ts:361](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L361) |
| `dom`  | `Node`         | [EditorView.ts:361](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L361) |

#### Implementation of

```ts
PmEditorView.cursorWrapper;
```

---

### docView

#### Get Signature

```ts
get docView(): NodeViewDesc;
```

Defined in: [EditorView.ts:376](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L376)

The document view descriptor, representing the entire document's
DOM structure.

##### Returns

`NodeViewDesc`

#### Implementation of

```ts
PmEditorView.docView;
```

---

### dom

#### Get Signature

```ts
get dom(): HTMLElement;
```

Defined in: [EditorView.ts:427](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L427)

The editor's DOM node. This is the element that should be placed
in the document.

##### Returns

`HTMLElement`

#### Implementation of

```ts
PmEditorView.dom;
```

---

### domObserver

#### Get Signature

```ts
get domObserver(): DOMObserver;
```

Defined in: [EditorView.ts:450](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L450)

**`Internal`**

The DOM observer that watches for external changes to the editor DOM.

##### Returns

[`DOMObserver`](../../dom-observer/DOMObserver/classes/DOMObserver.md)

#### Implementation of

```ts
PmEditorView.domObserver;
```

---

### dragging

#### Get Signature

```ts
get dragging(): Dragging;
```

Defined in: [EditorView.ts:411](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L411)

When editor content is being dragged, this contains information
about the dragged slice and whether it is being copied or moved.
At any other time, it is null.

##### Returns

`Dragging`

#### Set Signature

```ts
set dragging(dragging): void;
```

Defined in: [EditorView.ts:419](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L419)

Sets the current dragging state.

##### Parameters

| Parameter  | Type       | Description                             |
| ---------- | ---------- | --------------------------------------- |
| `dragging` | `Dragging` | The dragging state, or null to clear it |

##### Returns

`void`

#### Implementation of

```ts
PmEditorView.dragging;
```

---

### editable

#### Get Signature

```ts
get editable(): boolean;
```

Defined in: [EditorView.ts:434](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L434)

Indicates whether the editor is currently editable.

##### Returns

`boolean`

#### Implementation of

```ts
PmEditorView.editable;
```

---

### focused

#### Get Signature

```ts
get focused(): boolean;
```

Defined in: [EditorView.ts:328](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L328)

**`Internal`**

Indicates whether the view currently has focus.

##### Returns

`boolean`

#### Set Signature

```ts
set focused(focused): void;
```

Defined in: [EditorView.ts:337](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L337)

**`Internal`**

Sets the focused state of the view.

##### Parameters

| Parameter | Type      | Description                                   |
| --------- | --------- | --------------------------------------------- |
| `focused` | `boolean` | Whether the view should be considered focused |

##### Returns

`void`

#### Implementation of

```ts
PmEditorView.focused;
```

---

### input

#### Get Signature

```ts
get input(): InputState;
```

Defined in: [EditorView.ts:442](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L442)

**`Internal`**

The input state handler, managing keyboard and mouse input.

##### Returns

`InputState`

#### Implementation of

```ts
PmEditorView.input;
```

---

### isDestroyed

#### Get Signature

```ts
get isDestroyed(): boolean;
```

Defined in: [EditorView.ts:475](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L475)

This is true when the view has been
[destroyed](#view.EditorView.destroy) (and thus should not be
used anymore).

##### Returns

`boolean`

#### Implementation of

```ts
PmEditorView.isDestroyed;
```

---

### lastSelectedViewDesc

#### Get Signature

```ts
get lastSelectedViewDesc(): ViewDesc;
```

Defined in: [EditorView.ts:384](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L384)

**`Internal`**

The view descriptor that was last selected (for internal use).

##### Returns

`ViewDesc`

#### Set Signature

```ts
set lastSelectedViewDesc(lastSelectedViewDesc): void;
```

Defined in: [EditorView.ts:393](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L393)

**`Internal`**

Sets the last selected view descriptor.

##### Parameters

| Parameter              | Type       | Description                         |
| ---------------------- | ---------- | ----------------------------------- |
| `lastSelectedViewDesc` | `ViewDesc` | The view descriptor to set, or null |

##### Returns

`void`

#### Implementation of

```ts
PmEditorView.lastSelectedViewDesc;
```

---

### markCursor

#### Get Signature

```ts
get markCursor(): readonly Mark[];
```

Defined in: [EditorView.ts:345](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L345)

The marks that should be applied to the next input. This is used
to represent stored marks in a zero-width position.

##### Returns

readonly `Mark`[]

#### Set Signature

```ts
set markCursor(markCursor): void;
```

Defined in: [EditorView.ts:353](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L353)

Sets the marks to be applied to the next input.

##### Parameters

| Parameter    | Type              | Description             |
| ------------ | ----------------- | ----------------------- |
| `markCursor` | readonly `Mark`[] | Array of marks to apply |

##### Returns

`void`

#### Implementation of

```ts
PmEditorView.markCursor;
```

---

### nodeViews

#### Get Signature

```ts
get nodeViews(): Readonly<NodeViewSet>;
```

Defined in: [EditorView.ts:368](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L368)

The set of node and mark view constructors currently in use.

##### Returns

`Readonly`&lt;`NodeViewSet`&gt;

#### Implementation of

```ts
PmEditorView.nodeViews;
```

---

### props

#### Get Signature

```ts
get props(): Readonly<DirectEditorProps>;
```

Defined in: [EditorView.ts:275](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L275)

The view's current [props](#view.EditorProps).
Returns a frozen copy of the props with the current state.

##### Returns

`Readonly`&lt;`DirectEditorProps`&gt;

#### Implementation of

```ts
PmEditorView.props;
```

---

### root

#### Get Signature

```ts
get root(): Document | ShadowRoot;
```

Defined in: [EditorView.ts:294](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L294)

Get the document root in which the editor exists. This will
usually be the top-level `document`, but might be a [shadow
DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
root if the editor is inside one.

##### Returns

`Document` \| `ShadowRoot`

#### Implementation of

```ts
PmEditorView.root;
```

---

### state

#### Get Signature

```ts
get state(): EditorState;
```

Defined in: [EditorView.ts:457](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L457)

The view's current editor state.

##### Returns

`EditorState`

#### Implementation of

```ts
PmEditorView.state;
```

---

### trackWrites

#### Get Signature

```ts
get trackWrites(): Node;
```

Defined in: [EditorView.ts:402](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L402)

**`Internal`**

Used to work around a Chrome selection bug. Tracks a DOM node to
detect if it gets removed during updates.

##### Returns

`Node`

#### Implementation of

```ts
PmEditorView.trackWrites;
```

## Methods

### addPlugin()

```ts
addPlugin(plugin): void;
```

Defined in: [EditorView.ts:547](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L547)

Dynamically adds a plugin to the editor view. The plugin must not have
state components (state, filterTransaction, or appendTransaction) - such
plugins must be added to the EditorState instead.

If the plugin has a view specification, its view will be immediately
created and added to the active plugin views.

#### Parameters

| Parameter | Type       | Description                   |
| --------- | ---------- | ----------------------------- |
| `plugin`  | `PmPlugin` | The plugin to add to the view |

#### Returns

`void`

#### Throws

If the plugin has state components

#### Example

```typescript
// Add a plugin dynamically
const myPlugin = new Plugin({ view: () => ({ update: (view) => {} }) });
view.addPlugin(myPlugin);
```

#### Implementation of

```ts
PmEditorView.addPlugin;
```

---

### clearTrackWrites()

```ts
clearTrackWrites(): void;
```

Defined in: [EditorView.ts:562](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L562)

**`Internal`**

Clears the tracked writes node.

#### Returns

`void`

#### Implementation of

```ts
PmEditorView.clearTrackWrites;
```

---

### coordsAtPos()

```ts
coordsAtPos(pos, side?): {
  bottom: number;
  left: number;
  right: number;
  top: number;
};
```

Defined in: [EditorView.ts:856](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L856)

Returns the viewport rectangle at a given document position.
`left` and `right` will be the same number, as this returns a
flat cursor-ish rectangle. If the position is between two things
that aren't directly adjacent, `side` determines which element
is used. When \< 0, the element before the position is used,
otherwise the element after.

#### Parameters

| Parameter | Type     | Default value | Description                                                         |
| --------- | -------- | ------------- | ------------------------------------------------------------------- |
| `pos`     | `number` | `undefined`   | The document position                                               |
| `side`    | `number` | `1`           | Which side to prefer: \< 0 for before, \>= 0 for after (default: 1) |

#### Returns

```ts
{
  bottom: number;
  left: number;
  right: number;
  top: number;
}
```

An object with left, right, top, and bottom properties

| Name     | Type     | Defined in                                                                                                                                  |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `bottom` | `number` | [EditorView.ts:856](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L856) |
| `left`   | `number` | [EditorView.ts:856](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L856) |
| `right`  | `number` | [EditorView.ts:856](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L856) |
| `top`    | `number` | [EditorView.ts:856](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L856) |

#### Example

```typescript
// Get the screen coordinates of the cursor
const coords = view.coordsAtPos(view.state.selection.head);
console.log("Cursor is at:", coords.left, coords.top);

// Position a tooltip at a specific document position
const rect = view.coordsAtPos(pos);
tooltip.style.left = rect.left + "px";
tooltip.style.top = rect.bottom + "px";
```

#### Implementation of

```ts
PmEditorView.coordsAtPos;
```

---

### destroy()

```ts
destroy(): void;
```

Defined in: [EditorView.ts:990](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L990)

Removes the editor from the DOM and destroys all [node
views](#view.NodeView). After calling this method, the view
should not be used anymore.

#### Returns

`void`

#### Example

```typescript
// Clean up when unmounting a component
componentWillUnmount() {
  if (this.view) {
    this.view.destroy();
  }
}
```

#### Implementation of

```ts
PmEditorView.destroy;
```

---

### dispatch()

```ts
dispatch(transaction): void;
```

Defined in: [EditorView.ts:1085](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L1085)

Dispatch a transaction. Will call
[`dispatchTransaction`](#view.DirectEditorProps.dispatchTransaction)
when given, and otherwise defaults to applying the transaction to
the current state and calling
[`updateState`](#view.EditorView.updateState) with the result.
This method is bound to the view instance, so that it can be
easily passed around.

#### Parameters

| Parameter     | Type          | Description                 |
| ------------- | ------------- | --------------------------- |
| `transaction` | `Transaction` | The transaction to dispatch |

#### Returns

`void`

#### Example

```typescript
// Insert text at the current selection
const transaction = view.state.transaction.insertText("Hello");
view.dispatch(transaction);

// Delete the current selection
view.dispatch(view.state.transaction.deleteSelection());
```

#### Implementation of

```ts
PmEditorView.dispatch;
```

---

### dispatchEvent()

```ts
dispatchEvent(event): void;
```

Defined in: [EditorView.ts:1023](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L1023)

Used for testing. Dispatches a DOM event to the input state handler.

#### Parameters

| Parameter | Type    | Description               |
| --------- | ------- | ------------------------- |
| `event`   | `Event` | The DOM event to dispatch |

#### Returns

`void`

#### Implementation of

```ts
PmEditorView.dispatchEvent;
```

---

### domAtPos()

```ts
domAtPos(pos, side?): {
  node: Node;
  offset: number;
};
```

Defined in: [EditorView.ts:874](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L874)

Find the DOM position that corresponds to the given document
position. When `side` is negative, find the position as close as
possible to the content before the position. When positive,
prefer positions close to the content after the position. When
zero, prefer as shallow a position as possible.

Note that you should **not** mutate the editor's internal DOM,
only inspect it (and even that is usually not necessary).

#### Parameters

| Parameter | Type     | Default value | Description                                                                          |
| --------- | -------- | ------------- | ------------------------------------------------------------------------------------ |
| `pos`     | `number` | `undefined`   | The document position                                                                |
| `side`    | `number` | `0`           | Side preference: negative for before, positive for after, 0 for shallow (default: 0) |

#### Returns

```ts
{
  node: Node;
  offset: number;
}
```

An object with the DOM node and offset

| Name     | Type     | Defined in                                                                                                                                  |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `node`   | `Node`   | [EditorView.ts:874](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L874) |
| `offset` | `number` | [EditorView.ts:874](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L874) |

#### Implementation of

```ts
PmEditorView.domAtPos;
```

---

### domSelection()

```ts
domSelection(): Selection;
```

Defined in: [EditorView.ts:1060](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L1060)

Gets the current DOM selection object.

#### Returns

`Selection`

The DOM selection object, or null if not available

#### Implementation of

```ts
PmEditorView.domSelection;
```

---

### domSelectionRange()

```ts
domSelectionRange(): DOMSelectionRange;
```

Defined in: [EditorView.ts:1032](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L1032)

Gets the current DOM selection range, with workarounds for Safari shadow DOM.

#### Returns

`DOMSelectionRange`

The DOM selection range with focus and anchor information

#### Implementation of

```ts
PmEditorView.domSelectionRange;
```

---

### endOfTextblock()

```ts
endOfTextblock(dir, state?): boolean;
```

Defined in: [EditorView.ts:932](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L932)

Find out whether the selection is at the end of a textblock when
moving in a given direction. When, for example, given `'left'`,
it will return true if moving left from the current cursor
position would leave that position's parent textblock. Will apply
to the view's current state by default, but it is possible to
pass a different state.

#### Parameters

| Parameter | Type                                                                       | Description                                                                     |
| --------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `dir`     | `"up"` \| `"down"` \| `"left"` \| `"right"` \| `"forward"` \| `"backward"` | The direction to check: 'up', 'down', 'left', 'right', 'forward', or 'backward' |
| `state?`  | `EditorState`                                                              | The editor state to use (defaults to current state)                             |

#### Returns

`boolean`

true if at the end of a textblock in the given direction

#### Implementation of

```ts
PmEditorView.endOfTextblock;
```

---

### focus()

```ts
focus(): void;
```

Defined in: [EditorView.ts:788](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L788)

Focus the editor.

#### Returns

`void`

#### Example

```typescript
// Focus the editor after initialization
view.focus();

// Focus and set selection
view.focus();
view.dispatch(
  view.state.tr.setSelection(TextSelection.create(view.state.doc, pos)),
);
```

#### Implementation of

```ts
PmEditorView.focus;
```

---

### hasFocus()

```ts
hasFocus(): boolean;
```

Defined in: [EditorView.ts:752](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L752)

Query whether the view has focus.

#### Returns

`boolean`

true if the editor view has focus, false otherwise

#### Example

```typescript
// Only update something if the editor has focus
if (view.hasFocus()) {
  // Perform focus-dependent action
}
```

#### Implementation of

```ts
PmEditorView.hasFocus;
```

---

### nodeDOM()

```ts
nodeDOM(pos): Node;
```

Defined in: [EditorView.ts:891](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L891)

Find the DOM node that represents the document node after the
given position. May return `null` when the position doesn't point
in front of a node or if the node is inside an opaque node view.

This is intended to be able to call things like
`getBoundingClientRect` on that DOM node. Do **not** mutate the
editor DOM directly, or add styling this way, since that will be
immediately overriden by the editor as it redraws the node.

#### Parameters

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `pos`     | `number` | The document position |

#### Returns

`Node`

The DOM node at the position, or null if not found or inside opaque view

#### Implementation of

```ts
PmEditorView.nodeDOM;
```

---

### pasteHTML()

```ts
pasteHTML(html, event?): boolean;
```

Defined in: [EditorView.ts:945](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L945)

Run the editor's paste logic with the given HTML string. The
`event`, if given, will be passed to the
[`handlePaste`](#view.EditorProps.handlePaste) hook.

#### Parameters

| Parameter | Type             | Description                                  |
| --------- | ---------------- | -------------------------------------------- |
| `html`    | `string`         | The HTML string to paste                     |
| `event?`  | `ClipboardEvent` | Optional clipboard event to pass to handlers |

#### Returns

`boolean`

true if the paste was handled

#### Implementation of

```ts
PmEditorView.pasteHTML;
```

---

### pasteText()

```ts
pasteText(text, event?): boolean;
```

Defined in: [EditorView.ts:956](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L956)

Run the editor's paste logic with the given plain-text input.

#### Parameters

| Parameter | Type             | Description                                  |
| --------- | ---------------- | -------------------------------------------- |
| `text`    | `string`         | The plain text string to paste               |
| `event?`  | `ClipboardEvent` | Optional clipboard event to pass to handlers |

#### Returns

`boolean`

true if the paste was handled

#### Implementation of

```ts
PmEditorView.pasteText;
```

---

### posAtCoords()

```ts
posAtCoords(coords): {
  inside: number;
  pos: number;
};
```

Defined in: [EditorView.ts:828](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L828)

Given a pair of viewport coordinates, return the document
position that corresponds to them. May return null if the given
coordinates aren't inside the editor. When an object is
returned, its `pos` property is the position nearest to the
coordinates, and its `inside` property holds the position of the
inner node that the position falls inside, or -1 if it is at
the top level, not in any node.

#### Parameters

| Parameter     | Type                                     | Description                                           |
| ------------- | ---------------------------------------- | ----------------------------------------------------- |
| `coords`      | \{ `left`: `number`; `top`: `number`; \} | The viewport coordinates with left and top properties |
| `coords.left` | `number`                                 | -                                                     |
| `coords.top`  | `number`                                 | -                                                     |

#### Returns

```ts
{
  inside: number;
  pos: number;
}
```

An object with pos and inside properties, or null if outside editor

| Name     | Type     | Defined in                                                                                                                                  |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `inside` | `number` | [EditorView.ts:828](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L828) |
| `pos`    | `number` | [EditorView.ts:828](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L828) |

#### Example

```typescript
// Get document position from a mouse click
editor.addEventListener("click", (event) => {
  const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
  if (pos) {
    console.log("Clicked at document position:", pos.pos);
  }
});
```

#### Implementation of

```ts
PmEditorView.posAtCoords;
```

---

### posAtDOM()

```ts
posAtDOM(
   node,
   offset,
   bias?): number;
```

Defined in: [EditorView.ts:912](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L912)

Find the document position that corresponds to a given DOM
position. (Whenever possible, it is preferable to inspect the
document structure directly, rather than poking around in the
DOM, but sometimes—for example when interpreting an event
target—you don't have a choice.)

The `bias` parameter can be used to influence which side of a DOM
node to use when the position is inside a leaf node.

#### Parameters

| Parameter | Type     | Default value | Description                                                                  |
| --------- | -------- | ------------- | ---------------------------------------------------------------------------- |
| `node`    | `Node`   | `undefined`   | The DOM node                                                                 |
| `offset`  | `number` | `undefined`   | The offset within the node                                                   |
| `bias`    | `number` | `-1`          | Side bias for leaf nodes: negative for start, positive for end (default: -1) |

#### Returns

`number`

The document position

#### Throws

If the DOM position is not inside the editor

#### Implementation of

```ts
PmEditorView.posAtDOM;
```

---

### scrollToSelection()

```ts
scrollToSelection(): void;
```

Defined in: [EditorView.ts:639](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L639)

Scrolls the current selection into view if it's not already visible.

#### Returns

`void`

#### Implementation of

```ts
PmEditorView.scrollToSelection;
```

---

### serializeForClipboard()

```ts
serializeForClipboard(slice): {
  dom: HTMLElement;
  slice: Slice;
  text: string;
};
```

Defined in: [EditorView.ts:971](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L971)

Serialize the given slice as it would be if it was copied from
this editor. Returns a DOM element that contains a
representation of the slice as its children, a textual
representation, and the transformed slice (which can be
different from the given input due to hooks like
[`transformCopied`](#view.EditorProps.transformCopied)).

#### Parameters

| Parameter | Type    | Description                    |
| --------- | ------- | ------------------------------ |
| `slice`   | `Slice` | The content slice to serialize |

#### Returns

```ts
{
  dom: HTMLElement;
  slice: Slice;
  text: string;
}
```

An object containing the DOM representation, text, and transformed slice

| Name    | Type          | Defined in                                                                                                                                  |
| ------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `dom`   | `HTMLElement` | [EditorView.ts:971](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L971) |
| `slice` | `Slice`       | [EditorView.ts:971](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L971) |
| `text`  | `string`      | [EditorView.ts:971](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L971) |

#### Implementation of

```ts
PmEditorView.serializeForClipboard;
```

---

### setProps()

```ts
setProps(props): void;
```

Defined in: [EditorView.ts:610](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L610)

Update the view by updating existing props object with the object
given as argument. Equivalent to `view.update(Object.assign({},
view.props, props))`.

#### Parameters

| Parameter | Type                                 | Description                                |
| --------- | ------------------------------------ | ------------------------------------------ |
| `props`   | `Partial`&lt;`DirectEditorProps`&gt; | Partial props to merge with existing props |

#### Returns

`void`

#### Implementation of

```ts
PmEditorView.setProps;
```

---

### someProp()

#### Call Signature

```ts
someProp<PropName, Result>(propName, callbackFunc): Result;
```

Defined in: [EditorView.ts:688](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L688)

Goes over the values of a prop, first those provided directly,
then those from plugins given to the view, then from plugins in
the state (in order), and calls the callback function every time
a non-undefined value is found. When the callback returns a truthy
value, that is immediately returned. When callback isn't provided,
it is treated as the identity function (the prop value is returned directly).

##### Type Parameters

| Type Parameter                                        |
| ----------------------------------------------------- |
| `PropName` _extends_ keyof `EditorProps`&lt;`any`&gt; |
| `Result`                                              |

##### Parameters

| Parameter      | Type                  | Description                                 |
| -------------- | --------------------- | ------------------------------------------- |
| `propName`     | `PropName`            | The name of the prop to search for          |
| `callbackFunc` | (`value`) => `Result` | Optional callback to process the prop value |

##### Returns

`Result`

The result from the callback, the prop value, or undefined

##### Example

```typescript
// Check if any plugin handles a specific key
const handled = view.someProp("handleKeyDown", (handler) => {
  return handler(view, event);
});

// Get the first defined decorations prop
const decos = view.someProp("decorations");
```

##### Implementation of

```ts
PmEditorView.someProp;
```

#### Call Signature

```ts
someProp<PropName>(propName): NonNullable<EditorProps<any>[PropName]>;
```

Defined in: [EditorView.ts:693](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L693)

Goes over the values of a prop, first those provided directly,
then those from plugins given to the view, then from plugins in
the state (in order), and calls the callback function every time
a non-undefined value is found. When the callback returns a truthy
value, that is immediately returned. When callback isn't provided,
it is treated as the identity function (the prop value is returned directly).

##### Type Parameters

| Type Parameter                                        |
| ----------------------------------------------------- |
| `PropName` _extends_ keyof `EditorProps`&lt;`any`&gt; |

##### Parameters

| Parameter  | Type       | Description                        |
| ---------- | ---------- | ---------------------------------- |
| `propName` | `PropName` | The name of the prop to search for |

##### Returns

`NonNullable`&lt;`EditorProps`&lt;`any`&gt;\[`PropName`\]&gt;

The result from the callback, the prop value, or undefined

##### Example

```typescript
// Check if any plugin handles a specific key
const handled = view.someProp("handleKeyDown", (handler) => {
  return handler(view, event);
});

// Get the first defined decorations prop
const decos = view.someProp("decorations");
```

##### Implementation of

```ts
PmEditorView.someProp;
```

---

### toHtml()

```ts
toHtml(): string;
```

Defined in: [EditorView.ts:512](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L512)

Converts the editor content to an HTML string with ProseMirror-specific
classes removed. This provides a clean HTML representation suitable for
export or display outside the editor context.

#### Returns

`string`

The editor's HTML content without ProseMirror classes

#### Example

```typescript
// Get clean HTML for export
const html = view.toHtml();
// Use the HTML in another context
document.getElementById("preview").innerHTML = html;
```

#### Implementation of

```ts
PmEditorView.toHtml;
```

---

### toJSON()

```ts
toJSON(pluginFields?): string;
```

Defined in: [EditorView.ts:493](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L493)

Serializes the current editor state to a JSON string.
This can be used to save the editor content and state for persistence.

#### Parameters

| Parameter       | Type                                                   | Description                                                       |
| --------------- | ------------------------------------------------------ | ----------------------------------------------------------------- |
| `pluginFields?` | `Readonly`&lt;`Record`&lt;`string`, `PmPlugin`&gt;&gt; | Optional mapping of plugin fields to include in the serialization |

#### Returns

`string`

A JSON string representation of the editor state

#### Example

```typescript
// Serialize the current state
const json = view.toJSON();
localStorage.setItem("editorState", json);
```

#### Implementation of

```ts
PmEditorView.toJSON;
```

---

### update()

```ts
update(props): void;
```

Defined in: [EditorView.ts:582](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L582)

Update the view's props. Will immediately cause an update to
the DOM.

#### Parameters

| Parameter | Type                | Description                        |
| --------- | ------------------- | ---------------------------------- |
| `props`   | `DirectEditorProps` | The new props to apply to the view |

#### Returns

`void`

#### Example

```typescript
// Update with a new state
view.update({
  state: newState,
  plugins: [myPlugin],
  editable: () => true,
});
```

#### Implementation of

```ts
PmEditorView.update;
```

---

### updateRoot()

```ts
updateRoot(): void;
```

Defined in: [EditorView.ts:801](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L801)

When an existing editor view is moved to a new document or
shadow tree, call this to make it recompute its root.

#### Returns

`void`

#### Implementation of

```ts
PmEditorView.updateRoot;
```

---

### updateState()

```ts
updateState(state): void;
```

Defined in: [EditorView.ts:632](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L632)

Update the editor's `state` prop, without touching any of the
other props.

#### Parameters

| Parameter | Type            | Description                   |
| --------- | --------------- | ----------------------------- |
| `state`   | `PmEditorState` | The new editor state to apply |

#### Returns

`void`

#### Example

```typescript
// Apply a transaction and update the view
const newState = view.state.apply(tr);
view.updateState(newState);
```

#### Implementation of

```ts
PmEditorView.updateState;
```

---

### fromHTML()

```ts
static fromHTML(
   editorContainer,
   schema,
   docHTML,
   plugins?,
   nodeViews?,
   markViews?): EditorView;
```

Defined in: [EditorView.ts:246](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L246)

#### Parameters

| Parameter         | Type                                                               |
| ----------------- | ------------------------------------------------------------------ |
| `editorContainer` | \| `Node` \| \{ `mount`: `HTMLElement`; \} \| (`editor`) => `void` |
| `schema`          | `Schema`                                                           |
| `docHTML`         | `string` \| `HTMLElement`                                          |
| `plugins?`        | readonly `PmPlugin`&lt;`any`&gt;[]                                 |
| `nodeViews?`      | `Record`&lt;`string`, `NodeViewConstructor`&gt;                    |
| `markViews?`      | `Record`&lt;`string`, `MarkViewConstructor`&gt;                    |

#### Returns

`EditorView`

---

### fromJSON()

```ts
static fromJSON(
   editorContainer,
   schema,
   docJSON,
   plugins?,
   nodeViews?,
   markViews?): EditorView;
```

Defined in: [EditorView.ts:236](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/view/src/EditorView.ts#L236)

#### Parameters

| Parameter         | Type                                                               |
| ----------------- | ------------------------------------------------------------------ |
| `editorContainer` | \| `Node` \| \{ `mount`: `HTMLElement`; \} \| (`editor`) => `void` |
| `schema`          | `Schema`                                                           |
| `docJSON`         | `StateJSON`                                                        |
| `plugins?`        | readonly `PmPlugin`&lt;`any`&gt;[]                                 |
| `nodeViews?`      | `Record`&lt;`string`, `NodeViewConstructor`&gt;                    |
| `markViews?`      | `Record`&lt;`string`, `MarkViewConstructor`&gt;                    |

#### Returns

`EditorView`

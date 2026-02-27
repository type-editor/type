[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/editor-types](../../../../README.md) / [types/view/PmEditorView](../README.md) / PmEditorView

# Interface: PmEditorView

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:15](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L15)

## Properties

| Property                                                          | Modifier   | Type                                                                                                         | Defined in                                                                                                                                                                                            |
| ----------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-composing"></a> `composing`                       | `readonly` | `boolean`                                                                                                    | [packages/editor-types/src/types/view/PmEditorView.ts:32](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L32) |
| <a id="property-cursorwrapper"></a> `cursorWrapper`               | `readonly` | \{ `deco`: [`PmDecoration`](../../decoration/PmDecoration/interfaces/PmDecoration.md); `dom`: `Node`; \}     | [packages/editor-types/src/types/view/PmEditorView.ts:21](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L21) |
| `cursorWrapper.deco`                                              | `public`   | [`PmDecoration`](../../decoration/PmDecoration/interfaces/PmDecoration.md)                                   | [packages/editor-types/src/types/view/PmEditorView.ts:21](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L21) |
| `cursorWrapper.dom`                                               | `public`   | `Node`                                                                                                       | [packages/editor-types/src/types/view/PmEditorView.ts:21](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L21) |
| <a id="property-docview"></a> `docView`                           | `readonly` | [`PmNodeViewDesc`](../../view-desc/PmNodeViewDesc/interfaces/PmNodeViewDesc.md)                              | [packages/editor-types/src/types/view/PmEditorView.ts:23](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L23) |
| <a id="property-dom"></a> `dom`                                   | `readonly` | `HTMLElement`                                                                                                | [packages/editor-types/src/types/view/PmEditorView.ts:27](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L27) |
| <a id="property-domobserver"></a> `domObserver`                   | `readonly` | [`PmDOMObserver`](../../PmDOMObserver/interfaces/PmDOMObserver.md)                                           | [packages/editor-types/src/types/view/PmEditorView.ts:30](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L30) |
| <a id="property-dragging"></a> `dragging`                         | `public`   | [`PmDragging`](../../input-handler/PmDragging/interfaces/PmDragging.md)                                      | [packages/editor-types/src/types/view/PmEditorView.ts:26](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L26) |
| <a id="property-editable"></a> `editable`                         | `readonly` | `boolean`                                                                                                    | [packages/editor-types/src/types/view/PmEditorView.ts:28](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L28) |
| <a id="property-focused"></a> `focused`                           | `public`   | `boolean`                                                                                                    | [packages/editor-types/src/types/view/PmEditorView.ts:19](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L19) |
| <a id="property-input"></a> `input`                               | `readonly` | [`PmInputState`](../../input-handler/PmInputState/interfaces/PmInputState.md)                                | [packages/editor-types/src/types/view/PmEditorView.ts:29](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L29) |
| <a id="property-isdestroyed"></a> `isDestroyed`                   | `readonly` | `boolean`                                                                                                    | [packages/editor-types/src/types/view/PmEditorView.ts:33](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L33) |
| <a id="property-lastselectedviewdesc"></a> `lastSelectedViewDesc` | `public`   | [`PmViewDesc`](../../view-desc/PmViewDesc/interfaces/PmViewDesc.md)                                          | [packages/editor-types/src/types/view/PmEditorView.ts:24](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L24) |
| <a id="property-markcursor"></a> `markCursor`                     | `public`   | readonly `Mark`[]                                                                                            | [packages/editor-types/src/types/view/PmEditorView.ts:20](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L20) |
| <a id="property-nodeviews"></a> `nodeViews`                       | `readonly` | `Readonly`&lt;[`NodeViewSet`](../../editor-view/NodeViewSet/type-aliases/NodeViewSet.md)&gt;                 | [packages/editor-types/src/types/view/PmEditorView.ts:22](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L22) |
| <a id="property-props"></a> `props`                               | `readonly` | `Readonly`&lt;[`DirectEditorProps`](../../editor-view/DirectEditorProps/interfaces/DirectEditorProps.md)&gt; | [packages/editor-types/src/types/view/PmEditorView.ts:17](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L17) |
| <a id="property-root"></a> `root`                                 | `readonly` | `Document` \| `ShadowRoot`                                                                                   | [packages/editor-types/src/types/view/PmEditorView.ts:18](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L18) |
| <a id="property-state"></a> `state`                               | `readonly` | [`PmEditorState`](../../../state/editor-state/PmEditorState/interfaces/PmEditorState.md)                     | [packages/editor-types/src/types/view/PmEditorView.ts:31](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L31) |
| <a id="property-trackwrites"></a> `trackWrites`                   | `readonly` | `Node`                                                                                                       | [packages/editor-types/src/types/view/PmEditorView.ts:25](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L25) |

## Methods

### addPlugin()

```ts
addPlugin(plugin): void;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:423](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L423)

Dynamically adds a plugin to the editor view. The plugin will be
initialized and its state will be included in subsequent transactions.

#### Parameters

| Parameter | Type                                                                | Description                              |
| --------- | ------------------------------------------------------------------- | ---------------------------------------- |
| `plugin`  | [`PmPlugin`](../../../state/plugin/PmPlugin/interfaces/PmPlugin.md) | The plugin instance to add to the editor |

#### Returns

`void`

#### Example

```typescript
// Add a plugin after editor initialization
const myPlugin = new Plugin({
  key: new PluginKey("myPlugin"),
  // plugin configuration...
});
view.addPlugin(myPlugin);
```

---

### clearTrackWrites()

```ts
clearTrackWrites(): void;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:39](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L39)

**`Internal`**

Clears the tracked writes node.

#### Returns

`void`

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

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:208](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L208)

Returns the viewport rectangle at a given document position.
`left` and `right` will be the same number, as this returns a
flat cursor-ish rectangle. If the position is between two things
that aren't directly adjacent, `side` determines which element
is used. When \< 0, the element before the position is used,
otherwise the element after.

#### Parameters

| Parameter | Type     | Description                                                         |
| --------- | -------- | ------------------------------------------------------------------- |
| `pos`     | `number` | The document position                                               |
| `side?`   | `number` | Which side to prefer: \< 0 for before, \>= 0 for after (default: 1) |

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

| Name     | Type     | Defined in                                                                                                                                                                                              |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bottom` | `number` | [packages/editor-types/src/types/view/PmEditorView.ts:208](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L208) |
| `left`   | `number` | [packages/editor-types/src/types/view/PmEditorView.ts:208](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L208) |
| `right`  | `number` | [packages/editor-types/src/types/view/PmEditorView.ts:208](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L208) |
| `top`    | `number` | [packages/editor-types/src/types/view/PmEditorView.ts:208](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L208) |

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

---

### destroy()

```ts
destroy(): void;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:321](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L321)

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

---

### dispatch()

```ts
dispatch(transaction): void;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:365](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L365)

Dispatch a transaction. Will call
[`dispatchTransaction`](#view.DirectEditorProps.dispatchTransaction)
when given, and otherwise defaults to applying the transaction to
the current state and calling
[`updateState`](#view.EditorView.updateState) with the result.
This method is bound to the view instance, so that it can be
easily passed around.

#### Parameters

| Parameter     | Type                                                                        | Description                 |
| ------------- | --------------------------------------------------------------------------- | --------------------------- |
| `transaction` | [`PmTransaction`](../../../state/PmTransaction/interfaces/PmTransaction.md) | The transaction to dispatch |

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

---

### dispatchEvent()

```ts
dispatchEvent(event): void;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:328](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L328)

Used for testing. Dispatches a DOM event to the input state handler.

#### Parameters

| Parameter | Type    | Description               |
| --------- | ------- | ------------------------- |
| `event`   | `Event` | The DOM event to dispatch |

#### Returns

`void`

---

### domAtPos()

```ts
domAtPos(pos, side?): {
  node: Node;
  offset: number;
};
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:224](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L224)

Find the DOM position that corresponds to the given document
position. When `side` is negative, find the position as close as
possible to the content before the position. When positive,
prefer positions close to the content after the position. When
zero, prefer as shallow a position as possible.

Note that you should **not** mutate the editor's internal DOM,
only inspect it (and even that is usually not necessary).

#### Parameters

| Parameter | Type     | Description                                                                          |
| --------- | -------- | ------------------------------------------------------------------------------------ |
| `pos`     | `number` | The document position                                                                |
| `side?`   | `number` | Side preference: negative for before, positive for after, 0 for shallow (default: 0) |

#### Returns

```ts
{
  node: Node;
  offset: number;
}
```

An object with the DOM node and offset

| Name     | Type     | Defined in                                                                                                                                                                                              |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node`   | `Node`   | [packages/editor-types/src/types/view/PmEditorView.ts:224](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L224) |
| `offset` | `number` | [packages/editor-types/src/types/view/PmEditorView.ts:224](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L224) |

---

### domSelection()

```ts
domSelection(): Selection;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:342](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L342)

Gets the current DOM selection object.

#### Returns

`Selection`

The DOM selection object, or null if not available

---

### domSelectionRange()

```ts
domSelectionRange(): DOMSelectionRange;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:335](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L335)

Gets the current DOM selection range, with workarounds for Safari shadow DOM.

#### Returns

[`DOMSelectionRange`](../../dom/DOMSelectionRange/interfaces/DOMSelectionRange.md)

The DOM selection range with focus and anchor information

---

### endOfTextblock()

```ts
endOfTextblock(dir, state?): boolean;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:271](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L271)

Find out whether the selection is at the end of a textblock when
moving in a given direction. When, for example, given `'left'`,
it will return true if moving left from the current cursor
position would leave that position's parent textblock. Will apply
to the view's current state by default, but it is possible to
pass a different state.

#### Parameters

| Parameter | Type                                                                                     | Description                                                                     |
| --------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `dir`     | `"up"` \| `"down"` \| `"left"` \| `"right"` \| `"forward"` \| `"backward"`               | The direction to check: 'up', 'down', 'left', 'right', 'forward', or 'backward' |
| `state?`  | [`PmEditorState`](../../../state/editor-state/PmEditorState/interfaces/PmEditorState.md) | The editor state to use (defaults to current state)                             |

#### Returns

`boolean`

true if at the end of a textblock in the given direction

---

### focus()

```ts
focus(): void;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:151](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L151)

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

---

### hasFocus()

```ts
hasFocus(): boolean;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:136](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L136)

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

---

### nodeDOM()

```ts
nodeDOM(pos): Node;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:239](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L239)

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

---

### pasteHTML()

```ts
pasteHTML(html, event?): boolean;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:282](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L282)

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

---

### pasteText()

```ts
pasteText(text, event?): boolean;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:291](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L291)

Run the editor's paste logic with the given plain-text input.

#### Parameters

| Parameter | Type             | Description                                  |
| --------- | ---------------- | -------------------------------------------- |
| `text`    | `string`         | The plain text string to paste               |
| `event?`  | `ClipboardEvent` | Optional clipboard event to pass to handlers |

#### Returns

`boolean`

true if the paste was handled

---

### posAtCoords()

```ts
posAtCoords(coords): {
  inside: number;
  pos: number;
};
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:182](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L182)

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

| Name     | Type     | Defined in                                                                                                                                                                                              |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inside` | `number` | [packages/editor-types/src/types/view/PmEditorView.ts:182](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L182) |
| `pos`    | `number` | [packages/editor-types/src/types/view/PmEditorView.ts:182](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L182) |

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

---

### posAtDOM()

```ts
posAtDOM(
   node,
   offset,
   bias?): number;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:257](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L257)

Find the document position that corresponds to a given DOM
position. (Whenever possible, it is preferable to inspect the
document structure directly, rather than poking around in the
DOM, but sometimes—for example when interpreting an event
target—you don't have a choice.)

The `bias` parameter can be used to influence which side of a DOM
node to use when the position is inside a leaf node.

#### Parameters

| Parameter | Type     | Description                                                                  |
| --------- | -------- | ---------------------------------------------------------------------------- |
| `node`    | `Node`   | The DOM node                                                                 |
| `offset`  | `number` | The offset within the node                                                   |
| `bias?`   | `number` | Side bias for leaf nodes: negative for start, positive for end (default: -1) |

#### Returns

`number`

The document position

#### Throws

If the DOM position is not inside the editor

---

### scrollToSelection()

```ts
scrollToSelection(): void;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:86](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L86)

Scrolls the current selection into view if it's not already visible.

#### Returns

`void`

---

### serializeForClipboard()

```ts
serializeForClipboard(slice): {
  dom: HTMLElement;
  slice: Slice;
  text: string;
};
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:304](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L304)

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

| Name    | Type          | Defined in                                                                                                                                                                                              |
| ------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dom`   | `HTMLElement` | [packages/editor-types/src/types/view/PmEditorView.ts:304](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L304) |
| `slice` | `Slice`       | [packages/editor-types/src/types/view/PmEditorView.ts:304](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L304) |
| `text`  | `string`      | [packages/editor-types/src/types/view/PmEditorView.ts:304](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L304) |

---

### setProps()

```ts
setProps(props): void;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:66](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L66)

Update the view by updating existing props object with the object
given as argument. Equivalent to `view.update(Object.assign({},
view.props, props))`.

#### Parameters

| Parameter | Type                                                                                                        | Description                                |
| --------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `props`   | `Partial`&lt;[`DirectEditorProps`](../../editor-view/DirectEditorProps/interfaces/DirectEditorProps.md)&gt; | Partial props to merge with existing props |

#### Returns

`void`

---

### someProp()

#### Call Signature

```ts
someProp<PropName, Result>(propName, callbackFunc): Result;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:111](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L111)

Goes over the values of a prop, first those provided directly,
then those from plugins given to the view, then from plugins in
the state (in order), and calls the callback function every time
a non-undefined value is found. When the callback returns a truthy
value, that is immediately returned. When callback isn't provided,
it is treated as the identity function (the prop value is returned directly).

##### Type Parameters

| Type Parameter                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------- |
| `PropName` _extends_ keyof [`EditorProps`](../../editor-view/EditorProps/interfaces/EditorProps.md)&lt;`any`&gt; |
| `Result`                                                                                                         |

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

#### Call Signature

```ts
someProp<PropName>(propName): NonNullable<EditorProps<any>[PropName]>;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:116](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L116)

##### Type Parameters

| Type Parameter                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------- |
| `PropName` _extends_ keyof [`EditorProps`](../../editor-view/EditorProps/interfaces/EditorProps.md)&lt;`any`&gt; |

##### Parameters

| Parameter  | Type       |
| ---------- | ---------- |
| `propName` | `PropName` |

##### Returns

`NonNullable`&lt;[`EditorProps`](../../editor-view/EditorProps/interfaces/EditorProps.md)&lt;`any`&gt;\[`PropName`\]&gt;

#### Call Signature

```ts
someProp<PropName, Result>(propName, callbackFunc?):
  | NonNullable<EditorProps<any>[PropName]>
  | Result;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:118](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L118)

##### Type Parameters

| Type Parameter                                                                                                   | Default type                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `PropName` _extends_ keyof [`EditorProps`](../../editor-view/EditorProps/interfaces/EditorProps.md)&lt;`any`&gt; | -                                                                                                                        |
| `Result`                                                                                                         | `NonNullable`&lt;[`EditorProps`](../../editor-view/EditorProps/interfaces/EditorProps.md)&lt;`any`&gt;\[`PropName`\]&gt; |

##### Parameters

| Parameter       | Type                  |
| --------------- | --------------------- |
| `propName`      | `PropName`            |
| `callbackFunc?` | (`value`) => `Result` |

##### Returns

\| `NonNullable`&lt;[`EditorProps`](../../editor-view/EditorProps/interfaces/EditorProps.md)&lt;`any`&gt;\[`PropName`\]&gt;
\| `Result`

---

### toHtml()

```ts
toHtml(): string;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:405](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L405)

Serializes the editor content to an HTML string representation.
This uses the schema's DOM serializer to convert the document
structure into HTML markup.

#### Returns

`string`

An HTML string representation of the editor content

#### Example

```typescript
// Get HTML for export or display
const html = view.toHtml();
console.log(html); // '<p>Hello <strong>world</strong></p>'

// Copy HTML to clipboard
navigator.clipboard.writeText(view.toHtml());
```

---

### toJSON()

```ts
toJSON(pluginFields?): string;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:386](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L386)

Serializes the editor state to a JSON string representation.
This can be used to save the document state for persistence or
transfer.

#### Parameters

| Parameter       | Type                                                                                                            | Description                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `pluginFields?` | `Readonly`&lt;`Record`&lt;`string`, [`PmPlugin`](../../../state/plugin/PmPlugin/interfaces/PmPlugin.md)&gt;&gt; | Optional mapping of plugin names to plugins whose state should be included in the serialized output |

#### Returns

`string`

A JSON string representation of the editor state

#### Example

```typescript
// Save the editor content to local storage
const json = view.toJSON();
localStorage.setItem("document", json);

// Include specific plugin states
const jsonWithPlugins = view.toJSON({ myPlugin: myPluginInstance });
```

---

### update()

```ts
update(props): void;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:57](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L57)

Update the view's props. Will immediately cause an update to
the DOM.

#### Parameters

| Parameter | Type                                                                                       | Description                        |
| --------- | ------------------------------------------------------------------------------------------ | ---------------------------------- |
| `props`   | [`DirectEditorProps`](../../editor-view/DirectEditorProps/interfaces/DirectEditorProps.md) | The new props to apply to the view |

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

---

### updateRoot()

```ts
updateRoot(): void;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:157](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L157)

When an existing editor view is moved to a new document or
shadow tree, call this to make it recompute its root.

#### Returns

`void`

---

### updateState()

```ts
updateState(state): void;
```

Defined in: [packages/editor-types/src/types/view/PmEditorView.ts:81](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/PmEditorView.ts#L81)

Update the editor's `state` prop, without touching any of the
other props.

#### Parameters

| Parameter | Type                                                                                     | Description                   |
| --------- | ---------------------------------------------------------------------------------------- | ----------------------------- |
| `state`   | [`PmEditorState`](../../../state/editor-state/PmEditorState/interfaces/PmEditorState.md) | The new editor state to apply |

#### Returns

`void`

#### Example

```typescript
// Apply a transaction and update the view
const newState = view.state.apply(tr);
view.updateState(newState);
```

[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/mouse/MouseDown](../README.md) / MouseDown

# Class: MouseDown

Defined in: [input-handler/mouse/MouseDown.ts:14](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/input-handler/mouse/MouseDown.ts#L14)

Manages mouse down state and handles mouse-based text selection and dragging.
Tracks the initial state, sets up drag attributes if needed, and handles
mouse move and mouse up events.

## Implements

- `PmMouseDown`

## Constructors

### Constructor

```ts
new MouseDown(
   view,
   pos,
   event,
   flushed): MouseDown;
```

Defined in: [input-handler/mouse/MouseDown.ts:55](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/input-handler/mouse/MouseDown.ts#L55)

Creates a new MouseDown handler.

#### Parameters

| Parameter    | Type                                       | Description                                         |
| ------------ | ------------------------------------------ | --------------------------------------------------- |
| `view`       | `PmEditorView`                             | The editor view                                     |
| `pos`        | \{ `inside`: `number`; `pos`: `number`; \} | The document position where the mouse down occurred |
| `pos.inside` | `number`                                   | -                                                   |
| `pos.pos`    | `number`                                   | -                                                   |
| `event`      | `MouseEvent`                               | The mouse event                                     |
| `flushed`    | `boolean`                                  | Whether the DOM was flushed before this event       |

#### Returns

`MouseDown`

## Accessors

### allowDefault

#### Get Signature

```ts
get allowDefault(): boolean;
```

Defined in: [input-handler/mouse/MouseDown.ts:135](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/input-handler/mouse/MouseDown.ts#L135)

Whether to allow default browser selection behavior

##### Returns

`boolean`

#### Implementation of

```ts
PmMouseDown.allowDefault;
```

---

### delayedSelectionSync

#### Set Signature

```ts
set delayedSelectionSync(sync): void;
```

Defined in: [input-handler/mouse/MouseDown.ts:140](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/input-handler/mouse/MouseDown.ts#L140)

Set whether selection sync should be delayed

##### Parameters

| Parameter | Type      |
| --------- | --------- |
| `sync`    | `boolean` |

##### Returns

`void`

#### Implementation of

```ts
PmMouseDown.delayedSelectionSync;
```

---

### mightDrag

#### Get Signature

```ts
get mightDrag(): {
  addAttr: boolean;
  node: Node_2;
  pos: number;
  setUneditable: boolean;
};
```

Defined in: [input-handler/mouse/MouseDown.ts:145](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/input-handler/mouse/MouseDown.ts#L145)

Information about a potential drag operation

##### Returns

```ts
{
  addAttr: boolean;
  node: Node_2;
  pos: number;
  setUneditable: boolean;
}
```

| Name            | Type      | Defined in                                                                                                                                                                         |
| --------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `addAttr`       | `boolean` | [input-handler/mouse/MouseDown.ts:145](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/input-handler/mouse/MouseDown.ts#L145) |
| `node`          | `Node_2`  | [input-handler/mouse/MouseDown.ts:145](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/input-handler/mouse/MouseDown.ts#L145) |
| `pos`           | `number`  | [input-handler/mouse/MouseDown.ts:145](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/input-handler/mouse/MouseDown.ts#L145) |
| `setUneditable` | `boolean` | [input-handler/mouse/MouseDown.ts:145](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/input-handler/mouse/MouseDown.ts#L145) |

#### Implementation of

```ts
PmMouseDown.mightDrag;
```

## Methods

### done()

```ts
done(): void;
```

Defined in: [input-handler/mouse/MouseDown.ts:212](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/input-handler/mouse/MouseDown.ts#L212)

Cleans up the mouse down state, removing event listeners and
restoring DOM attributes that were modified for dragging.

#### Returns

`void`

#### Implementation of

```ts
PmMouseDown.done;
```

---

### runHandlerOnContext()

```ts
static runHandlerOnContext(
   view,
   propName,
   pos,
   inside,
   event): boolean;
```

Defined in: [input-handler/mouse/MouseDown.ts:184](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/input-handler/mouse/MouseDown.ts#L184)

Runs click handlers (handleClickOn, handleDoubleClickOn, handleTripleClickOn)
for nodes in the editor tree, traversing from the clicked position up through
parent nodes.

#### Parameters

| Parameter  | Type                                                                    | Description                                                    |
| ---------- | ----------------------------------------------------------------------- | -------------------------------------------------------------- |
| `view`     | `PmEditorView`                                                          | The editor view                                                |
| `propName` | `"handleClickOn"` \| `"handleDoubleClickOn"` \| `"handleTripleClickOn"` | The name of the handler prop to invoke                         |
| `pos`      | `number`                                                                | The document position where the click occurred                 |
| `inside`   | `number`                                                                | The position inside the clicked node (-1 if not inside a node) |
| `event`    | `MouseEvent`                                                            | The mouse event                                                |

#### Returns

`boolean`

True if a handler processed the click

---

### updateSelection()

```ts
static updateSelection(
   view,
   selection,
   origin): void;
```

Defined in: [input-handler/mouse/MouseDown.ts:156](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/input/src/input-handler/mouse/MouseDown.ts#L156)

Updates the editor selection, focusing the editor if necessary and
dispatching a transaction if the selection changed.

#### Parameters

| Parameter   | Type           | Description                                          |
| ----------- | -------------- | ---------------------------------------------------- |
| `view`      | `PmEditorView` | The editor view                                      |
| `selection` | `PmSelection`  | The new selection                                    |
| `origin`    | `string`       | The origin of the selection change (e.g., 'pointer') |

#### Returns

`void`

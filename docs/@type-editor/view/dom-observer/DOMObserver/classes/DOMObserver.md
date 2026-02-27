[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/view](../../../README.md) / [dom-observer/DOMObserver](../README.md) / DOMObserver

# Class: DOMObserver

Defined in: [dom-observer/DOMObserver.ts:19](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/DOMObserver.ts#L19)

Observes DOM changes and selection changes in a ProseMirror editor view.
This class bridges between native browser events and ProseMirror's state management,
ensuring that external DOM modifications are properly synchronized with the editor state.

## Implements

- `PmDOMObserver`

## Constructors

### Constructor

```ts
new DOMObserver(view, handleDOMChange): DOMObserver;
```

Defined in: [dom-observer/DOMObserver.ts:53](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/DOMObserver.ts#L53)

Creates a new DOM observer.

#### Parameters

| Parameter         | Type                                                      | Description                                    |
| ----------------- | --------------------------------------------------------- | ---------------------------------------------- |
| `view`            | [`EditorView`](../../../EditorView/classes/EditorView.md) | The editor view to observe                     |
| `handleDOMChange` | (`from`, `to`, `typeOver`, `added`) => `void`             | Callback invoked when DOM changes are detected |

#### Returns

`DOMObserver`

## Accessors

### currentSelection

#### Get Signature

```ts
get currentSelection(): SelectionState;
```

Defined in: [dom-observer/DOMObserver.ts:92](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/DOMObserver.ts#L92)

Gets the current cached selection state.

##### Returns

[`SelectionState`](../../SelectionState/classes/SelectionState.md)

The current selection state

#### Implementation of

```ts
PmDOMObserver.currentSelection;
```

---

### flushingSoon

#### Get Signature

```ts
get flushingSoon(): number;
```

Defined in: [dom-observer/DOMObserver.ts:76](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/DOMObserver.ts#L76)

Gets the timeout ID for pending flush operation.

##### Returns

`number`

The timeout ID, or -1 if no flush is scheduled

#### Implementation of

```ts
PmDOMObserver.flushingSoon;
```

---

### lastChangedTextNode

#### Get Signature

```ts
get lastChangedTextNode(): Text;
```

Defined in: [dom-observer/DOMObserver.ts:84](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/DOMObserver.ts#L84)

Gets the last text node that was modified.

##### Returns

`Text`

The last changed text node or null

#### Implementation of

```ts
PmDOMObserver.lastChangedTextNode;
```

---

### requiresGeckoHackNode

#### Get Signature

```ts
get requiresGeckoHackNode(): boolean;
```

Defined in: [dom-observer/DOMObserver.ts:96](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/DOMObserver.ts#L96)

##### Returns

`boolean`

#### Implementation of

```ts
PmDOMObserver.requiresGeckoHackNode;
```

## Methods

### connectSelection()

```ts
connectSelection(): void;
```

Defined in: [dom-observer/DOMObserver.ts:203](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/DOMObserver.ts#L203)

Starts listening to selection change events.

#### Returns

`void`

#### Implementation of

```ts
PmDOMObserver.connectSelection;
```

---

### disconnectSelection()

```ts
disconnectSelection(): void;
```

Defined in: [dom-observer/DOMObserver.ts:211](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/DOMObserver.ts#L211)

Stops listening to selection change events.

#### Returns

`void`

#### Implementation of

```ts
PmDOMObserver.disconnectSelection;
```

---

### flush()

```ts
flush(): void;
```

Defined in: [dom-observer/DOMObserver.ts:256](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/DOMObserver.ts#L256)

Processes all pending mutations and synchronizes the editor state.
This is the main entry point for DOM change handling.

#### Returns

`void`

#### Implementation of

```ts
PmDOMObserver.flush;
```

---

### flushSoon()

```ts
flushSoon(): void;
```

Defined in: [dom-observer/DOMObserver.ts:104](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/DOMObserver.ts#L104)

Schedules a flush operation to process pending mutations after a short delay.
This helps batch multiple rapid changes together for better performance.

#### Returns

`void`

#### Implementation of

```ts
PmDOMObserver.flushSoon;
```

---

### forceFlush()

```ts
forceFlush(): void;
```

Defined in: [dom-observer/DOMObserver.ts:118](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/DOMObserver.ts#L118)

Cancels any pending flush and immediately processes all mutations.

#### Returns

`void`

#### Implementation of

```ts
PmDOMObserver.forceFlush;
```

---

### pendingRecords()

```ts
pendingRecords(): MutationRecord[];
```

Defined in: [dom-observer/DOMObserver.ts:244](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/DOMObserver.ts#L244)

Retrieves all pending mutation records and returns the current queue.

#### Returns

`MutationRecord`[]

Array of pending mutation records

#### Implementation of

```ts
PmDOMObserver.pendingRecords;
```

---

### setCurSelection()

```ts
setCurSelection(): void;
```

Defined in: [dom-observer/DOMObserver.ts:236](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/DOMObserver.ts#L236)

Updates the cached current selection from the DOM.

#### Returns

`void`

#### Implementation of

```ts
PmDOMObserver.setCurSelection;
```

---

### start()

```ts
start(): void;
```

Defined in: [dom-observer/DOMObserver.ts:130](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/DOMObserver.ts#L130)

Starts observing DOM and selection changes.
This should be called when the editor becomes active.

#### Returns

`void`

#### Implementation of

```ts
PmDOMObserver.start;
```

---

### stop()

```ts
stop(): void;
```

Defined in: [dom-observer/DOMObserver.ts:165](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/DOMObserver.ts#L165)

Stops observing DOM and selection changes.
Any pending mutations are flushed asynchronously.

#### Returns

`void`

#### Implementation of

```ts
PmDOMObserver.stop;
```

---

### suppressSelectionUpdates()

```ts
suppressSelectionUpdates(): void;
```

Defined in: [dom-observer/DOMObserver.ts:220](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/view/src/dom-observer/DOMObserver.ts#L220)

Temporarily suppresses selection updates for 50ms.
This is useful when programmatically changing the selection.

#### Returns

`void`

#### Implementation of

```ts
PmDOMObserver.suppressSelectionUpdates;
```

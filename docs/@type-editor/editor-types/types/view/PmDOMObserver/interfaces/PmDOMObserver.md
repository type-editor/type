[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/editor-types](../../../../README.md) / [types/view/PmDOMObserver](../README.md) / PmDOMObserver

# Interface: PmDOMObserver

Defined in: [packages/editor-types/src/types/view/PmDOMObserver.ts:3](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/PmDOMObserver.ts#L3)

## Properties

| Property                                                            | Modifier   | Type                                                                        | Defined in                                                                                                                                                                                            |
| ------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-currentselection"></a> `currentSelection`           | `readonly` | [`PmSelectionState`](../../PmSelectionState/interfaces/PmSelectionState.md) | [packages/editor-types/src/types/view/PmDOMObserver.ts:6](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/PmDOMObserver.ts#L6) |
| <a id="property-flushingsoon"></a> `flushingSoon`                   | `readonly` | `number`                                                                    | [packages/editor-types/src/types/view/PmDOMObserver.ts:4](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/PmDOMObserver.ts#L4) |
| <a id="property-lastchangedtextnode"></a> `lastChangedTextNode`     | `readonly` | `Text`                                                                      | [packages/editor-types/src/types/view/PmDOMObserver.ts:5](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/PmDOMObserver.ts#L5) |
| <a id="property-requiresgeckohacknode"></a> `requiresGeckoHackNode` | `readonly` | `boolean`                                                                   | [packages/editor-types/src/types/view/PmDOMObserver.ts:7](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/PmDOMObserver.ts#L7) |

## Methods

### connectSelection()

```ts
connectSelection(): void;
```

Defined in: [packages/editor-types/src/types/view/PmDOMObserver.ts:35](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/PmDOMObserver.ts#L35)

Starts listening to selection change events.

#### Returns

`void`

---

### disconnectSelection()

```ts
disconnectSelection(): void;
```

Defined in: [packages/editor-types/src/types/view/PmDOMObserver.ts:40](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/PmDOMObserver.ts#L40)

Stops listening to selection change events.

#### Returns

`void`

---

### flush()

```ts
flush(): void;
```

Defined in: [packages/editor-types/src/types/view/PmDOMObserver.ts:63](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/PmDOMObserver.ts#L63)

Processes all pending mutations and synchronizes the editor state.
This is the main entry point for DOM change handling.

#### Returns

`void`

---

### flushSoon()

```ts
flushSoon(): void;
```

Defined in: [packages/editor-types/src/types/view/PmDOMObserver.ts:13](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/PmDOMObserver.ts#L13)

Schedules a flush operation to process pending mutations after a short delay.
This helps batch multiple rapid changes together for better performance.

#### Returns

`void`

---

### forceFlush()

```ts
forceFlush(): void;
```

Defined in: [packages/editor-types/src/types/view/PmDOMObserver.ts:18](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/PmDOMObserver.ts#L18)

Cancels any pending flush and immediately processes all mutations.

#### Returns

`void`

---

### pendingRecords()

```ts
pendingRecords(): MutationRecord[];
```

Defined in: [packages/editor-types/src/types/view/PmDOMObserver.ts:57](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/PmDOMObserver.ts#L57)

Retrieves all pending mutation records and returns the current queue.

#### Returns

`MutationRecord`[]

Array of pending mutation records

---

### setCurSelection()

```ts
setCurSelection(): void;
```

Defined in: [packages/editor-types/src/types/view/PmDOMObserver.ts:51](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/PmDOMObserver.ts#L51)

Updates the cached current selection from the DOM.

#### Returns

`void`

---

### start()

```ts
start(): void;
```

Defined in: [packages/editor-types/src/types/view/PmDOMObserver.ts:24](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/PmDOMObserver.ts#L24)

Starts observing DOM and selection changes.
This should be called when the editor becomes active.

#### Returns

`void`

---

### stop()

```ts
stop(): void;
```

Defined in: [packages/editor-types/src/types/view/PmDOMObserver.ts:30](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/PmDOMObserver.ts#L30)

Stops observing DOM and selection changes.
Any pending mutations are flushed asynchronously.

#### Returns

`void`

---

### suppressSelectionUpdates()

```ts
suppressSelectionUpdates(): void;
```

Defined in: [packages/editor-types/src/types/view/PmDOMObserver.ts:46](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/view/PmDOMObserver.ts#L46)

Temporarily suppresses selection updates for 50ms.
This is useful when programmatically changing the selection.

#### Returns

`void`

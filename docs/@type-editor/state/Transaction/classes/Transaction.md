[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/state](../../README.md) / [Transaction](../README.md) / Transaction

# Class: Transaction

Defined in: [state/src/Transaction.ts:40](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L40)

An editor state transaction, which can be applied to a state to
create an updated state. Use
[`EditorState.tr`](#state.EditorState.tr) to create an instance.

Transactions track changes to the document (they are a subclass of
[`Transform`](#transform.Transform)), but also other state changes,
like selection updates and adjustments of the set of [stored
marks](#state.EditorState.storedMarks). In addition, you can store
metadata properties in a transaction, which are extra pieces of
information that client code or plugins can use to describe what a
transaction represents, so that they can update their [own
state](#state.StateField) accordingly.

The [editor view](#view.EditorView) uses a few metadata
properties: it will attach a property `'pointer'` with the value
`true` to selection transactions directly caused by mouse or touch
input, a `'composition'` property holding an ID identifying the
composition that caused it to transactions caused by composed DOM
input, and a `'uiEvent'` property of that may be `'paste'`,
`'cut'`, or `'drop'`.

## Extends

- `Transform`

## Implements

- `PmTransaction`

## Constructors

### Constructor

```ts
new Transaction(state): Transaction;
```

Defined in: [state/src/Transaction.ts:70](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L70)

#### Parameters

| Parameter | Type                                                                   |
| --------- | ---------------------------------------------------------------------- |
| `state`   | [`EditorState`](../../editor-state/EditorState/classes/EditorState.md) |

#### Returns

`Transaction`

#### Overrides

```ts
Transform.constructor;
```

## Properties

| Property                          | Modifier    | Type     | Inherited from   | Defined in                    |
| --------------------------------- | ----------- | -------- | ---------------- | ----------------------------- |
| <a id="property-_doc"></a> `_doc` | `protected` | `Node_2` | `Transform._doc` | transform/dist/index.d.ts:270 |

## Accessors

### before

#### Get Signature

```ts
get before(): Node_2;
```

Defined in: transform/dist/index.d.ts:276

##### Returns

`Node_2`

#### Implementation of

```ts
PmTransaction.before;
```

#### Inherited from

```ts
Transform.before;
```

---

### doc

#### Get Signature

```ts
get doc(): Node_2;
```

Defined in: transform/dist/index.d.ts:272

##### Returns

`Node_2`

#### Implementation of

```ts
PmTransaction.doc;
```

#### Inherited from

```ts
Transform.doc;
```

---

### docChanged

#### Get Signature

```ts
get docChanged(): boolean;
```

Defined in: transform/dist/index.d.ts:277

##### Returns

`boolean`

#### Implementation of

```ts
PmTransaction.docChanged;
```

#### Inherited from

```ts
Transform.docChanged;
```

---

### docs

#### Get Signature

```ts
get docs(): readonly Node_2[];
```

Defined in: transform/dist/index.d.ts:274

##### Returns

readonly `Node_2`[]

#### Implementation of

```ts
PmTransaction.docs;
```

#### Inherited from

```ts
Transform.docs;
```

---

### isGeneric

#### Get Signature

```ts
get isGeneric(): boolean;
```

Defined in: [state/src/Transaction.ts:124](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L124)

Returns true if this transaction doesn't contain any metadata,
and can thus safely be extended.

##### Returns

`boolean`

#### Implementation of

```ts
PmTransaction.isGeneric;
```

---

### mapping

#### Get Signature

```ts
get mapping(): Mapping;
```

Defined in: transform/dist/index.d.ts:275

##### Returns

`Mapping`

#### Implementation of

```ts
PmTransaction.mapping;
```

#### Inherited from

```ts
Transform.mapping;
```

---

### scrolledIntoView

#### Get Signature

```ts
get scrolledIntoView(): boolean;
```

Defined in: [state/src/Transaction.ts:131](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L131)

True when this transaction has had `scrollIntoView` called on it.

##### Returns

`boolean`

#### Implementation of

```ts
PmTransaction.scrolledIntoView;
```

---

### selection

#### Get Signature

```ts
get selection(): Selection;
```

Defined in: [state/src/Transaction.ts:98](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L98)

The transaction's current selection. This defaults to the editor
selection [mapped](#state.Selection.map) through the steps in the
transaction, but can be overwritten with
[`setSelection`](#state.Transaction.setSelection).

##### Returns

[`Selection`](../../selection/Selection/classes/Selection.md)

#### Implementation of

```ts
PmTransaction.selection;
```

---

### selectionSet

#### Get Signature

```ts
get selectionSet(): boolean;
```

Defined in: [state/src/Transaction.ts:109](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L109)

Whether the selection was explicitly updated by this transaction.

##### Returns

`boolean`

#### Implementation of

```ts
PmTransaction.selectionSet;
```

---

### steps

#### Get Signature

```ts
get steps(): readonly Step[];
```

Defined in: transform/dist/index.d.ts:273

##### Returns

readonly `Step`[]

#### Implementation of

```ts
PmTransaction.steps;
```

#### Inherited from

```ts
Transform.steps;
```

---

### storedMarks

#### Get Signature

```ts
get storedMarks(): readonly Mark[];
```

Defined in: [state/src/Transaction.ts:80](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L80)

The stored marks set by this transaction, if any.

##### Returns

readonly `Mark`[]

#### Implementation of

```ts
PmTransaction.storedMarks;
```

---

### storedMarksSet

#### Get Signature

```ts
get storedMarksSet(): boolean;
```

Defined in: [state/src/Transaction.ts:116](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L116)

Whether the stored marks were explicitly set for this transaction.

##### Returns

`boolean`

#### Implementation of

```ts
PmTransaction.storedMarksSet;
```

---

### time

#### Get Signature

```ts
get time(): number;
```

Defined in: [state/src/Transaction.ts:88](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L88)

The timestamp associated with this transaction, in the same
format as `Date.now()`.

##### Returns

`number`

#### Implementation of

```ts
PmTransaction.time;
```

## Methods

### addMark()

```ts
addMark(
   from,
   to,
   mark): this;
```

Defined in: transform/dist/index.d.ts:308

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `from`    | `number` |
| `to`      | `number` |
| `mark`    | `Mark`   |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.addMark;
```

#### Inherited from

```ts
Transform.addMark;
```

---

### addNodeMark()

```ts
addNodeMark(position, mark): this;
```

Defined in: transform/dist/index.d.ts:302

#### Parameters

| Parameter  | Type     |
| ---------- | -------- |
| `position` | `number` |
| `mark`     | `Mark`   |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.addNodeMark;
```

#### Inherited from

```ts
Transform.addNodeMark;
```

---

### addStep()

```ts
addStep(step, doc): void;
```

Defined in: [state/src/Transaction.ts:186](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L186)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `step`    | `Step`   |
| `doc`     | `Node_2` |

#### Returns

`void`

#### Implementation of

```ts
PmTransaction.addStep;
```

#### Overrides

```ts
Transform.addStep;
```

---

### addStoredMark()

```ts
addStoredMark(mark): Transaction;
```

Defined in: [state/src/Transaction.ts:173](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L173)

Add a mark to the set of stored marks.

#### Parameters

| Parameter | Type   |
| --------- | ------ |
| `mark`    | `Mark` |

#### Returns

`Transaction`

#### Implementation of

```ts
PmTransaction.addStoredMark;
```

---

### changedRange()

```ts
changedRange(): {
  from: number;
  to: number;
};
```

Defined in: transform/dist/index.d.ts:280

#### Returns

```ts
{
  from: number;
  to: number;
}
```

| Name   | Type     | Defined in                    |
| ------ | -------- | ----------------------------- |
| `from` | `number` | transform/dist/index.d.ts:281 |
| `to`   | `number` | transform/dist/index.d.ts:282 |

#### Implementation of

```ts
PmTransaction.changedRange;
```

#### Inherited from

```ts
Transform.changedRange;
```

---

### clearIncompatible()

```ts
clearIncompatible(
   position,
   parentType,
   match?): this;
```

Defined in: transform/dist/index.d.ts:310

#### Parameters

| Parameter    | Type           |
| ------------ | -------------- |
| `position`   | `number`       |
| `parentType` | `NodeType`     |
| `match?`     | `ContentMatch` |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.clearIncompatible;
```

#### Inherited from

```ts
Transform.clearIncompatible;
```

---

### delete()

```ts
delete(from, to): this;
```

Defined in: transform/dist/index.d.ts:287

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `from`    | `number` |
| `to`      | `number` |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.delete;
```

#### Inherited from

```ts
Transform.delete;
```

---

### deleteRange()

```ts
deleteRange(from, to): this;
```

Defined in: transform/dist/index.d.ts:291

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `from`    | `number` |
| `to`      | `number` |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.deleteRange;
```

#### Inherited from

```ts
Transform.deleteRange;
```

---

### deleteSelection()

```ts
deleteSelection(): Transaction;
```

Defined in: [state/src/Transaction.ts:238](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L238)

Delete the selection.

#### Returns

`Transaction`

#### Implementation of

```ts
PmTransaction.deleteSelection;
```

---

### ensureMarks()

```ts
ensureMarks(marks): Transaction;
```

Defined in: [state/src/Transaction.ts:163](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L163)

Make sure the current stored marks or, if that is null, the marks
at the selection, match the given set of marks. Does nothing if
this is already the case.

#### Parameters

| Parameter | Type              |
| --------- | ----------------- |
| `marks`   | readonly `Mark`[] |

#### Returns

`Transaction`

#### Implementation of

```ts
PmTransaction.ensureMarks;
```

---

### getMeta()

```ts
getMeta(key): any;
```

Defined in: [state/src/Transaction.ts:289](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L289)

Retrieve a metadata property for a given name or plugin.

#### Parameters

| Parameter | Type                                                                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`     | \| `string` \| [`Plugin`](../../plugin/Plugin/classes/Plugin.md)&lt;`any`&gt; \| [`PluginKey`](../../plugin/PluginKey/classes/PluginKey.md)&lt;`any`&gt; |

#### Returns

`any`

#### Implementation of

```ts
PmTransaction.getMeta;
```

---

### getUpdated()

```ts
getUpdated(): number;
```

Defined in: [state/src/Transaction.ts:150](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L150)

#### Returns

`number`

#### Implementation of

```ts
PmTransaction.getUpdated;
```

---

### insert()

```ts
insert(pos, content): this;
```

Defined in: transform/dist/index.d.ts:288

#### Parameters

| Parameter | Type                                          |
| --------- | --------------------------------------------- |
| `pos`     | `number`                                      |
| `content` | `Node_2` \| readonly `Node_2`[] \| `Fragment` |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.insert;
```

#### Inherited from

```ts
Transform.insert;
```

---

### insertText()

```ts
insertText(
   text,
   from?,
   to?): Transaction;
```

Defined in: [state/src/Transaction.ts:247](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L247)

Replace the given range, or the selection if no range is given,
with a text node containing the given string.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `text`    | `string` |
| `from?`   | `number` |
| `to?`     | `number` |

#### Returns

`Transaction`

#### Implementation of

```ts
PmTransaction.insertText;
```

---

### join()

```ts
join(pos, depth?): this;
```

Defined in: transform/dist/index.d.ts:293

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `pos`     | `number` |
| `depth?`  | `number` |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.join;
```

#### Inherited from

```ts
Transform.join;
```

---

### lift()

```ts
lift(range, target): this;
```

Defined in: transform/dist/index.d.ts:292

#### Parameters

| Parameter | Type        |
| --------- | ----------- |
| `range`   | `NodeRange` |
| `target`  | `number`    |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.lift;
```

#### Inherited from

```ts
Transform.lift;
```

---

### maybeStep()

```ts
maybeStep(step): StepResult;
```

Defined in: transform/dist/index.d.ts:279

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `step`    | `PmStep` |

#### Returns

`StepResult`

#### Implementation of

```ts
PmTransaction.maybeStep;
```

#### Inherited from

```ts
Transform.maybeStep;
```

---

### removeMark()

```ts
removeMark(
   from,
   to,
   mark?): this;
```

Defined in: transform/dist/index.d.ts:309

#### Parameters

| Parameter | Type                 |
| --------- | -------------------- |
| `from`    | `number`             |
| `to`      | `number`             |
| `mark?`   | `Mark` \| `MarkType` |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.removeMark;
```

#### Inherited from

```ts
Transform.removeMark;
```

---

### removeNodeMark()

```ts
removeNodeMark(position, mark): this;
```

Defined in: transform/dist/index.d.ts:303

#### Parameters

| Parameter  | Type                 |
| ---------- | -------------------- |
| `position` | `number`             |
| `mark`     | `Mark` \| `MarkType` |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.removeNodeMark;
```

#### Inherited from

```ts
Transform.removeNodeMark;
```

---

### removeStoredMark()

```ts
removeStoredMark(mark): Transaction;
```

Defined in: [state/src/Transaction.ts:181](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L181)

Remove a mark or mark type from the set of stored marks.

#### Parameters

| Parameter | Type                 |
| --------- | -------------------- |
| `mark`    | `Mark` \| `MarkType` |

#### Returns

`Transaction`

#### Implementation of

```ts
PmTransaction.removeStoredMark;
```

---

### replace()

```ts
replace(
   from,
   to?,
   slice?): this;
```

Defined in: transform/dist/index.d.ts:285

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `from`    | `number` |
| `to?`     | `number` |
| `slice?`  | `Slice`  |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.replace;
```

#### Inherited from

```ts
Transform.replace;
```

---

### replaceRange()

```ts
replaceRange(
   from,
   to,
   slice): this;
```

Defined in: transform/dist/index.d.ts:289

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `from`    | `number` |
| `to`      | `number` |
| `slice`   | `Slice`  |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.replaceRange;
```

#### Inherited from

```ts
Transform.replaceRange;
```

---

### replaceRangeWith()

```ts
replaceRangeWith(
   from,
   to,
   node): this;
```

Defined in: transform/dist/index.d.ts:290

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `from`    | `number` |
| `to`      | `number` |
| `node`    | `Node_2` |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.replaceRangeWith;
```

#### Inherited from

```ts
Transform.replaceRangeWith;
```

---

### replaceSelection()

```ts
replaceSelection(slice): Transaction;
```

Defined in: [state/src/Transaction.ts:205](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L205)

Replace the current selection with the given slice.

#### Parameters

| Parameter | Type    |
| --------- | ------- |
| `slice`   | `Slice` |

#### Returns

`Transaction`

#### Implementation of

```ts
PmTransaction.replaceSelection;
```

---

### replaceSelectionWith()

```ts
replaceSelectionWith(node, inheritMarks?): Transaction;
```

Defined in: [state/src/Transaction.ts:217](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L217)

Replace the selection with the given node. When `inheritMarks` is
true and the content is inline, it inherits the marks from the
place where it is inserted.

#### Parameters

| Parameter      | Type      | Default value |
| -------------- | --------- | ------------- |
| `node`         | `Node_2`  | `undefined`   |
| `inheritMarks` | `boolean` | `true`        |

#### Returns

`Transaction`

#### Implementation of

```ts
PmTransaction.replaceSelectionWith;
```

---

### replaceWith()

```ts
replaceWith(
   from,
   to,
   content): this;
```

Defined in: transform/dist/index.d.ts:286

#### Parameters

| Parameter | Type                                          |
| --------- | --------------------------------------------- |
| `from`    | `number`                                      |
| `to`      | `number`                                      |
| `content` | `Node_2` \| readonly `Node_2`[] \| `Fragment` |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.replaceWith;
```

#### Inherited from

```ts
Transform.replaceWith;
```

---

### scrollIntoView()

```ts
scrollIntoView(): Transaction;
```

Defined in: [state/src/Transaction.ts:297](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L297)

Indicate that the editor should scroll the selection into view
when updated to the state produced by this transaction.

#### Returns

`Transaction`

#### Implementation of

```ts
PmTransaction.scrollIntoView;
```

---

### setBlockType()

```ts
setBlockType(
   from,
   to,
   type,
   attrs?): this;
```

Defined in: transform/dist/index.d.ts:298

#### Parameters

| Parameter | Type                                                                           |
| --------- | ------------------------------------------------------------------------------ |
| `from`    | `number`                                                                       |
| `to`      | `number`                                                                       |
| `type`    | `NodeType`                                                                     |
| `attrs?`  | \| `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; \| (`oldNode`) => `Attrs` |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.setBlockType;
```

#### Inherited from

```ts
Transform.setBlockType;
```

---

### setDocAttribute()

```ts
setDocAttribute(attr, value): this;
```

Defined in: transform/dist/index.d.ts:301

#### Parameters

| Parameter | Type        |
| --------- | ----------- |
| `attr`    | `string`    |
| `value`   | `AttrValue` |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.setDocAttribute;
```

#### Inherited from

```ts
Transform.setDocAttribute;
```

---

### setMeta()

```ts
setMeta(key, value): Transaction;
```

Defined in: [state/src/Transaction.ts:281](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L281)

Store a metadata property in this transaction, keyed either by
name or by plugin.

#### Parameters

| Parameter | Type                                                                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`     | \| `string` \| [`Plugin`](../../plugin/Plugin/classes/Plugin.md)&lt;`any`&gt; \| [`PluginKey`](../../plugin/PluginKey/classes/PluginKey.md)&lt;`any`&gt; |
| `value`   | `any`                                                                                                                                                    |

#### Returns

`Transaction`

#### Implementation of

```ts
PmTransaction.setMeta;
```

---

### setNodeAttribute()

```ts
setNodeAttribute(
   pos,
   attr,
   value): this;
```

Defined in: transform/dist/index.d.ts:300

#### Parameters

| Parameter | Type        |
| --------- | ----------- |
| `pos`     | `number`    |
| `attr`    | `string`    |
| `value`   | `AttrValue` |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.setNodeAttribute;
```

#### Inherited from

```ts
Transform.setNodeAttribute;
```

---

### setNodeMarkup()

```ts
setNodeMarkup(
   pos,
   type?,
   attrs?,
   marks?): this;
```

Defined in: transform/dist/index.d.ts:299

#### Parameters

| Parameter | Type                                              |
| --------- | ------------------------------------------------- |
| `pos`     | `number`                                          |
| `type?`   | `NodeType`                                        |
| `attrs?`  | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; |
| `marks?`  | readonly `Mark`[]                                 |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.setNodeMarkup;
```

#### Inherited from

```ts
Transform.setNodeMarkup;
```

---

### setSelection()

```ts
setSelection(selection): Transaction;
```

Defined in: [state/src/Transaction.ts:139](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L139)

Update the transaction's current selection. Will determine the
selection that the editor gets when the transaction is applied.

#### Parameters

| Parameter   | Type                                                          |
| ----------- | ------------------------------------------------------------- |
| `selection` | [`Selection`](../../selection/Selection/classes/Selection.md) |

#### Returns

`Transaction`

#### Implementation of

```ts
PmTransaction.setSelection;
```

---

### setStoredMarks()

```ts
setStoredMarks(marks): Transaction;
```

Defined in: [state/src/Transaction.ts:305](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L305)

Set the current stored marks.

#### Parameters

| Parameter | Type              |
| --------- | ----------------- |
| `marks`   | readonly `Mark`[] |

#### Returns

`Transaction`

#### Implementation of

```ts
PmTransaction.setStoredMarks;
```

---

### setTime()

```ts
setTime(time): Transaction;
```

Defined in: [state/src/Transaction.ts:196](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L196)

Update the timestamp for the transaction.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `time`    | `number` |

#### Returns

`Transaction`

#### Implementation of

```ts
PmTransaction.setTime;
```

---

### setUpdated()

```ts
setUpdated(updated): void;
```

Defined in: [state/src/Transaction.ts:154](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/state/src/Transaction.ts#L154)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `updated` | `number` |

#### Returns

`void`

#### Implementation of

```ts
PmTransaction.setUpdated;
```

---

### split()

```ts
split(
   pos,
   depth?,
   typesAfter?): this;
```

Defined in: transform/dist/index.d.ts:304

#### Parameters

| Parameter     | Type                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------- |
| `pos`         | `number`                                                                                 |
| `depth?`      | `number`                                                                                 |
| `typesAfter?` | \{ `attrs?`: `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;; `type`: `NodeType`; \}[] |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.split;
```

#### Inherited from

```ts
Transform.split;
```

---

### step()

```ts
step(step): this;
```

Defined in: transform/dist/index.d.ts:278

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `step`    | `PmStep` |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.step;
```

#### Inherited from

```ts
Transform.step;
```

---

### wrap()

```ts
wrap(range, wrappers): this;
```

Defined in: transform/dist/index.d.ts:294

#### Parameters

| Parameter  | Type                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------- |
| `range`    | `NodeRange`                                                                                       |
| `wrappers` | readonly \{ `attrs?`: `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;; `type`: `NodeType`; \}[] |

#### Returns

`this`

#### Implementation of

```ts
PmTransaction.wrap;
```

#### Inherited from

```ts
Transform.wrap;
```

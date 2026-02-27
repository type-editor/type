[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/transform](../../README.md) / [Transform](../README.md) / Transform

# Class: Transform

Defined in: [packages/transform/src/Transform.ts:59](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L59)

Abstraction to build up and track an array of
[steps](#transform.Step) representing a document transformation.

Most transforming methods return the `Transform` object itself, so
that they can be chained.

## Implements

- `TransformDocument`

## Constructors

### Constructor

```ts
new Transform(doc): Transform;
```

Defined in: [packages/transform/src/Transform.ts:75](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L75)

Creates a new Transform instance.

#### Parameters

| Parameter | Type     | Description                                                               |
| --------- | -------- | ------------------------------------------------------------------------- |
| `doc`     | `Node_2` | The current document (the result of applying the steps in the transform). |

#### Returns

`Transform`

## Properties

| Property                          | Modifier    | Type     | Description           | Defined in                                                                                                                                                          |
| --------------------------------- | ----------- | -------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-_doc"></a> `_doc` | `protected` | `Node_2` | The current document. | [packages/transform/src/Transform.ts:69](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L69) |

## Accessors

### before

#### Get Signature

```ts
get before(): Node_2;
```

Defined in: [packages/transform/src/Transform.ts:110](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L110)

The starting document.

##### Returns

`Node_2`

#### Implementation of

```ts
TransformDocument.before;
```

---

### doc

#### Get Signature

```ts
get doc(): Node_2;
```

Defined in: [packages/transform/src/Transform.ts:82](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L82)

The current document (the result of applying all steps).

##### Returns

`Node_2`

#### Implementation of

```ts
TransformDocument.doc;
```

---

### docChanged

#### Get Signature

```ts
get docChanged(): boolean;
```

Defined in: [packages/transform/src/Transform.ts:117](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L117)

True when the document has been changed (when there are any steps).

##### Returns

`boolean`

#### Implementation of

```ts
TransformDocument.docChanged;
```

---

### docs

#### Get Signature

```ts
get docs(): readonly Node_2[];
```

Defined in: [packages/transform/src/Transform.ts:96](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L96)

The documents before each of the steps.

##### Returns

readonly `Node_2`[]

#### Implementation of

```ts
TransformDocument.docs;
```

---

### mapping

#### Get Signature

```ts
get mapping(): Mapping;
```

Defined in: [packages/transform/src/Transform.ts:103](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L103)

A mapping with the maps for each of the steps in this transform.

##### Returns

[`Mapping`](../../change-map/Mapping/classes/Mapping.md)

#### Implementation of

```ts
TransformDocument.mapping;
```

---

### steps

#### Get Signature

```ts
get steps(): readonly Step[];
```

Defined in: [packages/transform/src/Transform.ts:89](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L89)

The steps in this transform.

##### Returns

readonly [`Step`](../../change-steps/Step/classes/Step.md)[]

#### Implementation of

```ts
TransformDocument.steps;
```

## Methods

### addMark()

```ts
addMark(
   from,
   to,
   mark): this;
```

Defined in: [packages/transform/src/Transform.ts:477](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L477)

Add the given mark to the inline content between `from` and `to`.

#### Parameters

| Parameter | Type     | Description                      |
| --------- | -------- | -------------------------------- |
| `from`    | `number` | The start position of the range. |
| `to`      | `number` | The end position of the range.   |
| `mark`    | `Mark`   | The mark to add.                 |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.addMark;
```

---

### addNodeMark()

```ts
addNodeMark(position, mark): this;
```

Defined in: [packages/transform/src/Transform.ts:408](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L408)

Add a mark to the node at position `pos`.

#### Parameters

| Parameter  | Type     | Description               |
| ---------- | -------- | ------------------------- |
| `position` | `number` | The position of the node. |
| `mark`     | `Mark`   | The mark to add.          |

#### Returns

`this`

This transform instance for chaining.

#### Throws

When there is no node at the given position.

#### Implementation of

```ts
TransformDocument.addNodeMark;
```

---

### addStep()

```ts
addStep(step, doc): void;
```

Defined in: [packages/transform/src/Transform.ts:182](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L182)

Add a step to the transform without applying it (assumes it has already been applied).
Updates the internal state to track the step and its resulting document.

#### Parameters

| Parameter | Type     | Description                                     |
| --------- | -------- | ----------------------------------------------- |
| `step`    | `PmStep` | The step that was applied.                      |
| `doc`     | `Node_2` | The resulting document after applying the step. |

#### Returns

`void`

#### Implementation of

```ts
TransformDocument.addStep;
```

---

### changedRange()

```ts
changedRange(): {
  from: number;
  to: number;
};
```

Defined in: [packages/transform/src/Transform.ts:156](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L156)

Return a single range, in post-transform document positions,
that covers all content changed by this transform. Returns null
if no replacements are made. Note that this will ignore changes
that add/remove marks without replacing the underlying content.

#### Returns

```ts
{
  from: number;
  to: number;
}
```

| Name   | Type     | Defined in                                                                                                                                                            |
| ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | `number` | [packages/transform/src/Transform.ts:156](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L156) |
| `to`   | `number` | [packages/transform/src/Transform.ts:156](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L156) |

---

### clearIncompatible()

```ts
clearIncompatible(
   position,
   parentType,
   match?): this;
```

Defined in: [packages/transform/src/Transform.ts:509](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L509)

Removes all marks and nodes from the content of the node at
`position` that don't match the given new parent node type. Accepts
an optional starting [content match](#model.ContentMatch) as
third argument.

#### Parameters

| Parameter    | Type           | Description                             |
| ------------ | -------------- | --------------------------------------- |
| `position`   | `number`       | The position of the parent node.        |
| `parentType` | `NodeType`     | The node type to match content against. |
| `match?`     | `ContentMatch` | Optional starting content match.        |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.clearIncompatible;
```

---

### delete()

```ts
delete(from, to): this;
```

Defined in: [packages/transform/src/Transform.ts:228](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L228)

Delete the content between the given positions.

#### Parameters

| Parameter | Type     | Description                                |
| --------- | -------- | ------------------------------------------ |
| `from`    | `number` | The start position of the range to delete. |
| `to`      | `number` | The end position of the range to delete.   |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.delete;
```

---

### deleteRange()

```ts
deleteRange(from, to): this;
```

Defined in: [packages/transform/src/Transform.ts:296](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L296)

Delete the given range, expanding it to cover fully covered
parent nodes until a valid replace is found.

#### Parameters

| Parameter | Type     | Description                                |
| --------- | -------- | ------------------------------------------ |
| `from`    | `number` | The start position of the range to delete. |
| `to`      | `number` | The end position of the range to delete.   |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.deleteRange;
```

---

### insert()

```ts
insert(pos, content): this;
```

Defined in: [packages/transform/src/Transform.ts:238](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L238)

Insert the given content at the given position.

#### Parameters

| Parameter | Type                                          | Description                                                |
| --------- | --------------------------------------------- | ---------------------------------------------------------- |
| `pos`     | `number`                                      | The position at which to insert the content.               |
| `content` | `Node_2` \| `Fragment` \| readonly `Node_2`[] | The content to insert (fragment, node, or array of nodes). |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.insert;
```

---

### join()

```ts
join(pos, depth?): this;
```

Defined in: [packages/transform/src/Transform.ts:323](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L323)

Join the blocks around the given position. If depth is 2, their
last and first siblings are also joined, and so on.

#### Parameters

| Parameter | Type     | Default value | Description                                  |
| --------- | -------- | ------------- | -------------------------------------------- |
| `pos`     | `number` | `undefined`   | The position around which to join blocks.    |
| `depth`   | `number` | `1`           | The number of levels to join. Defaults to 1. |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.join;
```

---

### lift()

```ts
lift(range, target): this;
```

Defined in: [packages/transform/src/Transform.ts:311](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L311)

Split the content in the given range off from its parent, if there
is sibling content before or after it, and move it up the tree to
the depth specified by `target`. You'll probably want to use
[`liftTarget`](#transform.liftTarget) to compute `target`, to make
sure the lift is valid.

#### Parameters

| Parameter | Type        | Description                       |
| --------- | ----------- | --------------------------------- |
| `range`   | `NodeRange` | The range of content to lift.     |
| `target`  | `number`    | The depth to lift the content to. |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.lift;
```

---

### maybeStep()

```ts
maybeStep(step): StepResult;
```

Defined in: [packages/transform/src/Transform.ts:142](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L142)

Try to apply a step in this transformation, ignoring it if it
fails. Returns the step result.

#### Parameters

| Parameter | Type     | Description               |
| --------- | -------- | ------------------------- |
| `step`    | `PmStep` | The step to try applying. |

#### Returns

[`StepResult`](../../change-steps/StepResult/classes/StepResult.md)

The result of applying the step, which may indicate failure.

#### Implementation of

```ts
TransformDocument.maybeStep;
```

---

### removeMark()

```ts
removeMark(
   from,
   to,
   mark?): this;
```

Defined in: [packages/transform/src/Transform.ts:492](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L492)

Remove marks from inline nodes between `from` and `to`. When
`mark` is a single mark, remove precisely that mark. When it is
a mark type, remove all marks of that type. When it is null,
remove all marks of any type.

#### Parameters

| Parameter | Type                 | Description                                       |
| --------- | -------------------- | ------------------------------------------------- |
| `from`    | `number`             | The start position of the range.                  |
| `to`      | `number`             | The end position of the range.                    |
| `mark?`   | `Mark` \| `MarkType` | The mark, mark type, or null to remove all marks. |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.removeMark;
```

---

### removeNodeMark()

```ts
removeNodeMark(position, mark): this;
```

Defined in: [packages/transform/src/Transform.ts:425](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L425)

Remove a mark (or all marks of the given type) from the node at
position `pos`.

#### Parameters

| Parameter  | Type                 | Description                      |
| ---------- | -------------------- | -------------------------------- |
| `position` | `number`             | The position of the node.        |
| `mark`     | `Mark` \| `MarkType` | The mark or mark type to remove. |

#### Returns

`this`

This transform instance for chaining.

#### Throws

When there is no node at the given position.

#### Implementation of

```ts
TransformDocument.removeNodeMark;
```

---

### replace()

```ts
replace(
   from,
   to?,
   slice?): this;
```

Defined in: [packages/transform/src/Transform.ts:198](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L198)

Replace the part of the document between `from` and `to` with the
given `slice`. No-op replacements (empty slice over empty range) are
silently ignored.

#### Parameters

| Parameter | Type     | Default value | Description                                                   |
| --------- | -------- | ------------- | ------------------------------------------------------------- |
| `from`    | `number` | `undefined`   | The start position of the range to replace.                   |
| `to`      | `number` | `from`        | The end position of the range to replace. Defaults to `from`. |
| `slice`   | `Slice`  | `Slice.empty` | The slice to insert. Defaults to an empty slice.              |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.replace;
```

---

### replaceRange()

```ts
replaceRange(
   from,
   to,
   slice): this;
```

Defined in: [packages/transform/src/Transform.ts:266](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L266)

Replace a range of the document with a given slice, using
`from`, `to`, and the slice's
[`openStart`](#model.Slice.openStart) property as hints, rather
than fixed start and end points. This method may grow the
replaced area or close open nodes in the slice in order to get a
fit that is more in line with WYSIWYG expectations, by dropping
fully covered parent nodes of the replaced region when they are
marked [non-defining as
context](#model.NodeSpec.definingAsContext), or including an
open parent node from the slice that _is_ marked as [defining
its content](#model.NodeSpec.definingForContent).

This is the method, for example, to handle paste. The similar
[`replace`](#transform.Transform.replace) method is a more
primitive tool which will _not_ move the start and end of its given
range, and is useful in situations where you need more precise
control over what happens.

#### Parameters

| Parameter | Type     | Description                          |
| --------- | -------- | ------------------------------------ |
| `from`    | `number` | The start position (used as a hint). |
| `to`      | `number` | The end position (used as a hint).   |
| `slice`   | `Slice`  | The slice to insert.                 |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.replaceRange;
```

---

### replaceRangeWith()

```ts
replaceRangeWith(
   from,
   to,
   node): this;
```

Defined in: [packages/transform/src/Transform.ts:284](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L284)

Replace the given range with a node, but use `from` and `to` as
hints, rather than precise positions. When from and to are the same
and are at the start or end of a parent node in which the given
node doesn't fit, this method may _move_ them out towards a parent
that does allow the given node to be placed. When the given range
completely covers a parent node, this method may completely replace
that parent node.

#### Parameters

| Parameter | Type     | Description                          |
| --------- | -------- | ------------------------------------ |
| `from`    | `number` | The start position (used as a hint). |
| `to`      | `number` | The end position (used as a hint).   |
| `node`    | `Node_2` | The node to insert.                  |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.replaceRangeWith;
```

---

### replaceWith()

```ts
replaceWith(
   from,
   to,
   content): this;
```

Defined in: [packages/transform/src/Transform.ts:216](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L216)

Replace the given range with the given content, which may be a
fragment, node, or array of nodes.

#### Parameters

| Parameter | Type                                          | Description                                                |
| --------- | --------------------------------------------- | ---------------------------------------------------------- |
| `from`    | `number`                                      | The start position of the range to replace.                |
| `to`      | `number`                                      | The end position of the range to replace.                  |
| `content` | `Node_2` \| `Fragment` \| readonly `Node_2`[] | The content to insert (fragment, node, or array of nodes). |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.replaceWith;
```

---

### setBlockType()

```ts
setBlockType(
   from,
   to?,
   type,
   attrs?): this;
```

Defined in: [packages/transform/src/Transform.ts:351](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L351)

Set the type of all textblocks (partly) between `from` and `to` to
the given node type with the given attributes.

#### Parameters

| Parameter | Type                                                                           | Default value | Description                                                                                        |
| --------- | ------------------------------------------------------------------------------ | ------------- | -------------------------------------------------------------------------------------------------- |
| `from`    | `number`                                                                       | `undefined`   | The start position of the range.                                                                   |
| `to`      | `number`                                                                       | `from`        | The end position of the range. Defaults to `from`.                                                 |
| `type`    | `NodeType`                                                                     | `undefined`   | The node type to set.                                                                              |
| `attrs`   | \| `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; \| (`oldNode`) => `Attrs` | `null`        | The attributes to set, or a function that computes attributes from the old node. Defaults to null. |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.setBlockType;
```

---

### setDocAttribute()

```ts
setDocAttribute(attr, value): this;
```

Defined in: [packages/transform/src/Transform.ts:396](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L396)

Set a single attribute on the document to a new value.

#### Parameters

| Parameter | Type        | Description                       |
| --------- | ----------- | --------------------------------- |
| `attr`    | `string`    | The name of the attribute to set. |
| `value`   | `AttrValue` | The new value for the attribute.  |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.setDocAttribute;
```

---

### setNodeAttribute()

```ts
setNodeAttribute(
   pos,
   attr,
   value): this;
```

Defined in: [packages/transform/src/Transform.ts:385](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L385)

Set a single attribute on a given node to a new value.
The `pos` addresses the document content. Use `setDocAttribute`
to set attributes on the document itself.

#### Parameters

| Parameter | Type        | Description                       |
| --------- | ----------- | --------------------------------- |
| `pos`     | `number`    | The position of the node.         |
| `attr`    | `string`    | The name of the attribute to set. |
| `value`   | `AttrValue` | The new value for the attribute.  |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.setNodeAttribute;
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

Defined in: [packages/transform/src/Transform.ts:368](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L368)

Change the type, attributes, and/or marks of the node at `pos`.
When `type` isn't given, the existing node type is preserved.

#### Parameters

| Parameter | Type                                              | Default value | Description                                                  |
| --------- | ------------------------------------------------- | ------------- | ------------------------------------------------------------ |
| `pos`     | `number`                                          | `undefined`   | The position of the node to modify.                          |
| `type?`   | `NodeType`                                        | `undefined`   | The new node type, or null to keep the existing type.        |
| `attrs?`  | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; | `null`        | The new attributes, or null to keep the existing attributes. |
| `marks?`  | readonly `Mark`[]                                 | `undefined`   | The new marks to apply to the node.                          |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.setNodeMarkup;
```

---

### split()

```ts
split(
   pos,
   depth?,
   typesAfter?): this;
```

Defined in: [packages/transform/src/Transform.ts:463](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L463)

Split the node at the given position, and optionally, if `depth` is
greater than one, any number of nodes above that. By default, the
parts split off will inherit the node type of the original node.
This can be changed by passing an array of types and attributes to
use after the split (with the outermost nodes coming first).

#### Parameters

| Parameter     | Type                                                                                     | Default value | Description                                                             |
| ------------- | ---------------------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------- |
| `pos`         | `number`                                                                                 | `undefined`   | The position at which to split.                                         |
| `depth`       | `number`                                                                                 | `1`           | The number of levels to split. Defaults to 1.                           |
| `typesAfter?` | \{ `attrs?`: `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;; `type`: `NodeType`; \}[] | `undefined`   | Optional array of node types and attributes to use for the split nodes. |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.split;
```

---

### step()

```ts
step(step): this;
```

Defined in: [packages/transform/src/Transform.ts:128](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L128)

Apply a new step in this transform, saving the result. Throws an
error when the step fails.

#### Parameters

| Parameter | Type     | Description        |
| --------- | -------- | ------------------ |
| `step`    | `PmStep` | The step to apply. |

#### Returns

`this`

This transform instance for chaining.

#### Throws

When the step fails to apply.

#### Implementation of

```ts
TransformDocument.step;
```

---

### wrap()

```ts
wrap(range, wrappers): this;
```

Defined in: [packages/transform/src/Transform.ts:336](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L336)

Wrap the given [range](#model.NodeRange) in the given set of wrappers.
The wrappers are assumed to be valid in this position, and should
probably be computed with [`findWrapping`](#transform.findWrapping).

#### Parameters

| Parameter  | Type                                                                                              | Description                                       |
| ---------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `range`    | `NodeRange`                                                                                       | The range to wrap.                                |
| `wrappers` | readonly \{ `attrs?`: `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;; `type`: `NodeType`; \}[] | The wrapper nodes to apply, with outermost first. |

#### Returns

`this`

This transform instance for chaining.

#### Implementation of

```ts
TransformDocument.wrap;
```

[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/editor-types](../../../../README.md) / [types/transform/TransformDocument](../README.md) / TransformDocument

# Interface: TransformDocument

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:25](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L25)

Abstraction to build up and track an array of
[steps](#transform.Step) representing a document transformation.

Most transforming methods return the `Transform` object itself, so
that they can be chained.

## Extended by

- [`PmTransaction`](../../../state/PmTransaction/interfaces/PmTransaction.md)

## Properties

| Property                                      | Modifier   | Type                                                     | Defined in                                                                                                                                                                                                                |
| --------------------------------------------- | ---------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-before"></a> `before`         | `readonly` | `Node_2`                                                 | [packages/editor-types/src/types/transform/TransformDocument.ts:30](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L30) |
| <a id="property-doc"></a> `doc`               | `readonly` | `Node_2`                                                 | [packages/editor-types/src/types/transform/TransformDocument.ts:26](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L26) |
| <a id="property-docchanged"></a> `docChanged` | `readonly` | `boolean`                                                | [packages/editor-types/src/types/transform/TransformDocument.ts:31](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L31) |
| <a id="property-docs"></a> `docs`             | `readonly` | readonly `Node_2`[]                                      | [packages/editor-types/src/types/transform/TransformDocument.ts:28](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L28) |
| <a id="property-mapping"></a> `mapping`       | `readonly` | [`PmMapping`](../../PmMapping/interfaces/PmMapping.md)   | [packages/editor-types/src/types/transform/TransformDocument.ts:29](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L29) |
| <a id="property-steps"></a> `steps`           | `readonly` | readonly [`PmStep`](../../PmStep/interfaces/PmStep.md)[] | [packages/editor-types/src/types/transform/TransformDocument.ts:27](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L27) |

## Methods

### addMark()

```ts
addMark(
   from,
   to,
   mark): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:269](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L269)

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

---

### addNodeMark()

```ts
addNodeMark(position, mark): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:235](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L235)

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

---

### addStep()

```ts
addStep(step, doc): void;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:56](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L56)

Add a step to the transform without applying it (assumes it has already been applied).
Updates the internal state to track the step and its resulting document.

#### Parameters

| Parameter | Type                                          | Description                                     |
| --------- | --------------------------------------------- | ----------------------------------------------- |
| `step`    | [`PmStep`](../../PmStep/interfaces/PmStep.md) | The step that was applied.                      |
| `doc`     | `Node_2`                                      | The resulting document after applying the step. |

#### Returns

`void`

---

### clearIncompatible()

```ts
clearIncompatible(
   position,
   parentType,
   match?): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:295](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L295)

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

---

### delete()

```ts
delete(from, to): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:89](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L89)

Delete the content between the given positions.

#### Parameters

| Parameter | Type     | Description                                |
| --------- | -------- | ------------------------------------------ |
| `from`    | `number` | The start position of the range to delete. |
| `to`      | `number` | The end position of the range to delete.   |

#### Returns

`this`

This transform instance for chaining.

---

### deleteRange()

```ts
deleteRange(from, to): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:147](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L147)

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

---

### insert()

```ts
insert(pos, content): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:97](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L97)

Insert the given content at the given position.

#### Parameters

| Parameter | Type                                          | Description                                                |
| --------- | --------------------------------------------- | ---------------------------------------------------------- |
| `pos`     | `number`                                      | The position at which to insert the content.               |
| `content` | `Node_2` \| readonly `Node_2`[] \| `Fragment` | The content to insert (fragment, node, or array of nodes). |

#### Returns

`this`

This transform instance for chaining.

---

### join()

```ts
join(pos, depth?): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:168](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L168)

Join the blocks around the given position. If depth is 2, their
last and first siblings are also joined, and so on.

#### Parameters

| Parameter | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `pos`     | `number` | The position around which to join blocks.    |
| `depth?`  | `number` | The number of levels to join. Defaults to 1. |

#### Returns

`this`

This transform instance for chaining.

---

### lift()

```ts
lift(range, target): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:159](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L159)

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

---

### maybeStep()

```ts
maybeStep(step): PmStepResult;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:48](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L48)

Try to apply a step in this transformation, ignoring it if it
fails. Returns the step result.

#### Parameters

| Parameter | Type                                          | Description               |
| --------- | --------------------------------------------- | ------------------------- |
| `step`    | [`PmStep`](../../PmStep/interfaces/PmStep.md) | The step to try applying. |

#### Returns

[`PmStepResult`](../../PmStepResult/interfaces/PmStepResult.md)

The result of applying the step, which may indicate failure.

---

### removeMark()

```ts
removeMark(
   from,
   to,
   mark?): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:281](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L281)

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

---

### removeNodeMark()

```ts
removeNodeMark(position, mark): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:245](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L245)

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

---

### replace()

```ts
replace(
   from,
   to?,
   slice?): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:67](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L67)

Replace the part of the document between `from` and `to` with the
given `slice`. No-op replacements (empty slice over empty range) are
silently ignored.

#### Parameters

| Parameter | Type     | Description                                                   |
| --------- | -------- | ------------------------------------------------------------- |
| `from`    | `number` | The start position of the range to replace.                   |
| `to?`     | `number` | The end position of the range to replace. Defaults to `from`. |
| `slice?`  | `Slice`  | The slice to insert. Defaults to an empty slice.              |

#### Returns

`this`

This transform instance for chaining.

---

### replaceRange()

```ts
replaceRange(
   from,
   to,
   slice): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:123](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L123)

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

---

### replaceRangeWith()

```ts
replaceRangeWith(
   from,
   to,
   node): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:138](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L138)

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

---

### replaceWith()

```ts
replaceWith(
   from,
   to,
   content): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:79](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L79)

Replace the given range with the given content, which may be a
fragment, node, or array of nodes.

#### Parameters

| Parameter | Type                                          | Description                                                |
| --------- | --------------------------------------------- | ---------------------------------------------------------- |
| `from`    | `number`                                      | The start position of the range to replace.                |
| `to`      | `number`                                      | The end position of the range to replace.                  |
| `content` | `Node_2` \| readonly `Node_2`[] \| `Fragment` | The content to insert (fragment, node, or array of nodes). |

#### Returns

`this`

This transform instance for chaining.

---

### setBlockType()

```ts
setBlockType(
   from,
   to?,
   type?,
   attrs?): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:190](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L190)

Set the type of all textblocks (partly) between `from` and `to` to
the given node type with the given attributes.

#### Parameters

| Parameter | Type                                                                           | Description                                                                                        |
| --------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `from`    | `number`                                                                       | The start position of the range.                                                                   |
| `to?`     | `number`                                                                       | The end position of the range. Defaults to `from`.                                                 |
| `type?`   | `NodeType`                                                                     | The node type to set.                                                                              |
| `attrs?`  | \| `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; \| (`oldNode`) => `Attrs` | The attributes to set, or a function that computes attributes from the old node. Defaults to null. |

#### Returns

`this`

This transform instance for chaining.

---

### setDocAttribute()

```ts
setDocAttribute(attr, value): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:226](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L226)

Set a single attribute on the document to a new value.

#### Parameters

| Parameter | Type                                                     | Description                       |
| --------- | -------------------------------------------------------- | --------------------------------- |
| `attr`    | `string`                                                 | The name of the attribute to set. |
| `value`   | [`AttrValue`](../../AttrValue/type-aliases/AttrValue.md) | The new value for the attribute.  |

#### Returns

`this`

This transform instance for chaining.

---

### setNodeAttribute()

```ts
setNodeAttribute(
   pos,
   attr,
   value): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:218](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L218)

Set a single attribute on a given node to a new value.
The `pos` addresses the document content. Use `setDocAttribute`
to set attributes on the document itself.

#### Parameters

| Parameter | Type                                                     | Description                       |
| --------- | -------------------------------------------------------- | --------------------------------- |
| `pos`     | `number`                                                 | The position of the node.         |
| `attr`    | `string`                                                 | The name of the attribute to set. |
| `value`   | [`AttrValue`](../../AttrValue/type-aliases/AttrValue.md) | The new value for the attribute.  |

#### Returns

`this`

This transform instance for chaining.

---

### setNodeMarkup()

```ts
setNodeMarkup(
   pos,
   type?,
   attrs?,
   marks?): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:204](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L204)

Change the type, attributes, and/or marks of the node at `pos`.
When `type` isn't given, the existing node type is preserved.

#### Parameters

| Parameter | Type                                              | Description                                                  |
| --------- | ------------------------------------------------- | ------------------------------------------------------------ |
| `pos`     | `number`                                          | The position of the node to modify.                          |
| `type?`   | `NodeType`                                        | The new node type, or null to keep the existing type.        |
| `attrs?`  | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; | The new attributes, or null to keep the existing attributes. |
| `marks?`  | readonly `Mark`[]                                 | The new marks to apply to the node.                          |

#### Returns

`this`

This transform instance for chaining.

---

### split()

```ts
split(
   pos,
   depth?,
   typesAfter?): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:258](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L258)

Split the node at the given position, and optionally, if `depth` is
greater than one, any number of nodes above that. By default, the
parts split off will inherit the node type of the original node.
This can be changed by passing an array of types and attributes to
use after the split (with the outermost nodes coming first).

#### Parameters

| Parameter     | Type                                                                                     | Description                                                             |
| ------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `pos`         | `number`                                                                                 | The position at which to split.                                         |
| `depth?`      | `number`                                                                                 | The number of levels to split. Defaults to 1.                           |
| `typesAfter?` | \{ `attrs?`: `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;; `type`: `NodeType`; \}[] | Optional array of node types and attributes to use for the split nodes. |

#### Returns

`this`

This transform instance for chaining.

---

### step()

```ts
step(step): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:40](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L40)

Apply a new step in this transform, saving the result. Throws an
error when the step fails.

#### Parameters

| Parameter | Type                                          | Description        |
| --------- | --------------------------------------------- | ------------------ |
| `step`    | [`PmStep`](../../PmStep/interfaces/PmStep.md) | The step to apply. |

#### Returns

`this`

This transform instance for chaining.

#### Throws

When the step fails to apply.

---

### wrap()

```ts
wrap(range, wrappers): this;
```

Defined in: [packages/editor-types/src/types/transform/TransformDocument.ts:178](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/editor-types/src/types/transform/TransformDocument.ts#L178)

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

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-steps/ReplaceAroundStep](../README.md) / ReplaceAroundStep

# Class: ReplaceAroundStep

Defined in: [packages/transform/src/change-steps/ReplaceAroundStep.ts:17](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/ReplaceAroundStep.ts#L17)

Replace a part of the document with a slice of content, but
preserve a range of the replaced content by moving it into the
slice.

## Extends

- [`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md)

## Constructors

### Constructor

```ts
new ReplaceAroundStep(
   from,
   to,
   gapFrom,
   gapTo,
   slice,
   insert,
   structure?): ReplaceAroundStep;
```

Defined in: [packages/transform/src/change-steps/ReplaceAroundStep.ts:42](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/ReplaceAroundStep.ts#L42)

Create a replace-around step with the given range and gap.
`insert` should be the point in the slice into which the content
of the gap should be moved. `structure` has the same meaning as
it has in the [`ReplaceStep`](#transform.ReplaceStep) class.

#### Parameters

| Parameter   | Type      | Default value | Description                                                                                                       |
| ----------- | --------- | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| `from`      | `number`  | `undefined`   | The start position of the replaced range.                                                                         |
| `to`        | `number`  | `undefined`   | The end position of the replaced range.                                                                           |
| `gapFrom`   | `number`  | `undefined`   | The start of preserved range.                                                                                     |
| `gapTo`     | `number`  | `undefined`   | The end of preserved range.                                                                                       |
| `slice`     | `Slice`   | `undefined`   | The slice to insert.                                                                                              |
| `insert`    | `number`  | `undefined`   | The position in the slice where the preserved range should be inserted.                                           |
| `structure` | `boolean` | `false`       | When true, the step will fail if the content around the gap is not just a sequence of closing and opening tokens. |

#### Returns

`ReplaceAroundStep`

#### Overrides

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`constructor`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#constructor)

## Methods

### apply()

```ts
apply(doc): StepResult;
```

Defined in: [packages/transform/src/change-steps/ReplaceAroundStep.ts:85](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/ReplaceAroundStep.ts#L85)

Apply this step to the given document, returning a result object.

#### Parameters

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `doc`     | `Node_2` | The document to apply the step to. |

#### Returns

[`StepResult`](../../StepResult/classes/StepResult.md)

The result of applying the step.

#### Overrides

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`apply`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#apply)

---

### contentBetween()

```ts
protected contentBetween(
   doc,
   from,
   to): boolean;
```

Defined in: [packages/transform/src/change-steps/AbstractReplaceStep.ts:22](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/AbstractReplaceStep.ts#L22)

Check if there is content between two positions in the document
that would interfere with a structure-preserving replace operation.

#### Parameters

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `doc`     | `Node_2` | The document node to check. |
| `from`    | `number` | The start position.         |
| `to`      | `number` | The end position.           |

#### Returns

`boolean`

True if there is interfering content, false otherwise.

#### Inherited from

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`contentBetween`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#contentbetween)

---

### getMap()

```ts
getMap(): StepMap;
```

Defined in: [packages/transform/src/change-steps/ReplaceAroundStep.ts:110](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/ReplaceAroundStep.ts#L110)

Get the step map that represents the changes made by this step.

#### Returns

[`StepMap`](../../../change-map/StepMap/classes/StepMap.md)

A step map describing the position changes.

#### Overrides

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`getMap`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#getmap)

---

### invert()

```ts
invert(doc): ReplaceAroundStep;
```

Defined in: [packages/transform/src/change-steps/ReplaceAroundStep.ts:127](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/ReplaceAroundStep.ts#L127)

Create an inverted version of this step that undoes the replace-around operation.

#### Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `doc`     | `Node_2` | The document the step was applied to. |

#### Returns

`ReplaceAroundStep`

A new step that undoes this step.

#### Overrides

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`invert`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#invert)

---

### map()

```ts
map(mapping): ReplaceAroundStep;
```

Defined in: [packages/transform/src/change-steps/ReplaceAroundStep.ts:147](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/ReplaceAroundStep.ts#L147)

Map this step through a mappable object, adjusting its positions.

#### Parameters

| Parameter | Type       | Description           |
| --------- | ---------- | --------------------- |
| `mapping` | `Mappable` | The mapping to apply. |

#### Returns

`ReplaceAroundStep`

A new mapped step, or null if the step was entirely deleted or became invalid.

#### Overrides

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`map`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#map)

---

### mapFragment()

```ts
protected mapFragment(
   fragment,
   callbackFunc,
   parent): Fragment;
```

Defined in: [packages/transform/src/change-steps/Step.ts:144](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/Step.ts#L144)

Recursively map over inline nodes in a fragment, applying a callback function.

This function walks through all nodes in a fragment and its nested content,
applying the callback function to inline nodes. Non-inline nodes are processed
recursively to handle their content, but the callback is only applied to inline nodes.

#### Parameters

| Parameter      | Type                                 | Description                                                                                                                                |
| -------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `fragment`     | `Fragment`                           | The fragment to map over.                                                                                                                  |
| `callbackFunc` | (`child`, `parent`, `i`) => `Node_2` | Function to apply to each inline node. Receives the child node, parent node, and child index as parameters and returns a transformed node. |
| `parent`       | `Node_2`                             | The parent node context for the fragment.                                                                                                  |

#### Returns

`Fragment`

A new fragment with transformed nodes, preserving the structure.

#### Inherited from

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`mapFragment`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#mapfragment)

---

### merge()

```ts
merge(_other): Step;
```

Defined in: [packages/transform/src/change-steps/Step.ts:117](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/Step.ts#L117)

Try to merge this step with another one, to be applied directly
after it. Returns the merged step when possible, null if the
steps can't be merged.

#### Parameters

| Parameter | Type                                 | Description             |
| --------- | ------------------------------------ | ----------------------- |
| `_other`  | [`Step`](../../Step/classes/Step.md) | The step to merge with. |

#### Returns

[`Step`](../../Step/classes/Step.md)

The merged step, or null if the steps can't be merged.

#### Inherited from

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`merge`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#merge)

---

### toJSON()

```ts
toJSON(): ReplaceAroundStepJSON;
```

Defined in: [packages/transform/src/change-steps/ReplaceAroundStep.ts:178](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/ReplaceAroundStep.ts#L178)

Create a JSON-serializable representation of this step.

#### Returns

[`ReplaceAroundStepJSON`](../../../types/json/ReplaceAroundStepJSON/interfaces/ReplaceAroundStepJSON.md)

The JSON representation of this step.

#### Overrides

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`toJSON`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#tojson)

---

### fromJSON()

```ts
static fromJSON(schema, json): ReplaceAroundStep;
```

Defined in: [packages/transform/src/change-steps/ReplaceAroundStep.ts:66](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/ReplaceAroundStep.ts#L66)

Deserialize a replace-around step from its JSON representation.

#### Parameters

| Parameter | Type                                                                                                     | Description                                    |
| --------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `schema`  | `Schema`                                                                                                 | The schema to use for deserializing the slice. |
| `json`    | [`ReplaceAroundStepJSON`](../../../types/json/ReplaceAroundStepJSON/interfaces/ReplaceAroundStepJSON.md) | The JSON representation of the step.           |

#### Returns

`ReplaceAroundStep`

A new ReplaceAroundStep instance.

#### Overrides

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`fromJSON`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#fromjson)

---

### registerStep()

```ts
static registerStep(jsonId, stepClass): void;
```

Defined in: [packages/transform/src/change-steps/Step.ts:61](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/Step.ts#L61)

To be able to serialize steps to JSON, each step needs a string
ID to attach to its JSON representation. Use this method to
register an ID for your step classes. Try to pick something
that's unlikely to clash with steps from other modules.

#### Parameters

| Parameter   | Type                                                                | Description                                   |
| ----------- | ------------------------------------------------------------------- | --------------------------------------------- |
| `jsonId`    | `string`                                                            | -                                             |
| `stepClass` | [`StepImplementation`](../../Step/interfaces/StepImplementation.md) | The step class with a fromJSON static method. |

#### Returns

`void`

#### Throws

If the ID is already registered.

#### Inherited from

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`registerStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#registerstep)

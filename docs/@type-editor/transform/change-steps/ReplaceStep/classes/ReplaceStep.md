[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-steps/ReplaceStep](../README.md) / ReplaceStep

# Class: ReplaceStep

Defined in: [packages/transform/src/change-steps/ReplaceStep.ts:15](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/ReplaceStep.ts#L15)

Replace a part of the document with a slice of new content.

## Extends

- [`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md)

## Constructors

### Constructor

```ts
new ReplaceStep(
   from,
   to,
   slice,
   structure?): ReplaceStep;
```

Defined in: [packages/transform/src/change-steps/ReplaceStep.ts:36](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/ReplaceStep.ts#L36)

The given `slice` should fit the 'gap' between `from` and
`to`—the depths must line up, and the surrounding nodes must be
able to be joined with the open sides of the slice. When
`structure` is true, the step will fail if the content between
from and to is not just a sequence of closing and then opening
tokens (this is to guard against rebased replace steps
overwriting something they weren't supposed to).

#### Parameters

| Parameter   | Type      | Default value | Description                                                                                                            |
| ----------- | --------- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `from`      | `number`  | `undefined`   | The start position of the replaced range.                                                                              |
| `to`        | `number`  | `undefined`   | The end position of the replaced range.                                                                                |
| `slice`     | `Slice`   | `undefined`   | The slice to insert.                                                                                                   |
| `structure` | `boolean` | `false`       | When true, the step will fail if the content between from and to is not just a sequence of closing and opening tokens. |

#### Returns

`ReplaceStep`

#### Overrides

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`constructor`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#constructor)

## Accessors

### from

#### Get Signature

```ts
get from(): number;
```

Defined in: [packages/transform/src/change-steps/ReplaceStep.ts:50](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/ReplaceStep.ts#L50)

The start position of the replaced range.

##### Returns

`number`

---

### slice

#### Get Signature

```ts
get slice(): Slice;
```

Defined in: [packages/transform/src/change-steps/ReplaceStep.ts:64](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/ReplaceStep.ts#L64)

The slice to insert.

##### Returns

`Slice`

---

### to

#### Get Signature

```ts
get to(): number;
```

Defined in: [packages/transform/src/change-steps/ReplaceStep.ts:57](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/ReplaceStep.ts#L57)

The end position of the replaced range.

##### Returns

`number`

## Methods

### apply()

```ts
apply(doc): StepResult;
```

Defined in: [packages/transform/src/change-steps/ReplaceStep.ts:93](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/ReplaceStep.ts#L93)

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

Defined in: [packages/transform/src/change-steps/AbstractReplaceStep.ts:22](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/AbstractReplaceStep.ts#L22)

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

Defined in: [packages/transform/src/change-steps/ReplaceStep.ts:106](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/ReplaceStep.ts#L106)

Get the step map that represents the changes made by this step.

#### Returns

[`StepMap`](../../../change-map/StepMap/classes/StepMap.md)

A step map describing the position changes.

#### Overrides

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`getMap`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#getmap)

---

### invert()

```ts
invert(doc): ReplaceStep;
```

Defined in: [packages/transform/src/change-steps/ReplaceStep.ts:116](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/ReplaceStep.ts#L116)

Create an inverted version of this step that undoes the replacement.

#### Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `doc`     | `Node_2` | The document the step was applied to. |

#### Returns

`ReplaceStep`

A new step that undoes this step.

#### Overrides

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`invert`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#invert)

---

### map()

```ts
map(mapping): ReplaceStep;
```

Defined in: [packages/transform/src/change-steps/ReplaceStep.ts:126](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/ReplaceStep.ts#L126)

Map this step through a mappable object, adjusting its positions.

#### Parameters

| Parameter | Type       | Description           |
| --------- | ---------- | --------------------- |
| `mapping` | `Mappable` | The mapping to apply. |

#### Returns

`ReplaceStep`

A new mapped step, or null if the step was entirely deleted.

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

Defined in: [packages/transform/src/change-steps/Step.ts:144](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/Step.ts#L144)

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
merge(other): ReplaceStep;
```

Defined in: [packages/transform/src/change-steps/ReplaceStep.ts:143](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/ReplaceStep.ts#L143)

Try to merge this step with another step. Returns the merged step if possible.

#### Parameters

| Parameter | Type                                 | Description             |
| --------- | ------------------------------------ | ----------------------- |
| `other`   | [`Step`](../../Step/classes/Step.md) | The step to merge with. |

#### Returns

`ReplaceStep`

A merged step if the steps can be merged, or null otherwise.

#### Overrides

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`merge`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#merge)

---

### toJSON()

```ts
toJSON(): ReplaceStepJSON;
```

Defined in: [packages/transform/src/change-steps/ReplaceStep.ts:179](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/ReplaceStep.ts#L179)

Create a JSON-serializable representation of this step.

#### Returns

[`ReplaceStepJSON`](../../../types/json/ReplaceStepJSON/interfaces/ReplaceStepJSON.md)

The JSON representation of this step.

#### Overrides

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`toJSON`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#tojson)

---

### fromJSON()

```ts
static fromJSON(schema, json): ReplaceStep;
```

Defined in: [packages/transform/src/change-steps/ReplaceStep.ts:75](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/ReplaceStep.ts#L75)

Deserialize a replace step from its JSON representation.

#### Parameters

| Parameter | Type                                                                                   | Description                                    |
| --------- | -------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `schema`  | `Schema`                                                                               | The schema to use for deserializing the slice. |
| `json`    | [`ReplaceStepJSON`](../../../types/json/ReplaceStepJSON/interfaces/ReplaceStepJSON.md) | The JSON representation of the step.           |

#### Returns

`ReplaceStep`

A new ReplaceStep instance.

#### Overrides

[`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md).[`fromJSON`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md#fromjson)

---

### registerStep()

```ts
static registerStep(jsonId, stepClass): void;
```

Defined in: [packages/transform/src/change-steps/Step.ts:61](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/Step.ts#L61)

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

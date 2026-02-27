[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-steps/AbstractReplaceStep](../README.md) / AbstractReplaceStep

# Abstract Class: AbstractReplaceStep

Defined in: [packages/transform/src/change-steps/AbstractReplaceStep.ts:11](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/AbstractReplaceStep.ts#L11)

Base class for replace steps, providing common functionality
for checking content structure between positions.

## Extends

- [`Step`](../../Step/classes/Step.md)

## Extended by

- [`ReplaceAroundStep`](../../ReplaceAroundStep/classes/ReplaceAroundStep.md)
- [`ReplaceStep`](../../ReplaceStep/classes/ReplaceStep.md)

## Constructors

### Constructor

```ts
new AbstractReplaceStep(): AbstractReplaceStep;
```

#### Returns

`AbstractReplaceStep`

#### Inherited from

[`Step`](../../Step/classes/Step.md).[`constructor`](../../Step/classes/Step.md#constructor)

## Methods

### apply()

```ts
abstract apply(doc): StepResult;
```

Defined in: [packages/transform/src/change-steps/Step.ts:77](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/Step.ts#L77)

Applies this step to the given document, returning a result
object that either indicates failure, if the step can not be
applied to this document, or indicates success by containing a
transformed document.

#### Parameters

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `doc`     | `Node_2` | The document to apply the step to. |

#### Returns

[`StepResult`](../../StepResult/classes/StepResult.md)

A StepResult indicating success or failure.

#### Inherited from

[`Step`](../../Step/classes/Step.md).[`apply`](../../Step/classes/Step.md#apply)

---

### contentBetween()

```ts
protected contentBetween(
   doc,
   from,
   to): boolean;
```

Defined in: [packages/transform/src/change-steps/AbstractReplaceStep.ts:22](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/AbstractReplaceStep.ts#L22)

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

---

### getMap()

```ts
getMap(): StepMap;
```

Defined in: [packages/transform/src/change-steps/Step.ts:86](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/Step.ts#L86)

Get the step map that represents the changes made by this step,
and which can be used to transform between positions in the old
and the new document.

#### Returns

[`StepMap`](../../../change-map/StepMap/classes/StepMap.md)

A StepMap describing the position changes, or StepMap.empty if no changes.

#### Inherited from

[`Step`](../../Step/classes/Step.md).[`getMap`](../../Step/classes/Step.md#getmap)

---

### invert()

```ts
abstract invert(doc): Step;
```

Defined in: [packages/transform/src/change-steps/Step.ts:97](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/Step.ts#L97)

Create an inverted version of this step. Needs the document as it
was before the step as argument.

#### Parameters

| Parameter | Type     | Description                                |
| --------- | -------- | ------------------------------------------ |
| `doc`     | `Node_2` | The document before this step was applied. |

#### Returns

[`Step`](../../Step/classes/Step.md)

An inverted step that undoes this step.

#### Inherited from

[`Step`](../../Step/classes/Step.md).[`invert`](../../Step/classes/Step.md#invert)

---

### map()

```ts
abstract map(mapping): Step;
```

Defined in: [packages/transform/src/change-steps/Step.ts:107](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/Step.ts#L107)

Map this step through a mappable thing, returning either a
version of that step with its positions adjusted, or `null` if
the step was entirely deleted by the mapping.

#### Parameters

| Parameter | Type       | Description                         |
| --------- | ---------- | ----------------------------------- |
| `mapping` | `Mappable` | The mappable object to map through. |

#### Returns

[`Step`](../../Step/classes/Step.md)

The mapped step, or null if the step was deleted by the mapping.

#### Inherited from

[`Step`](../../Step/classes/Step.md).[`map`](../../Step/classes/Step.md#map)

---

### mapFragment()

```ts
protected mapFragment(
   fragment,
   callbackFunc,
   parent): Fragment;
```

Defined in: [packages/transform/src/change-steps/Step.ts:144](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/Step.ts#L144)

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

[`Step`](../../Step/classes/Step.md).[`mapFragment`](../../Step/classes/Step.md#mapfragment)

---

### merge()

```ts
merge(_other): Step;
```

Defined in: [packages/transform/src/change-steps/Step.ts:117](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/Step.ts#L117)

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

[`Step`](../../Step/classes/Step.md).[`merge`](../../Step/classes/Step.md#merge)

---

### toJSON()

```ts
abstract toJSON(): StepJSON;
```

Defined in: [packages/transform/src/change-steps/Step.ts:129](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/Step.ts#L129)

Create a JSON-serializable representation of this step. When
defining this for a custom subclass, make sure the result object
includes the step type's [JSON id](#transform.Step^jsonID) under
the `stepType` property.

#### Returns

`StepJSON`

A JSON representation of this step.

#### Inherited from

[`Step`](../../Step/classes/Step.md).[`toJSON`](../../Step/classes/Step.md#tojson)

---

### fromJSON()

```ts
static fromJSON(schema, json): Step;
```

Defined in: [packages/transform/src/change-steps/Step.ts:36](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/Step.ts#L36)

Deserialize a step from its JSON representation. Will call
through to the step class' own implementation of this method.

#### Parameters

| Parameter | Type       | Description                            |
| --------- | ---------- | -------------------------------------- |
| `schema`  | `Schema`   | The schema to use for deserialization. |
| `json`    | `StepJSON` | The JSON representation of the step.   |

#### Returns

[`Step`](../../Step/classes/Step.md)

The deserialized step.

#### Throws

If the JSON is invalid or the step type is not registered.

#### Inherited from

[`Step`](../../Step/classes/Step.md).[`fromJSON`](../../Step/classes/Step.md#fromjson)

---

### registerStep()

```ts
static registerStep(jsonId, stepClass): void;
```

Defined in: [packages/transform/src/change-steps/Step.ts:61](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/Step.ts#L61)

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

[`Step`](../../Step/classes/Step.md).[`registerStep`](../../Step/classes/Step.md#registerstep)

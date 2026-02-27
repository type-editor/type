[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-steps/Step](../README.md) / Step

# Abstract Class: Step

Defined in: [packages/transform/src/change-steps/Step.ts:23](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/Step.ts#L23)

A step object represents an atomic change. It generally applies
only to the document it was created for, since the positions
stored in it will only make sense for that document.

New steps are defined by creating classes that extend `Step`,
overriding the `apply`, `invert`, `map`, `getMap` and `fromJSON`
methods, and registering your class with a unique
JSON-serialization identifier using
[`Step.jsonID`](#transform.Step^jsonID).

## Extended by

- [`AbstractReplaceStep`](../../AbstractReplaceStep/classes/AbstractReplaceStep.md)
- [`AddMarkStep`](../../AddMarkStep/classes/AddMarkStep.md)
- [`AddNodeMarkStep`](../../AddNodeMarkStep/classes/AddNodeMarkStep.md)
- [`AttrStep`](../../AttrStep/classes/AttrStep.md)
- [`DocAttrStep`](../../DocAttrStep/classes/DocAttrStep.md)
- [`RemoveMarkStep`](../../RemoveMarkStep/classes/RemoveMarkStep.md)
- [`RemoveNodeMarkStep`](../../RemoveNodeMarkStep/classes/RemoveNodeMarkStep.md)

## Implements

- `PmStep`

## Constructors

### Constructor

```ts
new Step(): Step;
```

#### Returns

`Step`

## Methods

### apply()

```ts
abstract apply(doc): StepResult;
```

Defined in: [packages/transform/src/change-steps/Step.ts:77](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/Step.ts#L77)

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

#### Implementation of

```ts
PmStep.apply;
```

---

### getMap()

```ts
getMap(): StepMap;
```

Defined in: [packages/transform/src/change-steps/Step.ts:86](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/Step.ts#L86)

Get the step map that represents the changes made by this step,
and which can be used to transform between positions in the old
and the new document.

#### Returns

[`StepMap`](../../../change-map/StepMap/classes/StepMap.md)

A StepMap describing the position changes, or StepMap.empty if no changes.

#### Implementation of

```ts
PmStep.getMap;
```

---

### invert()

```ts
abstract invert(doc): Step;
```

Defined in: [packages/transform/src/change-steps/Step.ts:97](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/Step.ts#L97)

Create an inverted version of this step. Needs the document as it
was before the step as argument.

#### Parameters

| Parameter | Type     | Description                                |
| --------- | -------- | ------------------------------------------ |
| `doc`     | `Node_2` | The document before this step was applied. |

#### Returns

`Step`

An inverted step that undoes this step.

#### Implementation of

```ts
PmStep.invert;
```

---

### map()

```ts
abstract map(mapping): Step;
```

Defined in: [packages/transform/src/change-steps/Step.ts:107](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/Step.ts#L107)

Map this step through a mappable thing, returning either a
version of that step with its positions adjusted, or `null` if
the step was entirely deleted by the mapping.

#### Parameters

| Parameter | Type       | Description                         |
| --------- | ---------- | ----------------------------------- |
| `mapping` | `Mappable` | The mappable object to map through. |

#### Returns

`Step`

The mapped step, or null if the step was deleted by the mapping.

#### Implementation of

```ts
PmStep.map;
```

---

### mapFragment()

```ts
protected mapFragment(
   fragment,
   callbackFunc,
   parent): Fragment;
```

Defined in: [packages/transform/src/change-steps/Step.ts:144](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/Step.ts#L144)

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

---

### merge()

```ts
merge(_other): Step;
```

Defined in: [packages/transform/src/change-steps/Step.ts:117](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/Step.ts#L117)

Try to merge this step with another one, to be applied directly
after it. Returns the merged step when possible, null if the
steps can't be merged.

#### Parameters

| Parameter | Type   | Description             |
| --------- | ------ | ----------------------- |
| `_other`  | `Step` | The step to merge with. |

#### Returns

`Step`

The merged step, or null if the steps can't be merged.

#### Implementation of

```ts
PmStep.merge;
```

---

### toJSON()

```ts
abstract toJSON(): StepJSON;
```

Defined in: [packages/transform/src/change-steps/Step.ts:129](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/Step.ts#L129)

Create a JSON-serializable representation of this step. When
defining this for a custom subclass, make sure the result object
includes the step type's [JSON id](#transform.Step^jsonID) under
the `stepType` property.

#### Returns

`StepJSON`

A JSON representation of this step.

#### Implementation of

```ts
PmStep.toJSON;
```

---

### fromJSON()

```ts
static fromJSON(schema, json): Step;
```

Defined in: [packages/transform/src/change-steps/Step.ts:36](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/Step.ts#L36)

Deserialize a step from its JSON representation. Will call
through to the step class' own implementation of this method.

#### Parameters

| Parameter | Type       | Description                            |
| --------- | ---------- | -------------------------------------- |
| `schema`  | `Schema`   | The schema to use for deserialization. |
| `json`    | `StepJSON` | The JSON representation of the step.   |

#### Returns

`Step`

The deserialized step.

#### Throws

If the JSON is invalid or the step type is not registered.

---

### registerStep()

```ts
static registerStep(jsonId, stepClass): void;
```

Defined in: [packages/transform/src/change-steps/Step.ts:61](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/Step.ts#L61)

To be able to serialize steps to JSON, each step needs a string
ID to attach to its JSON representation. Use this method to
register an ID for your step classes. Try to pick something
that's unlikely to clash with steps from other modules.

#### Parameters

| Parameter   | Type                                                        | Description                                   |
| ----------- | ----------------------------------------------------------- | --------------------------------------------- |
| `jsonId`    | `string`                                                    | -                                             |
| `stepClass` | [`StepImplementation`](../interfaces/StepImplementation.md) | The step class with a fromJSON static method. |

#### Returns

`void`

#### Throws

If the ID is already registered.

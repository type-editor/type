[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-steps/DocAttrStep](../README.md) / DocAttrStep

# Class: DocAttrStep

Defined in: [packages/transform/src/change-steps/DocAttrStep.ts:24](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/DocAttrStep.ts#L24)

A document attribute step represents an update to an attribute
of the document node itself (rather than a node within the document).

This step type is used to modify document-level attributes such as metadata
or configuration settings without affecting the document's content structure.

## Example

```typescript
// Create a step that sets the 'language' attribute on the document node
const step = new DocAttrStep("language", "en-US");
```

## Extends

- [`Step`](../../Step/classes/Step.md)

## Constructors

### Constructor

```ts
new DocAttrStep(attr, value): DocAttrStep;
```

Defined in: [packages/transform/src/change-steps/DocAttrStep.ts:37](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/DocAttrStep.ts#L37)

Construct a document attribute step.

#### Parameters

| Parameter | Type        | Description                                                              |
| --------- | ----------- | ------------------------------------------------------------------------ |
| `attr`    | `string`    | The name of the document attribute to set.                               |
| `value`   | `AttrValue` | The attribute's new value (string, number, boolean, null, or undefined). |

#### Returns

`DocAttrStep`

#### Overrides

[`Step`](../../Step/classes/Step.md).[`constructor`](../../Step/classes/Step.md#constructor)

## Methods

### apply()

```ts
apply(doc): StepResult;
```

Defined in: [packages/transform/src/change-steps/DocAttrStep.ts:74](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/DocAttrStep.ts#L74)

Apply this step to a document, modifying an attribute of the document node itself.

Creates a new version of the document with the updated attribute value while
preserving all other attributes, content, and marks. This operates at the
document level rather than on nodes within the document.

#### Parameters

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `doc`     | `Node_2` | The document to apply the step to. |

#### Returns

[`StepResult`](../../StepResult/classes/StepResult.md)

A StepResult with the updated document (always succeeds for valid documents).

#### Overrides

[`Step`](../../Step/classes/Step.md).[`apply`](../../Step/classes/Step.md#apply)

---

### getMap()

```ts
getMap(): StepMap;
```

Defined in: [packages/transform/src/change-steps/DocAttrStep.ts:93](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/DocAttrStep.ts#L93)

Get the step map for this step.

Document attribute changes don't affect document positions or structure,
so this returns an empty map indicating no position mapping is needed.

#### Returns

[`StepMap`](../../../change-map/StepMap/classes/StepMap.md)

An empty StepMap indicating no position changes occurred.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`getMap`](../../Step/classes/Step.md#getmap)

---

### invert()

```ts
invert(doc): DocAttrStep;
```

Defined in: [packages/transform/src/change-steps/DocAttrStep.ts:106](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/DocAttrStep.ts#L106)

Create an inverted version of this step that undoes the document attribute change.

This is used for undo operations. The inverted step will restore the document
attribute to its value before this step was applied.

#### Parameters

| Parameter | Type     | Description                               |
| --------- | -------- | ----------------------------------------- |
| `doc`     | `Node_2` | The document before the step was applied. |

#### Returns

`DocAttrStep`

A DocAttrStep that restores the original attribute value.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`invert`](../../Step/classes/Step.md#invert)

---

### map()

```ts
map(_mapping): DocAttrStep;
```

Defined in: [packages/transform/src/change-steps/DocAttrStep.ts:120](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/DocAttrStep.ts#L120)

Map this step through a mappable object.

Document attribute steps are not affected by position mapping since they
operate on the document node itself rather than positions within the document.
This always returns the same step unchanged.

#### Parameters

| Parameter  | Type       | Description                                             |
| ---------- | ---------- | ------------------------------------------------------- |
| `_mapping` | `Mappable` | The mappable to apply (unused for document attributes). |

#### Returns

`DocAttrStep`

This same DocAttrStep instance.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`map`](../../Step/classes/Step.md#map)

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

[`Step`](../../Step/classes/Step.md).[`mapFragment`](../../Step/classes/Step.md#mapfragment)

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

[`Step`](../../Step/classes/Step.md).[`merge`](../../Step/classes/Step.md#merge)

---

### toJSON()

```ts
toJSON(): AttrStepJson;
```

Defined in: [packages/transform/src/change-steps/DocAttrStep.ts:131](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/DocAttrStep.ts#L131)

Serialize this step to JSON for storage or transmission.

The resulting JSON object can be deserialized using [DocAttrStep.fromJSON](#fromjson).

#### Returns

[`AttrStepJson`](../../../types/json/AttrStepJson/interfaces/AttrStepJson.md)

The JSON representation of this step including stepType, attr, and value.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`toJSON`](../../Step/classes/Step.md#tojson)

---

### fromJSON()

```ts
static fromJSON(_schema, json): DocAttrStep;
```

Defined in: [packages/transform/src/change-steps/DocAttrStep.ts:54](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/DocAttrStep.ts#L54)

Deserialize a document attribute step from its JSON representation.

This method validates that the JSON contains a valid attribute name.
The attribute name must be a non-empty string.

#### Parameters

| Parameter | Type                                                                          | Description                                                               |
| --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `_schema` | `Schema`                                                                      | The schema (not used but required by the Step interface).                 |
| `json`    | [`AttrStepJson`](../../../types/json/AttrStepJson/interfaces/AttrStepJson.md) | The JSON representation of the step containing attr and value properties. |

#### Returns

`DocAttrStep`

A new DocAttrStep instance constructed from the JSON data.

#### Throws

When the JSON is invalid or attribute name is empty.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`fromJSON`](../../Step/classes/Step.md#fromjson)

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

[`Step`](../../Step/classes/Step.md).[`registerStep`](../../Step/classes/Step.md#registerstep)

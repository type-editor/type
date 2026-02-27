[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-steps/AttrStep](../README.md) / AttrStep

# Class: AttrStep

Defined in: [packages/transform/src/change-steps/AttrStep.ts:24](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-steps/AttrStep.ts#L24)

An attribute step represents an update to a specific attribute
of a node at a given position in the document.

This step type is used to modify node attributes without changing the
node's content or structure. When applied, it creates a new version of
the node with the updated attribute value.

## Example

```typescript
// Create a step that sets the 'align' attribute to 'center' on the node at position 5
const step = new AttrStep(5, "align", "center");
```

## Extends

- [`Step`](../../Step/classes/Step.md)

## Constructors

### Constructor

```ts
new AttrStep(
   pos,
   attr,
   value): AttrStep;
```

Defined in: [packages/transform/src/change-steps/AttrStep.ts:40](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-steps/AttrStep.ts#L40)

Construct an attribute step.

#### Parameters

| Parameter | Type        | Description                                                              |
| --------- | ----------- | ------------------------------------------------------------------------ |
| `pos`     | `number`    | The position of the target node in the document.                         |
| `attr`    | `string`    | The name of the attribute to set.                                        |
| `value`   | `AttrValue` | The attribute's new value (string, number, boolean, null, or undefined). |

#### Returns

`AttrStep`

#### Overrides

[`Step`](../../Step/classes/Step.md).[`constructor`](../../Step/classes/Step.md#constructor)

## Methods

### apply()

```ts
apply(doc): StepResult;
```

Defined in: [packages/transform/src/change-steps/AttrStep.ts:82](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-steps/AttrStep.ts#L82)

Apply this step to a document, modifying the attribute of the node at the stored position.

Creates a new version of the target node with the updated attribute value while
preserving all other attributes, content, and marks. The node is replaced in the
document using a slice-based replacement.

#### Parameters

| Parameter | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `doc`     | `Node_2` | The document to apply the step to. |

#### Returns

[`StepResult`](../../StepResult/classes/StepResult.md)

A StepResult indicating success (with the modified document) or failure (with error message).

#### Overrides

[`Step`](../../Step/classes/Step.md).[`apply`](../../Step/classes/Step.md#apply)

---

### getMap()

```ts
getMap(): StepMap;
```

Defined in: [packages/transform/src/change-steps/AttrStep.ts:108](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-steps/AttrStep.ts#L108)

Get the step map for this step.

Attribute changes don't affect document positions or structure,
so this returns an empty map indicating no position mapping is needed.

#### Returns

[`StepMap`](../../../change-map/StepMap/classes/StepMap.md)

An empty StepMap indicating no position changes occurred.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`getMap`](../../Step/classes/Step.md#getmap)

---

### invert()

```ts
invert(doc): AttrStep;
```

Defined in: [packages/transform/src/change-steps/AttrStep.ts:122](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-steps/AttrStep.ts#L122)

Create an inverted version of this step that undoes the attribute change.

This is used for undo operations. The inverted step will restore the attribute
to its value before this step was applied.

#### Parameters

| Parameter | Type     | Description                               |
| --------- | -------- | ----------------------------------------- |
| `doc`     | `Node_2` | The document before the step was applied. |

#### Returns

`AttrStep`

An AttrStep that restores the original attribute value.

#### Throws

When there is no node at the stored position.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`invert`](../../Step/classes/Step.md#invert)

---

### map()

```ts
map(mapping): AttrStep;
```

Defined in: [packages/transform/src/change-steps/AttrStep.ts:139](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-steps/AttrStep.ts#L139)

Map this step through a mappable object (such as another step or step map).

This is used in collaborative editing to adjust step positions when other changes
have been made to the document. If the target node has been deleted, returns null.

#### Parameters

| Parameter | Type       | Description                                             |
| --------- | ---------- | ------------------------------------------------------- |
| `mapping` | `Mappable` | The mappable to apply (typically a StepMap or Mapping). |

#### Returns

`AttrStep`

A new AttrStep with the mapped position, or null if the position was deleted.

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

Defined in: [packages/transform/src/change-steps/Step.ts:144](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-steps/Step.ts#L144)

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

Defined in: [packages/transform/src/change-steps/Step.ts:117](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-steps/Step.ts#L117)

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

Defined in: [packages/transform/src/change-steps/AttrStep.ts:151](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-steps/AttrStep.ts#L151)

Serialize this step to JSON for storage or transmission.

The resulting JSON object can be deserialized using [AttrStep.fromJSON](#fromjson).

#### Returns

[`AttrStepJson`](../../../types/json/AttrStepJson/interfaces/AttrStepJson.md)

The JSON representation of this step including stepType, pos, attr, and value.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`toJSON`](../../Step/classes/Step.md#tojson)

---

### fromJSON()

```ts
static fromJSON(_schema, json): AttrStep;
```

Defined in: [packages/transform/src/change-steps/AttrStep.ts:59](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-steps/AttrStep.ts#L59)

Deserialize an attribute step from its JSON representation.

This method validates that the JSON contains valid position and attribute
name values. The position must be a non-negative number, and the attribute
name must be a non-empty string.

#### Parameters

| Parameter | Type                                                                          | Description                                                                     |
| --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `_schema` | `Schema`                                                                      | The schema (not used but required by the Step interface).                       |
| `json`    | [`AttrStepJson`](../../../types/json/AttrStepJson/interfaces/AttrStepJson.md) | The JSON representation of the step containing pos, attr, and value properties. |

#### Returns

`AttrStep`

A new AttrStep instance constructed from the JSON data.

#### Throws

When the JSON is invalid, position is negative, or attribute name is empty.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`fromJSON`](../../Step/classes/Step.md#fromjson)

---

### registerStep()

```ts
static registerStep(jsonId, stepClass): void;
```

Defined in: [packages/transform/src/change-steps/Step.ts:61](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-steps/Step.ts#L61)

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

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-steps/AddNodeMarkStep](../README.md) / AddNodeMarkStep

# Class: AddNodeMarkStep

Defined in: [packages/transform/src/change-steps/AddNodeMarkStep.ts:22](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/AddNodeMarkStep.ts#L22)

A step that adds a mark to a specific node (not its content, but the node itself).

This step is used to apply marks to block-level nodes or other non-inline nodes.
Unlike AddMarkStep which affects inline content within a range, this step
targets a single node at a specific position and adds a mark to that node.

## Example

```typescript
// Add a mark to the node at position 10
const step = new AddNodeMarkStep(10, schema.marks.highlight.create());
```

## Extends

- [`Step`](../../Step/classes/Step.md)

## Constructors

### Constructor

```ts
new AddNodeMarkStep(pos, mark): AddNodeMarkStep;
```

Defined in: [packages/transform/src/change-steps/AddNodeMarkStep.ts:33](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/AddNodeMarkStep.ts#L33)

Create a node mark step.

#### Parameters

| Parameter | Type     | Description                                      |
| --------- | -------- | ------------------------------------------------ |
| `pos`     | `number` | The position of the target node in the document. |
| `mark`    | `Mark`   | The mark to add to the node.                     |

#### Returns

`AddNodeMarkStep`

#### Overrides

[`Step`](../../Step/classes/Step.md).[`constructor`](../../Step/classes/Step.md#constructor)

## Methods

### apply()

```ts
apply(doc): StepResult;
```

Defined in: [packages/transform/src/change-steps/AddNodeMarkStep.ts:72](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/AddNodeMarkStep.ts#L72)

Apply this step to a document, adding the mark to the node at the stored position.

Creates a new version of the target node with the mark added to its mark set,
then replaces the original node with the marked version using a slice-based replacement.

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

Defined in: [packages/transform/src/change-steps/Step.ts:86](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/Step.ts#L86)

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
invert(doc): Step;
```

Defined in: [packages/transform/src/change-steps/AddNodeMarkStep.ts:102](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/AddNodeMarkStep.ts#L102)

Create an inverted version of this step for undo operations.

The inversion logic handles three cases:

- If adding the mark replaced an existing mark (e.g., mark exclusion), returns a step to add back the replaced mark
- If the mark was already present (no-op), returns this same step (which is also a no-op)
- Otherwise, returns a RemoveNodeMarkStep to remove the added mark

This ensures proper undo behavior that restores the exact previous state.

#### Parameters

| Parameter | Type     | Description                               |
| --------- | -------- | ----------------------------------------- |
| `doc`     | `Node_2` | The document before the step was applied. |

#### Returns

[`Step`](../../Step/classes/Step.md)

A step that undoes this step by either re-adding a replaced mark, being a no-op, or removing the added mark.

#### Throws

When there is no node at the stored position.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`invert`](../../Step/classes/Step.md#invert)

---

### map()

```ts
map(mapping): Step;
```

Defined in: [packages/transform/src/change-steps/AddNodeMarkStep.ts:135](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/AddNodeMarkStep.ts#L135)

Map this step through a mappable object, adjusting the position.

Used in collaborative editing to adjust the step position when other changes
have been made to the document. Returns null if the target node was deleted.

#### Parameters

| Parameter | Type       | Description                                             |
| --------- | ---------- | ------------------------------------------------------- |
| `mapping` | `Mappable` | The mappable to apply (typically a StepMap or Mapping). |

#### Returns

[`Step`](../../Step/classes/Step.md)

A new AddNodeMarkStep with the mapped position, or null if the position was deleted.

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
toJSON(): StepJSON;
```

Defined in: [packages/transform/src/change-steps/AddNodeMarkStep.ts:147](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/AddNodeMarkStep.ts#L147)

Serialize this step to JSON for storage or transmission.

The resulting JSON object can be deserialized using [AddNodeMarkStep.fromJSON](#fromjson).

#### Returns

`StepJSON`

The JSON representation of this step including stepType, pos, and mark properties.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`toJSON`](../../Step/classes/Step.md#tojson)

---

### fromJSON()

```ts
static fromJSON(schema, json): AddNodeMarkStep;
```

Defined in: [packages/transform/src/change-steps/AddNodeMarkStep.ts:50](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/change-steps/AddNodeMarkStep.ts#L50)

Deserialize an AddNodeMarkStep from its JSON representation.

Validates that the JSON contains a valid non-negative position and a mark
specification before creating the step.

#### Parameters

| Parameter | Type       | Description                                                                |
| --------- | ---------- | -------------------------------------------------------------------------- |
| `schema`  | `Schema`   | The schema to use for deserializing the mark.                              |
| `json`    | `StepJSON` | The JSON representation of the step, must include pos and mark properties. |

#### Returns

`AddNodeMarkStep`

A new AddNodeMarkStep instance constructed from the JSON data.

#### Throws

When the JSON is invalid, position is negative, or mark is missing.

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

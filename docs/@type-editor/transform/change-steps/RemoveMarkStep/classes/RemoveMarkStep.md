[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-steps/RemoveMarkStep](../README.md) / RemoveMarkStep

# Class: RemoveMarkStep

Defined in: [packages/transform/src/change-steps/RemoveMarkStep.ts:22](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/RemoveMarkStep.ts#L22)

A step that removes a mark from all inline content between two positions.

This step is used to remove formatting marks (like bold, italic, links) from a range
of inline content in the document. It only affects inline nodes that have the
specified mark applied.

## Example

```typescript
// Remove a bold mark from text between positions 5 and 15
const step = new RemoveMarkStep(5, 15, schema.marks.strong.create());
```

## Extends

- [`Step`](../../Step/classes/Step.md)

## Constructors

### Constructor

```ts
new RemoveMarkStep(
   from,
   to,
   mark): RemoveMarkStep;
```

Defined in: [packages/transform/src/change-steps/RemoveMarkStep.ts:34](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/RemoveMarkStep.ts#L34)

Create a mark-removing step.

#### Parameters

| Parameter | Type     | Description                                           |
| --------- | -------- | ----------------------------------------------------- |
| `from`    | `number` | The start position of the unmarked range (inclusive). |
| `to`      | `number` | The end position of the unmarked range (exclusive).   |
| `mark`    | `Mark`   | The mark to remove from inline content in the range.  |

#### Returns

`RemoveMarkStep`

#### Overrides

[`Step`](../../Step/classes/Step.md).[`constructor`](../../Step/classes/Step.md#constructor)

## Accessors

### from

#### Get Signature

```ts
get from(): number;
```

Defined in: [packages/transform/src/change-steps/RemoveMarkStep.ts:41](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/RemoveMarkStep.ts#L41)

##### Returns

`number`

#### Set Signature

```ts
set from(from): void;
```

Defined in: [packages/transform/src/change-steps/RemoveMarkStep.ts:45](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/RemoveMarkStep.ts#L45)

##### Parameters

| Parameter | Type     |
| --------- | -------- |
| `from`    | `number` |

##### Returns

`void`

---

### mark

#### Get Signature

```ts
get mark(): Mark;
```

Defined in: [packages/transform/src/change-steps/RemoveMarkStep.ts:59](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/RemoveMarkStep.ts#L59)

##### Returns

`Mark`

#### Set Signature

```ts
set mark(mark): void;
```

Defined in: [packages/transform/src/change-steps/RemoveMarkStep.ts:63](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/RemoveMarkStep.ts#L63)

##### Parameters

| Parameter | Type   |
| --------- | ------ |
| `mark`    | `Mark` |

##### Returns

`void`

---

### to

#### Get Signature

```ts
get to(): number;
```

Defined in: [packages/transform/src/change-steps/RemoveMarkStep.ts:49](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/RemoveMarkStep.ts#L49)

##### Returns

`number`

#### Set Signature

```ts
set to(to): void;
```

Defined in: [packages/transform/src/change-steps/RemoveMarkStep.ts:53](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/RemoveMarkStep.ts#L53)

##### Parameters

| Parameter | Type     |
| --------- | -------- |
| `to`      | `number` |

##### Returns

`void`

## Methods

### apply()

```ts
apply(doc): StepResult;
```

Defined in: [packages/transform/src/change-steps/RemoveMarkStep.ts:103](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/RemoveMarkStep.ts#L103)

Apply this step to a document, removing the mark from all inline content in the range.

Extracts the content slice from the specified range, removes the mark from all
inline nodes within it, and replaces the original slice with the unmarked version.

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

Defined in: [packages/transform/src/change-steps/Step.ts:86](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/Step.ts#L86)

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
invert(): Step;
```

Defined in: [packages/transform/src/change-steps/RemoveMarkStep.ts:124](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/RemoveMarkStep.ts#L124)

Create an inverted version of this step that adds the mark back.

Used for undo operations to revert the mark removal. The inverted step
will restore the document to its state before this step was applied.

#### Returns

[`Step`](../../Step/classes/Step.md)

An AddMarkStep that undoes this step by adding the mark back.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`invert`](../../Step/classes/Step.md#invert)

---

### map()

```ts
map(mapping): Step;
```

Defined in: [packages/transform/src/change-steps/RemoveMarkStep.ts:138](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/RemoveMarkStep.ts#L138)

Map this step through a mappable object, adjusting positions.

Used in collaborative editing to adjust step positions when other changes
have been made to the document. Returns null if the unmarked range was deleted
or became invalid (from \>= to).

#### Parameters

| Parameter | Type       | Description                                             |
| --------- | ---------- | ------------------------------------------------------- |
| `mapping` | `Mappable` | The mappable to apply (typically a StepMap or Mapping). |

#### Returns

[`Step`](../../Step/classes/Step.md)

A new RemoveMarkStep with mapped positions, or null if the range was deleted or became invalid.

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

#### Inherited from

[`Step`](../../Step/classes/Step.md).[`mapFragment`](../../Step/classes/Step.md#mapfragment)

---

### merge()

```ts
merge(other): Step;
```

Defined in: [packages/transform/src/change-steps/RemoveMarkStep.ts:158](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/RemoveMarkStep.ts#L158)

Try to merge this step with another step for optimization.

Two RemoveMarkSteps can be merged if they remove the same mark and have
overlapping or adjacent ranges. The merged step will cover the union
of both ranges.

#### Parameters

| Parameter | Type                                 | Description                   |
| --------- | ------------------------------------ | ----------------------------- |
| `other`   | [`Step`](../../Step/classes/Step.md) | The step to try merging with. |

#### Returns

[`Step`](../../Step/classes/Step.md)

A merged RemoveMarkStep covering the combined range if compatible, or null if the steps cannot be merged.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`merge`](../../Step/classes/Step.md#merge)

---

### toJSON()

```ts
toJSON(): StepJSON;
```

Defined in: [packages/transform/src/change-steps/RemoveMarkStep.ts:177](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/RemoveMarkStep.ts#L177)

Serialize this step to JSON for storage or transmission.

The resulting JSON object can be deserialized using [RemoveMarkStep.fromJSON](#fromjson).

#### Returns

`StepJSON`

The JSON representation of this step including stepType, mark, from, and to properties.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`toJSON`](../../Step/classes/Step.md#tojson)

---

### fromJSON()

```ts
static fromJSON(schema, json): RemoveMarkStep;
```

Defined in: [packages/transform/src/change-steps/RemoveMarkStep.ts:78](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/change-steps/RemoveMarkStep.ts#L78)

Deserialize a RemoveMarkStep from its JSON representation.

Validates that the JSON contains valid positions (non-negative, from \<= to)
and a mark specification before creating the step.

#### Parameters

| Parameter | Type       | Description                                                                      |
| --------- | ---------- | -------------------------------------------------------------------------------- |
| `schema`  | `Schema`   | The schema to use for deserializing the mark.                                    |
| `json`    | `StepJSON` | The JSON representation of the step, must include from, to, and mark properties. |

#### Returns

`RemoveMarkStep`

A new RemoveMarkStep instance constructed from the JSON data.

#### Throws

When the JSON is invalid, positions are negative, from \> to, or mark is missing.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`fromJSON`](../../Step/classes/Step.md#fromjson)

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

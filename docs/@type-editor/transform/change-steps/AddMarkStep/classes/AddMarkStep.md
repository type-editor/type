[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-steps/AddMarkStep](../README.md) / AddMarkStep

# Class: AddMarkStep

Defined in: [packages/transform/src/change-steps/AddMarkStep.ts:22](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/AddMarkStep.ts#L22)

A step that adds a mark to all inline content between two positions.

This step is used to apply formatting marks (like bold, italic, links) to a range
of inline content in the document. It only affects inline nodes (text and inline
elements) and respects the schema's mark type restrictions.

## Example

```typescript
// Add a bold mark to text between positions 5 and 15
const step = new AddMarkStep(5, 15, schema.marks.strong.create());
```

## Extends

- [`Step`](../../Step/classes/Step.md)

## Constructors

### Constructor

```ts
new AddMarkStep(
   from,
   to,
   mark): AddMarkStep;
```

Defined in: [packages/transform/src/change-steps/AddMarkStep.ts:34](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/AddMarkStep.ts#L34)

Create a mark step.

#### Parameters

| Parameter | Type     | Description                                         |
| --------- | -------- | --------------------------------------------------- |
| `from`    | `number` | The start position of the marked range (inclusive). |
| `to`      | `number` | The end position of the marked range (exclusive).   |
| `mark`    | `Mark`   | The mark to add to inline content in the range.     |

#### Returns

`AddMarkStep`

#### Overrides

[`Step`](../../Step/classes/Step.md).[`constructor`](../../Step/classes/Step.md#constructor)

## Accessors

### to

#### Get Signature

```ts
get to(): number;
```

Defined in: [packages/transform/src/change-steps/AddMarkStep.ts:43](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/AddMarkStep.ts#L43)

##### Returns

`number`

#### Set Signature

```ts
set to(to): void;
```

Defined in: [packages/transform/src/change-steps/AddMarkStep.ts:47](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/AddMarkStep.ts#L47)

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

Defined in: [packages/transform/src/change-steps/AddMarkStep.ts:89](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/AddMarkStep.ts#L89)

Apply this step to a document, adding the mark to all inline content in the range.

Extracts the content slice from the specified range, applies the mark to all
inline atoms within it (respecting parent node mark type restrictions), and
replaces the original slice with the marked version.

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
invert(): Step;
```

Defined in: [packages/transform/src/change-steps/AddMarkStep.ts:119](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/AddMarkStep.ts#L119)

Create an inverted version of this step that removes the mark.

Used for undo operations to revert the mark addition. The inverted step
will restore the document to its state before this step was applied.

#### Returns

[`Step`](../../Step/classes/Step.md)

A RemoveMarkStep that undoes this step by removing the added mark.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`invert`](../../Step/classes/Step.md#invert)

---

### map()

```ts
map(mapping): Step;
```

Defined in: [packages/transform/src/change-steps/AddMarkStep.ts:133](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/AddMarkStep.ts#L133)

Map this step through a mappable object, adjusting positions.

Used in collaborative editing to adjust step positions when other changes
have been made to the document. Returns null if the marked range was deleted
or became invalid (from \>= to).

#### Parameters

| Parameter | Type       | Description                                             |
| --------- | ---------- | ------------------------------------------------------- |
| `mapping` | `Mappable` | The mappable to apply (typically a StepMap or Mapping). |

#### Returns

[`Step`](../../Step/classes/Step.md)

A new AddMarkStep with mapped positions, or null if the range was deleted or became invalid.

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
merge(other): Step;
```

Defined in: [packages/transform/src/change-steps/AddMarkStep.ts:153](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/AddMarkStep.ts#L153)

Try to merge this step with another step for optimization.

Two AddMarkSteps can be merged if they apply the same mark and have
overlapping or adjacent ranges. The merged step will cover the union
of both ranges.

#### Parameters

| Parameter | Type                                 | Description                   |
| --------- | ------------------------------------ | ----------------------------- |
| `other`   | [`Step`](../../Step/classes/Step.md) | The step to try merging with. |

#### Returns

[`Step`](../../Step/classes/Step.md)

A merged AddMarkStep covering the combined range if compatible, or null if the steps cannot be merged.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`merge`](../../Step/classes/Step.md#merge)

---

### toJSON()

```ts
toJSON(): StepJSON;
```

Defined in: [packages/transform/src/change-steps/AddMarkStep.ts:173](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/AddMarkStep.ts#L173)

Serialize this step to JSON for storage or transmission.

The resulting JSON object can be deserialized using [AddMarkStep.fromJSON](#fromjson).

#### Returns

`StepJSON`

The JSON representation of this step including stepType, mark, from, and to properties.

#### Overrides

[`Step`](../../Step/classes/Step.md).[`toJSON`](../../Step/classes/Step.md#tojson)

---

### fromJSON()

```ts
static fromJSON(schema, json): AddMarkStep;
```

Defined in: [packages/transform/src/change-steps/AddMarkStep.ts:62](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-steps/AddMarkStep.ts#L62)

Deserialize an AddMarkStep from its JSON representation.

Validates that the JSON contains valid positions (non-negative, from \<= to)
and a mark specification before creating the step.

#### Parameters

| Parameter | Type       | Description                                                                      |
| --------- | ---------- | -------------------------------------------------------------------------------- |
| `schema`  | `Schema`   | The schema to use for deserializing the mark.                                    |
| `json`    | `StepJSON` | The JSON representation of the step, must include from, to, and mark properties. |

#### Returns

`AddMarkStep`

A new AddMarkStep instance constructed from the JSON data.

#### Throws

When the JSON is invalid, positions are negative, from \> to, or mark is missing.

#### Overrides

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

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-steps/StepResult](../README.md) / StepResult

# Class: StepResult

Defined in: [packages/transform/src/change-steps/StepResult.ts:9](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/StepResult.ts#L9)

The result of [applying](#transform.Step.apply) a step. Contains either a
new document or a failure value.

## Implements

- `PmStepResult`

## Constructors

### Constructor

```ts
new StepResult(doc, failed): StepResult;
```

Defined in: [packages/transform/src/change-steps/StepResult.ts:19](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/StepResult.ts#L19)

**`Internal`**

#### Parameters

| Parameter | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `doc`     | `Node_2` | The transformed document, if successful. |
| `failed`  | `string` | The failure message, if unsuccessful.    |

#### Returns

`StepResult`

## Accessors

### doc

#### Get Signature

```ts
get doc(): Node_2;
```

Defined in: [packages/transform/src/change-steps/StepResult.ts:28](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/StepResult.ts#L28)

##### Returns

`Node_2`

#### Implementation of

```ts
PmStepResult.doc;
```

---

### failed

#### Get Signature

```ts
get failed(): string;
```

Defined in: [packages/transform/src/change-steps/StepResult.ts:32](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/StepResult.ts#L32)

##### Returns

`string`

#### Implementation of

```ts
PmStepResult.failed;
```

## Methods

### fail()

```ts
static fail(message): StepResult;
```

Defined in: [packages/transform/src/change-steps/StepResult.ts:55](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/StepResult.ts#L55)

Create a failed step result.

#### Parameters

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `message` | `string` | The failure message. |

#### Returns

`StepResult`

A failed StepResult.

---

### fromReplace()

```ts
static fromReplace(
   doc,
   from,
   to,
   slice): StepResult;
```

Defined in: [packages/transform/src/change-steps/StepResult.ts:73](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/StepResult.ts#L73)

Call [`Node.replace`](#model.Node.replace) with the given
arguments. Create a successful result if it succeeds, and a
failed one if it throws a `ReplaceError`.

#### Parameters

| Parameter | Type     | Description                               |
| --------- | -------- | ----------------------------------------- |
| `doc`     | `Node_2` | The document to apply the replacement to. |
| `from`    | `number` | The start position of the replacement.    |
| `to`      | `number` | The end position of the replacement.      |
| `slice`   | `Slice`  | The slice to insert.                      |

#### Returns

`StepResult`

A StepResult indicating success or failure.

---

### ok()

```ts
static ok(doc): StepResult;
```

Defined in: [packages/transform/src/change-steps/StepResult.ts:42](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/transform/src/change-steps/StepResult.ts#L42)

Create a successful step result.

#### Parameters

| Parameter | Type     | Description               |
| --------- | -------- | ------------------------- |
| `doc`     | `Node_2` | The transformed document. |

#### Returns

`StepResult`

A successful StepResult.

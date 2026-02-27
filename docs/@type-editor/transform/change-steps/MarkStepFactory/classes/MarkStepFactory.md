[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-steps/MarkStepFactory](../README.md) / MarkStepFactory

# Class: MarkStepFactory

Defined in: [packages/transform/src/change-steps/MarkStepFactory.ts:8](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-steps/MarkStepFactory.ts#L8)

## Constructors

### Constructor

```ts
new MarkStepFactory(): MarkStepFactory;
```

#### Returns

`MarkStepFactory`

## Methods

### createAddMarkStep()

```ts
static createAddMarkStep(
   from,
   to,
   mark): AddMarkStep;
```

Defined in: [packages/transform/src/change-steps/MarkStepFactory.ts:10](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-steps/MarkStepFactory.ts#L10)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `from`    | `number` |
| `to`      | `number` |
| `mark`    | `Mark`   |

#### Returns

[`AddMarkStep`](../../AddMarkStep/classes/AddMarkStep.md)

---

### createAddNodeMarkStep()

```ts
static createAddNodeMarkStep(pos, mark): AddNodeMarkStep;
```

Defined in: [packages/transform/src/change-steps/MarkStepFactory.ts:18](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-steps/MarkStepFactory.ts#L18)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `pos`     | `number` |
| `mark`    | `Mark`   |

#### Returns

[`AddNodeMarkStep`](../../AddNodeMarkStep/classes/AddNodeMarkStep.md)

---

### createRemoveMarkStep()

```ts
static createRemoveMarkStep(
   from,
   to,
   mark): RemoveMarkStep;
```

Defined in: [packages/transform/src/change-steps/MarkStepFactory.ts:14](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-steps/MarkStepFactory.ts#L14)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `from`    | `number` |
| `to`      | `number` |
| `mark`    | `Mark`   |

#### Returns

[`RemoveMarkStep`](../../RemoveMarkStep/classes/RemoveMarkStep.md)

---

### createRemoveNodeMarkStep()

```ts
static createRemoveNodeMarkStep(pos, mark): RemoveNodeMarkStep;
```

Defined in: [packages/transform/src/change-steps/MarkStepFactory.ts:22](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-steps/MarkStepFactory.ts#L22)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `pos`     | `number` |
| `mark`    | `Mark`   |

#### Returns

[`RemoveNodeMarkStep`](../../RemoveNodeMarkStep/classes/RemoveNodeMarkStep.md)

[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/editor-types](../../../../README.md) / [types/transform/PmStep](../README.md) / PmStep

# Interface: PmStep

Defined in: [packages/editor-types/src/types/transform/PmStep.ts:8](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/PmStep.ts#L8)

## Methods

### apply()

```ts
apply(doc): PmStepResult;
```

Defined in: [packages/editor-types/src/types/transform/PmStep.ts:10](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/PmStep.ts#L10)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `doc`     | `Node_2` |

#### Returns

[`PmStepResult`](../../PmStepResult/interfaces/PmStepResult.md)

---

### getMap()

```ts
getMap(): Mappable;
```

Defined in: [packages/editor-types/src/types/transform/PmStep.ts:19](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/PmStep.ts#L19)

Get the step map that represents the changes made by this step,
and which can be used to transform between positions in the old
and the new document.

#### Returns

[`Mappable`](../../Mappable/interfaces/Mappable.md)

A StepMap describing the position changes, or StepMap.empty if no changes.

---

### invert()

```ts
invert(doc): PmStep;
```

Defined in: [packages/editor-types/src/types/transform/PmStep.ts:21](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/PmStep.ts#L21)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `doc`     | `Node_2` |

#### Returns

`PmStep`

---

### map()

```ts
map(mapping): PmStep;
```

Defined in: [packages/editor-types/src/types/transform/PmStep.ts:23](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/PmStep.ts#L23)

#### Parameters

| Parameter | Type                                                |
| --------- | --------------------------------------------------- |
| `mapping` | [`Mappable`](../../Mappable/interfaces/Mappable.md) |

#### Returns

`PmStep`

---

### merge()

```ts
merge(_other): PmStep;
```

Defined in: [packages/editor-types/src/types/transform/PmStep.ts:33](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/PmStep.ts#L33)

Try to merge this step with another one, to be applied directly
after it. Returns the merged step when possible, null if the
steps can't be merged.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `_other`  | `PmStep` | The step to merge with. |

#### Returns

`PmStep`

The merged step, or null if the steps can't be merged.

---

### toJSON()

```ts
toJSON(): StepJSON;
```

Defined in: [packages/editor-types/src/types/transform/PmStep.ts:35](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/transform/PmStep.ts#L35)

#### Returns

[`StepJSON`](../../StepJSON/interfaces/StepJSON.md)

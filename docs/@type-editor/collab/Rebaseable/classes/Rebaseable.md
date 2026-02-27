[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/collab](../../README.md) / [Rebaseable](../README.md) / Rebaseable

# Class: Rebaseable

Defined in: [Rebaseable.ts:9](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/collab/src/Rebaseable.ts#L9)

Represents a step that can be rebased (undone and redone after applying other steps).
Stores the original step, its inverse, and the transform that originated it.

## Constructors

### Constructor

```ts
new Rebaseable(
   step,
   inverted,
   origin): Rebaseable;
```

Defined in: [Rebaseable.ts:16](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/collab/src/Rebaseable.ts#L16)

Creates a new Rebaseable instance.

#### Parameters

| Parameter  | Type        | Description                                       |
| ---------- | ----------- | ------------------------------------------------- |
| `step`     | `PmStep`    | The original step to be applied.                  |
| `inverted` | `PmStep`    | The inverse of the step, used for undoing.        |
| `origin`   | `Transform` | The transform that originally produced this step. |

#### Returns

`Rebaseable`

## Properties

| Property                                  | Modifier   | Type        | Description                                       | Defined in                                                                                                                                  |
| ----------------------------------------- | ---------- | ----------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-inverted"></a> `inverted` | `readonly` | `PmStep`    | The inverse of the step, used for undoing.        | [Rebaseable.ts:18](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/collab/src/Rebaseable.ts#L18) |
| <a id="property-origin"></a> `origin`     | `readonly` | `Transform` | The transform that originally produced this step. | [Rebaseable.ts:19](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/collab/src/Rebaseable.ts#L19) |
| <a id="property-step"></a> `step`         | `readonly` | `PmStep`    | The original step to be applied.                  | [Rebaseable.ts:17](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/collab/src/Rebaseable.ts#L17) |

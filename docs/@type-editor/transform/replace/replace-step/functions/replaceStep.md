[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [replace/replace-step](../README.md) / replaceStep

# Function: replaceStep()

```ts
function replaceStep(doc, from, to?, slice?): Step;
```

Defined in: [packages/transform/src/replace/replace-step.ts:855](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/replace/replace-step.ts#L855)

'Fit' a slice into a given position in the document, producing a
[step](#transform.Step) that inserts it. Will return null if
there's no meaningful way to insert the slice here, or inserting it
would be a no-op (an empty slice over an empty range).

## Parameters

| Parameter | Type     | Default value | Description                                   |
| --------- | -------- | ------------- | --------------------------------------------- |
| `doc`     | `Node_2` | `undefined`   | The document to insert into                   |
| `from`    | `number` | `undefined`   | The start position                            |
| `to`      | `number` | `from`        | The end position (defaults to from)           |
| `slice`   | `Slice`  | `Slice.empty` | The slice to insert (defaults to empty slice) |

## Returns

[`Step`](../../../change-steps/Step/classes/Step.md)

A step that performs the insertion, or null if not possible

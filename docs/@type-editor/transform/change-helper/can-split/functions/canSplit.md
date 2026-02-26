[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-helper/can-split](../README.md) / canSplit

# Function: canSplit()

```ts
function canSplit(doc, pos, depth?, typesAfter?): boolean;
```

Defined in: [packages/transform/src/change-helper/can-split.ts:12](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/transform/src/change-helper/can-split.ts#L12)

Check whether splitting at the given position is allowed.

## Parameters

| Parameter     | Type                                                                                     | Default value | Description                                          |
| ------------- | ---------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------- |
| `doc`         | `Node_2`                                                                                 | `undefined`   | The document to check.                               |
| `pos`         | `number`                                                                                 | `undefined`   | The position to split at.                            |
| `depth`       | `number`                                                                                 | `1`           | The depth of the split (how many levels to split).   |
| `typesAfter?` | \{ `attrs?`: `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;; `type`: `NodeType`; \}[] | `undefined`   | Optional array of node types to use after the split. |

## Returns

`boolean`

True if the split is valid, false otherwise.

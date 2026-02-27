[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/changeset](../../README.md) / [simplify-changes](../README.md) / simplifyChanges

# Function: simplifyChanges()

```ts
function simplifyChanges(changes, doc): Change<any>[];
```

Defined in: [simplify-changes.ts:25](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/changeset/src/simplify-changes.ts#L25)

Simplifies a set of changes for presentation.

This function makes changes more readable by expanding insertions and deletions
that occur within the same word to cover entire words. This prevents confusing
partial-word changes while maintaining accuracy.

The algorithm:

1. Groups nearby changes (within MAX_SIMPLIFY_DISTANCE)
2. For mixed insertions/deletions in a group, expands to word boundaries
3. Preserves single-character replacements as-is
4. Merges adjacent changes when appropriate

## Parameters

| Parameter | Type                                                               | Description                                 |
| --------- | ------------------------------------------------------------------ | ------------------------------------------- |
| `changes` | readonly [`Change`](../../Change/classes/Change.md)&lt;`any`&gt;[] | The array of changes to simplify.           |
| `doc`     | `Node_2`                                                           | The document node (new version) to analyze. |

## Returns

[`Change`](../../Change/classes/Change.md)&lt;`any`&gt;[]

A new array of simplified changes.

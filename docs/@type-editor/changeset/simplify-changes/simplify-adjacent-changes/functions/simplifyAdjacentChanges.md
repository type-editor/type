[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/changeset](../../../README.md) / [simplify-changes/simplify-adjacent-changes](../README.md) / simplifyAdjacentChanges

# Function: simplifyAdjacentChanges()

```ts
function simplifyAdjacentChanges(changes, from, to, doc, target): void;
```

Defined in: [simplify-changes/simplify-adjacent-changes.ts:25](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/changeset/src/simplify-changes/simplify-adjacent-changes.ts#L25)

Processes a group of adjacent changes and adds simplified versions to the target array.

This function examines changes in a group to determine if they should be merged.
Changes are merged if they're within the same word (no word boundary between them).
Mixed insertions/deletions are expanded to word boundaries unless they're single
character replacements.

## Parameters

| Parameter | Type                                                                  | Description                                       |
| --------- | --------------------------------------------------------------------- | ------------------------------------------------- |
| `changes` | readonly [`Change`](../../../Change/classes/Change.md)&lt;`any`&gt;[] | The complete array of changes.                    |
| `from`    | `number`                                                              | The start index in the changes array (inclusive). |
| `to`      | `number`                                                              | The end index in the changes array (exclusive).   |
| `doc`     | `Node_2`                                                              | The document node to analyze.                     |
| `target`  | [`Change`](../../../Change/classes/Change.md)&lt;`any`&gt;[]          | The array to add simplified changes to.           |

## Returns

`void`

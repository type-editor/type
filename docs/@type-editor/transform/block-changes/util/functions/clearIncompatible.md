[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [block-changes/util](../README.md) / clearIncompatible

# Function: clearIncompatible()

```ts
function clearIncompatible(
  transform,
  position,
  parentType,
  match?,
  clearNewlines?,
): void;
```

Defined in: [packages/transform/src/block-changes/util.ts:212](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/transform/src/block-changes/util.ts#L212)

Remove nodes and marks that are incompatible with the given parent node type.

Used to clean up content when changing a node's type to ensure schema compliance.
This is particularly useful when converting between node types (e.g., paragraph to
heading) where the allowed content or marks may differ.

This function performs the following operations:

1. Removes child nodes that don't fit in the parent's content model
2. Removes marks that aren't allowed on child nodes
3. Optionally replaces newlines with spaces in text nodes (for non-pre whitespace)
4. Fills any required content at the end if needed (to satisfy content expressions)

## Parameters

| Parameter        | Type                | Default value | Description                                                                          |
| ---------------- | ------------------- | ------------- | ------------------------------------------------------------------------------------ |
| `transform`      | `TransformDocument` | `undefined`   | The transform to add steps to.                                                       |
| `position`       | `number`            | `undefined`   | The position of the parent node whose content should be cleaned.                     |
| `parentType`     | `NodeType`          | `undefined`   | The node type to validate content against.                                           |
| `match?`         | `ContentMatch`      | `undefined`   | Optional content match to start from. If not provided, uses parentType.contentMatch. |
| `clearNewlines?` | `boolean`           | `true`        | Whether to replace newlines with spaces in text nodes (default: true).               |

## Returns

`void`

## Throws

When position is negative or no node exists at the position.

## Example

```typescript
// Clean up content when converting a paragraph to a heading
clearIncompatible(tr, paragraphPos, schema.nodes.heading);
```

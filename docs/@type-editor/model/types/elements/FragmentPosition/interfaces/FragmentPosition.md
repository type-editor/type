[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [types/elements/FragmentPosition](../README.md) / FragmentPosition

# Interface: FragmentPosition

Defined in: [packages/model/src/types/elements/FragmentPosition.ts:22](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/types/elements/FragmentPosition.ts#L22)

Represents a position within a fragment using child index and offset.

This interface provides an alternative way to specify positions within a fragment,
using the index of a child node and an offset within that child, rather than
an absolute position. This is particularly useful for operations that need to
identify both which child node contains a position and where within that node
the position lies.

## Example

```typescript
// For a fragment with children of sizes [5, 3, 7]
// Position 8 would be:
const diffIndex: DiffIndex = {
  index: 2, // Third child (0-indexed)
  offset: 5, // Starts at position 5 (5 + 3)
};
```

## Properties

| Property                              | Type     | Description                                                                                                                                     | Defined in                                                                                                                                                                                              |
| ------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-index"></a> `index`   | `number` | The index of the child node within the fragment. This is a zero-based index into the fragment's children array.                                 | [packages/model/src/types/elements/FragmentPosition.ts:27](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/types/elements/FragmentPosition.ts#L27) |
| <a id="property-offset"></a> `offset` | `number` | The offset within the child node at the specified index. This represents the absolute position where the child node starts within the fragment. | [packages/model/src/types/elements/FragmentPosition.ts:34](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/types/elements/FragmentPosition.ts#L34) |

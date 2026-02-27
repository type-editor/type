[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/commands](../../../README.md) / [util/helpers](../README.md) / textblockAt

# Function: textblockAt()

```ts
function textblockAt(node, side, only?): boolean;
```

Defined in: [util/helpers.ts:181](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/commands/src/util/helpers.ts#L181)

Checks if a node contains a textblock at its start or end.

This function traverses down from the given node to determine if there's a
textblock accessible at the specified side. It navigates through the node
hierarchy following either first or last children depending on the side.

## Parameters

| Parameter | Type                 | Default value | Description                                                                      |
| --------- | -------------------- | ------------- | -------------------------------------------------------------------------------- |
| `node`    | `Node_2`             | `undefined`   | The node to check                                                                |
| `side`    | `"start"` \| `"end"` | `undefined`   | Which side to check: 'start' follows first children, 'end' follows last children |
| `only`    | `boolean`            | `false`       | If true, only returns true if there's a single-child path to the textblock       |

## Returns

`boolean`

`true` if a textblock is found at the specified side, `false` otherwise

## Example

```typescript
// Check if a blockquote starts with a textblock
const startsWithText = textblockAt(blockquoteNode, "start");

// Check if a list item ends with a single textblock
const endsWithOnlyText = textblockAt(listItemNode, "end", true);
```

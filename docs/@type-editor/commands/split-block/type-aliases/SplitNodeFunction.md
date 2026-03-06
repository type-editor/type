[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [split-block](../README.md) / SplitNodeFunction

# Type Alias: SplitNodeFunction()

```ts
type SplitNodeFunction = (
  node,
  atEnd,
  $from,
) => {
  attrs?: Attrs;
  type: NodeType;
} | null;
```

Defined in: [split-block.ts:138](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/commands/src/split-block.ts#L138)

Function type for customizing the node type of newly split blocks.

## Parameters

| Parameter | Type          | Description                                  |
| --------- | ------------- | -------------------------------------------- |
| `node`    | `PmNode`      | The node being split                         |
| `atEnd`   | `boolean`     | Whether the split is at the end of the node  |
| `$from`   | `ResolvedPos` | The resolved position where the split occurs |

## Returns

\| \{
`attrs?`: `Attrs`;
`type`: `NodeType`;
\}
\| `null`

The type and optional attributes for the new block, or null to use default behavior

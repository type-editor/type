[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-helper/find-wrapping](../README.md) / findWrapping

# Function: findWrapping()

```ts
function findWrapping(
  range,
  nodeType,
  attrs?,
  innerRange?,
): {
  attrs: Readonly<Record<string, any>>;
  type: NodeType;
}[];
```

Defined in: [packages/transform/src/change-helper/find-wrapping.ts:15](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/change-helper/find-wrapping.ts#L15)

Try to find a valid way to wrap the content in the given range in a
node of the given type. May introduce extra nodes around and inside
the wrapper node, if necessary. Returns null if no valid wrapping
could be found.

## Parameters

| Parameter    | Type                                              | Default value | Description                                                          |
| ------------ | ------------------------------------------------- | ------------- | -------------------------------------------------------------------- |
| `range`      | `NodeRange`                                       | `undefined`   | The range of content to wrap.                                        |
| `nodeType`   | `NodeType`                                        | `undefined`   | The type of node to wrap the content in.                             |
| `attrs`      | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; | `null`        | Attributes for the wrapper node.                                     |
| `innerRange` | `NodeRange`                                       | `range`       | Optional alternative range whose content should fit in the wrapping. |

## Returns

\{
`attrs`: `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;;
`type`: `NodeType`;
\}[]

An array of wrapper node descriptors, or null if no valid wrapping exists.

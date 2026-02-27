[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [block-changes/wrap](../README.md) / wrap

# Function: wrap()

```ts
function wrap(transform, range, wrappers): void;
```

Defined in: [packages/transform/src/block-changes/wrap.ts:14](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/transform/src/block-changes/wrap.ts#L14)

Wrap the content in a range with a series of wrapper nodes.
The wrappers are applied from outermost to innermost.

## Parameters

| Parameter   | Type                                                                                              | Description                                          |
| ----------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `transform` | `TransformDocument`                                                                               | The transform to apply the wrapping to.              |
| `range`     | `NodeRange`                                                                                       | The range of content to wrap.                        |
| `wrappers`  | readonly \{ `attrs?`: `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt;; `type`: `NodeType`; \}[] | Array of wrapper node descriptors (outermost first). |

## Returns

`void`

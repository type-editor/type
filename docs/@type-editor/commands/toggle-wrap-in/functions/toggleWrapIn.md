[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [toggle-wrap-in](../README.md) / toggleWrapIn

# Function: toggleWrapIn()

```ts
function toggleWrapIn(nodeType, attrs?, allowUnwrap?): Command;
```

Defined in: [toggle-wrap-in.ts:20](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/commands/src/toggle-wrap-in.ts#L20)

Creates a command that toggles wrapping of the selected content in the given node type.

If the selection is already inside a node of the specified type and `allowUnwrap` is true,
the command will lift (unwrap) the content. Otherwise, it will wrap the selected block range
in a node of the given type.

## Parameters

| Parameter     | Type                                              | Default value | Description                                                                        |
| ------------- | ------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------- |
| `nodeType`    | `NodeType`                                        | `undefined`   | The node type to wrap the selection in (e.g., blockquote, list).                   |
| `attrs`       | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; | `null`        | Optional attributes to apply to the wrapping node.                                 |
| `allowUnwrap` | `boolean`                                         | `true`        | Whether to allow unwrapping when already inside the node type. Defaults to `true`. |

## Returns

`Command`

A command that toggles the wrapping and returns `true` if the command was applicable.

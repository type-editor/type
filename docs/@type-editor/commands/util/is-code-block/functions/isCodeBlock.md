[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/commands](../../../README.md) / [util/is-code-block](../README.md) / isCodeBlock

# Function: isCodeBlock()

```ts
function isCodeBlock(state, codeNodeType?): boolean;
```

Defined in: [util/is-code-block.ts:14](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/commands/src/util/is-code-block.ts#L14)

Checks if the current selection is within a code block.

## Parameters

| Parameter      | Type            | Default value             | Description              |
| -------------- | --------------- | ------------------------- | ------------------------ |
| `state`        | `PmEditorState` | `undefined`               | The current editor state |
| `codeNodeType` | `NodeType`      | `schema.nodes.code_block` | -                        |

## Returns

`boolean`

`true` if the selection's parent node is a code block, `false` otherwise

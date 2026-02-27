[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/commands](../../../README.md) / [util/is-code-block](../README.md) / isCodeBlock

# Function: isCodeBlock()

```ts
function isCodeBlock(state, codeNodeType?): boolean;
```

Defined in: [util/is-code-block.ts:14](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/commands/src/util/is-code-block.ts#L14)

Checks if the current selection is within a code block.

## Parameters

| Parameter      | Type            | Default value             | Description              |
| -------------- | --------------- | ------------------------- | ------------------------ |
| `state`        | `PmEditorState` | `undefined`               | The current editor state |
| `codeNodeType` | `NodeType`      | `schema.nodes.code_block` | -                        |

## Returns

`boolean`

`true` if the selection's parent node is a code block, `false` otherwise

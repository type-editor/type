[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / [schema](../README.md) / tableNodes

# Function: tableNodes()

```ts
function tableNodes(options): TableNodes;
```

Defined in: [tables/src/schema.ts:305](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/schema.ts#L305)

Creates node specifications for table-related nodes.

This function generates a set of [https://prosemirror.net/docs/ref/#model.NodeSpec\|NodeSpec](https://prosemirror.net/docs/ref/#model.NodeSpec|NodeSpec)
objects for `table`, `table_row`, `table_cell`, and `table_header` node types.
The result can be spread into your schema's nodes when creating a new schema.

## Parameters

| Parameter | Type                                                      | Description                                |
| --------- | --------------------------------------------------------- | ------------------------------------------ |
| `options` | [`TableNodesOptions`](../interfaces/TableNodesOptions.md) | Configuration options for the table nodes. |

## Returns

[`TableNodes`](../type-aliases/TableNodes.md)

An object containing node specifications for all table-related nodes.

## Example

```typescript
import { Schema } from "prosemirror-model";
import { tableNodes } from "./schema";

const schema = new Schema({
  nodes: {
    doc: { content: "block+" },
    paragraph: { group: "block", content: "text*" },
    text: {},
    ...tableNodes({
      tableGroup: "block",
      cellContent: "paragraph+",
      cellAttributes: {},
    }),
  },
});
```

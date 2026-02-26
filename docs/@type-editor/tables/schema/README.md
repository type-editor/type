[**Type Editor**](../../../README.md)

---

[Type Editor](../../../index.md) / [@type-editor/tables](../README.md) / schema

# schema

Helper utilities for creating a ProseMirror schema that supports tables.

This module provides functions to generate node specifications for table-related
nodes (table, row, cell, header) and utilities for working with table node types.

## Interfaces

<table>
<thead>
<tr>
<th>Interface</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[CellAttributes](interfaces/CellAttributes.md)

</td>
<td>

Configuration for a custom cell attribute.

Custom cell attributes allow extending table cells with additional
properties that are persisted in the document and serialized to HTML.

</td>
</tr>
<tr>
<td>

[TableNodesOptions](interfaces/TableNodesOptions.md)

</td>
<td>

Options for configuring table node specifications.

</td>
</tr>
</tbody>
</table>

## Type Aliases

<table>
<thead>
<tr>
<th>Type Alias</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[getFromDOM](type-aliases/getFromDOM.md)

</td>
<td>

Function type for reading an attribute value from a DOM element.

</td>
</tr>
<tr>
<td>

[setDOMAttr](type-aliases/setDOMAttr.md)

</td>
<td>

Function type for setting an attribute value on a DOM attributes object.

</td>
</tr>
<tr>
<td>

[TableNodes](type-aliases/TableNodes.md)

</td>
<td>

Record type for the table node specifications.

Contains node specs for all four table-related node types.

</td>
</tr>
<tr>
<td>

[TableRole](type-aliases/TableRole.md)

</td>
<td>

Identifies the role of a node within a table structure.

- `'table'`: The root table node
- `'row'`: A table row node
- `'cell'`: A regular table cell (td)
- `'header_cell'`: A header table cell (th)

</td>
</tr>
</tbody>
</table>

## Functions

<table>
<thead>
<tr>
<th>Function</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[tableNodes](functions/tableNodes.md)

</td>
<td>

Creates node specifications for table-related nodes.

This function generates a set of [https://prosemirror.net/docs/ref/#model.NodeSpec\|NodeSpec](https://prosemirror.net/docs/ref/#model.NodeSpec|NodeSpec)
objects for `table`, `table_row`, `table_cell`, and `table_header` node types.
The result can be spread into your schema's nodes when creating a new schema.

**Example**

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

</td>
</tr>
<tr>
<td>

[tableNodeTypes](functions/tableNodeTypes.md)

</td>
<td>

Retrieves the table-related node types from a schema.

This function returns a mapping from table roles to their corresponding
NodeType objects. Results are cached on the schema for performance.

**Example**

```typescript
const types = tableNodeTypes(schema);
const cellType = types.cell;
const headerType = types.header_cell;
```

</td>
</tr>
</tbody>
</table>

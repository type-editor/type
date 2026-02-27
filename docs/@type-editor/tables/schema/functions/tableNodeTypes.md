[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / [schema](../README.md) / tableNodeTypes

# Function: tableNodeTypes()

```ts
function tableNodeTypes(schema): Record<TableRole, NodeType>;
```

Defined in: [tables/src/schema.ts:389](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/tables/src/schema.ts#L389)

Retrieves the table-related node types from a schema.

This function returns a mapping from table roles to their corresponding
NodeType objects. Results are cached on the schema for performance.

## Parameters

| Parameter | Type     | Description                                        |
| --------- | -------- | -------------------------------------------------- |
| `schema`  | `Schema` | The ProseMirror schema to extract node types from. |

## Returns

`Record`&lt;[`TableRole`](../type-aliases/TableRole.md), `NodeType`&gt;

A record mapping table roles to their NodeType objects.

## Example

```typescript
const types = tableNodeTypes(schema);
const cellType = types.cell;
const headerType = types.header_cell;
```

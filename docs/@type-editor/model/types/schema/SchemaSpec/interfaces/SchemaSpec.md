[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [types/schema/SchemaSpec](../README.md) / SchemaSpec

# Interface: SchemaSpec&lt;Nodes, Marks&gt;

Defined in: [packages/model/src/types/schema/SchemaSpec.ts:14](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/types/schema/SchemaSpec.ts#L14)

An object describing a schema, as passed to the [`Schema`](#model.Schema)
constructor.

## Type Parameters

| Type Parameter             | Default type | Description                                                              |
| -------------------------- | ------------ | ------------------------------------------------------------------------ |
| `Nodes` _extends_ `string` | `string`     | A string literal type representing the names of node types in the schema |
| `Marks` _extends_ `string` | `string`     | A string literal type representing the names of mark types in the schema |

## Properties

| Property                                 | Type                                                                                                                                                       | Description                                                                                                                                                                                                                                                                                                                        | Defined in                                                                                                                                                                              |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-marks"></a> `marks?`     | \| `OrderedMap`&lt;[`MarkSpec`](../../MarkSpec/interfaces/MarkSpec.md)&gt; \| `Record`&lt;`Marks`, [`MarkSpec`](../../MarkSpec/interfaces/MarkSpec.md)&gt; | The mark types that exist in this schema. The order in which they are provided determines the order in which [mark sets](#model.Mark.addToSet) are sorted and in which [parse rules](#model.MarkSpec.parseDOM) are tried.                                                                                                          | [packages/model/src/types/schema/SchemaSpec.ts:33](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/types/schema/SchemaSpec.ts#L33) |
| <a id="property-nodes"></a> `nodes`      | \| `OrderedMap`&lt;[`NodeSpec`](../../NodeSpec/interfaces/NodeSpec.md)&gt; \| `Record`&lt;`Nodes`, [`NodeSpec`](../../NodeSpec/interfaces/NodeSpec.md)&gt; | The node types in this schema. Maps names to [`NodeSpec`](#model.NodeSpec) objects that describe the node type associated with that name. Their order is significant—it determines which [parse rules](#model.NodeSpec.parseDOM) take precedence by default, and which nodes come first in a given [group](#model.NodeSpec.group). | [packages/model/src/types/schema/SchemaSpec.ts:24](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/types/schema/SchemaSpec.ts#L24) |
| <a id="property-topnode"></a> `topNode?` | `string`                                                                                                                                                   | The name of the default top-level node for the schema. Defaults to `'doc'`.                                                                                                                                                                                                                                                        | [packages/model/src/types/schema/SchemaSpec.ts:39](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/types/schema/SchemaSpec.ts#L39) |

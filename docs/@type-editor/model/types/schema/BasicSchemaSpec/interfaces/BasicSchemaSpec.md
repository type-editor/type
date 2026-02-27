[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [types/schema/BasicSchemaSpec](../README.md) / BasicSchemaSpec

# Interface: BasicSchemaSpec&lt;NodeSpec, MarkSpec&gt;

Defined in: [packages/model/src/types/schema/BasicSchemaSpec.ts:10](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/schema/BasicSchemaSpec.ts#L10)

A basic schema specification with ordered maps for nodes and marks.
This is a simplified version of SchemaSpec that uses OrderedMap directly.

## Type Parameters

| Type Parameter | Description                      |
| -------------- | -------------------------------- |
| `NodeSpec`     | The type for node specifications |
| `MarkSpec`     | The type for mark specifications |

## Properties

| Property                                 | Type                           | Description                                                                                                   | Defined in                                                                                                                                                                                        |
| ---------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-marks"></a> `marks`      | `OrderedMap`&lt;`MarkSpec`&gt; | An ordered map of mark specifications. The order determines mark set sorting and parsing rule priority.       | [packages/model/src/types/schema/BasicSchemaSpec.ts:21](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/schema/BasicSchemaSpec.ts#L21) |
| <a id="property-nodes"></a> `nodes`      | `OrderedMap`&lt;`NodeSpec`&gt; | An ordered map of node specifications. The order determines parsing precedence and group membership priority. | [packages/model/src/types/schema/BasicSchemaSpec.ts:15](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/schema/BasicSchemaSpec.ts#L15) |
| <a id="property-topnode"></a> `topNode?` | `string`                       | The name of the default top-level node for the schema. Defaults to `'doc'`.                                   | [packages/model/src/types/schema/BasicSchemaSpec.ts:27](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/model/src/types/schema/BasicSchemaSpec.ts#L27) |

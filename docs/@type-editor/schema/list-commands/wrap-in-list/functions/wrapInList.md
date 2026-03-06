[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/schema](../../../README.md) / [list-commands/wrap-in-list](../README.md) / wrapInList

# Function: wrapInList()

```ts
function wrapInList(listType, attrs?, unwrapOnly?): Command;
```

Defined in: [list-commands/wrap-in-list.ts:115](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/schema/src/list-commands/wrap-in-list.ts#L115)

Returns a command function that wraps the selection in a list with
the given type and attributes. If already inside a list of the same type,
it will unwrap (lift) the content out of the list instead (toggle behavior).
If inside a list of a different type, it will convert the list to the
requested type.

If `dispatch` is null, only return a value to indicate whether this is
possible, but don't actually perform the change.

This command will attempt to wrap the currently selected block range
in a list of the specified type. The command returns `false` if the
selection cannot be wrapped (e.g., if there's no valid block range),
and `true` if the wrapping/unwrapping/conversion is possible or has been performed.

## Parameters

| Parameter    | Type                                              | Default value | Description                                                                           |
| ------------ | ------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------- |
| `listType`   | `NodeType`                                        | `undefined`   | The node type to use for the list wrapper (e.g., bullet_list or ordered_list)         |
| `attrs`      | `Readonly`&lt;`Record`&lt;`string`, `any`&gt;&gt; | `null`        | Optional attributes to apply to the list node. Defaults to null.                      |
| `unwrapOnly` | `boolean`                                         | `false`       | If true, only unwrap/lift the list if already in one, without wrapping or converting. |

## Returns

`Command`

A command function that takes an editor state and optional dispatch function.
Returns `true` if the wrap/unwrap/convert operation is possible/successful, `false` otherwise.

## Example

```typescript
// Wrap selection in a bullet list (or unwrap if already in one)
const command = wrapInList(schema.nodes.bullet_list);
command(state, dispatch);

// Wrap selection in an ordered list with custom attributes
const orderedCommand = wrapInList(schema.nodes.ordered_list, { start: 1 });
orderedCommand(state, dispatch);

// Convert an existing bullet list to ordered list
// (when cursor is inside a bullet_list, calling wrapInList with ordered_list will convert it)
```

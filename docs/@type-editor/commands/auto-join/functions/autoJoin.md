[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/commands](../../README.md) / [auto-join](../README.md) / autoJoin

# Function: autoJoin()

```ts
function autoJoin(command, isJoinable): Command;
```

Defined in: [auto-join.ts:34](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/commands/src/auto-join.ts#L34)

Wraps a command to automatically join adjacent nodes when they become joinable
after the command executes.

This higher-order function takes a command and a joinability criterion, and returns
a new command that will automatically join adjacent nodes that meet the criterion
after the original command's transformation is applied.

Nodes are considered joinable when they are of the same type and when the
`isJoinable` predicate returns true for them. If an array of strings is passed
instead, nodes are joinable if their type name is in the array.

## Parameters

| Parameter    | Type                                                    | Description                                                                                                                       |
| ------------ | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `command`    | `Command`                                               | The command to wrap with auto-joining behavior                                                                                    |
| `isJoinable` | readonly `string`[] \| (`before`, `after`) => `boolean` | Either a predicate function that determines if two nodes can be joined, or an array of node type names that should be auto-joined |

## Returns

`Command`

A new command with auto-joining behavior

## Example

```typescript
// Join nodes of specific types
const wrappedCommand = autoJoin(myCommand, ["paragraph", "heading"]);

// Join nodes based on custom logic
const wrappedCommand = autoJoin(myCommand, (before, after) => {
  return before.attrs.level === after.attrs.level;
});
```

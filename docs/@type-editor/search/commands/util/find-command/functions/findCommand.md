[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/search](../../../../README.md) / [commands/util/find-command](../README.md) / findCommand

# Function: findCommand()

```ts
function findCommand(wrap, dir): Command;
```

Defined in: [commands/util/find-command.ts:18](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/search/src/commands/util/find-command.ts#L18)

Factory function that creates a command for finding the next or previous search match.

## Parameters

| Parameter | Type        | Description                                         |
| --------- | ----------- | --------------------------------------------------- |
| `wrap`    | `boolean`   | Whether to wrap around at document boundaries       |
| `dir`     | `-1` \| `1` | Direction to search: 1 for forward, -1 for backward |

## Returns

`Command`

A command that finds and selects the next or previous match

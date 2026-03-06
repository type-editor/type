[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/go-to-next-cell](../README.md) / goToNextCell

# Function: goToNextCell()

```ts
function goToNextCell(direction): Command;
```

Defined in: [tables/src/commands/go-to-next-cell.ts:19](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/tables/src/commands/go-to-next-cell.ts#L19)

Creates a command for selecting the next or previous cell in a table.

## Parameters

| Parameter   | Type                                                                    | Description                                              |
| ----------- | ----------------------------------------------------------------------- | -------------------------------------------------------- |
| `direction` | [`Direction`](../../../types/input/Direction/type-aliases/Direction.md) | Direction to move: 1 for next cell, -1 for previous cell |

## Returns

`Command`

A command that navigates to the adjacent cell

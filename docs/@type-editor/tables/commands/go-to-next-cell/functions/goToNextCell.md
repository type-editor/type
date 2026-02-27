[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [commands/go-to-next-cell](../README.md) / goToNextCell

# Function: goToNextCell()

```ts
function goToNextCell(direction): Command;
```

Defined in: [tables/src/commands/go-to-next-cell.ts:19](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/tables/src/commands/go-to-next-cell.ts#L19)

Creates a command for selecting the next or previous cell in a table.

## Parameters

| Parameter   | Type                                                                    | Description                                              |
| ----------- | ----------------------------------------------------------------------- | -------------------------------------------------------- |
| `direction` | [`Direction`](../../../types/input/Direction/type-aliases/Direction.md) | Direction to move: 1 for next cell, -1 for previous cell |

## Returns

`Command`

A command that navigates to the adjacent cell

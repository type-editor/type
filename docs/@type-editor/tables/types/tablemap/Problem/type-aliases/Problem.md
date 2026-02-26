[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/tables](../../../../README.md) / [types/tablemap/Problem](../README.md) / Problem

# Type Alias: Problem

```ts
type Problem =
  | {
      colwidth: ColWidths;
      pos: number;
      type: "colwidth mismatch";
    }
  | {
      n: number;
      pos: number;
      row: number;
      type: "collision";
    }
  | {
      n: number;
      row: number;
      type: "missing";
    }
  | {
      n: number;
      pos: number;
      type: "overlong_rowspan";
    }
  | {
      type: "zero_sized";
    };
```

Defined in: [tables/src/types/tablemap/Problem.ts:7](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/tablemap/Problem.ts#L7)

Represents a problem detected in table structure during map computation.
Problems are used by the table normalizer to fix structural issues.

## Type Declaration

```ts
{
  colwidth: ColWidths;
  pos: number;
  type: "colwidth mismatch";
}
```

| Name       | Type                                                     | Description                                            | Defined in                                                                                                                                                                     |
| ---------- | -------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `colwidth` | [`ColWidths`](../../ColWidths/type-aliases/ColWidths.md) | The expected column widths                             | [tables/src/types/tablemap/Problem.ts:14](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/tablemap/Problem.ts#L14) |
| `pos`      | `number`                                                 | Table-relative position of the problematic cell        | [tables/src/types/tablemap/Problem.ts:12](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/tablemap/Problem.ts#L12) |
| `type`     | `"colwidth mismatch"`                                    | Column width mismatch between cells in the same column | [tables/src/types/tablemap/Problem.ts:10](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/tablemap/Problem.ts#L10) |

```ts
{
  n: number;
  pos: number;
  row: number;
  type: "collision";
}
```

| Name   | Type          | Description                                              | Defined in                                                                                                                                                                     |
| ------ | ------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `n`    | `number`      | Number of overlapping columns                            | [tables/src/types/tablemap/Problem.ts:24](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/tablemap/Problem.ts#L24) |
| `pos`  | `number`      | Table-relative position of the colliding cell            | [tables/src/types/tablemap/Problem.ts:20](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/tablemap/Problem.ts#L20) |
| `row`  | `number`      | Row index where collision occurred                       | [tables/src/types/tablemap/Problem.ts:22](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/tablemap/Problem.ts#L22) |
| `type` | `"collision"` | Cell collision - multiple cells occupy the same position | [tables/src/types/tablemap/Problem.ts:18](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/tablemap/Problem.ts#L18) |

```ts
{
  n: number;
  row: number;
  type: "missing";
}
```

| Name   | Type        | Description                  | Defined in                                                                                                                                                                     |
| ------ | ----------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `n`    | `number`    | Number of missing cells      | [tables/src/types/tablemap/Problem.ts:32](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/tablemap/Problem.ts#L32) |
| `row`  | `number`    | Row index with missing cells | [tables/src/types/tablemap/Problem.ts:30](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/tablemap/Problem.ts#L30) |
| `type` | `"missing"` | Missing cells in a row       | [tables/src/types/tablemap/Problem.ts:28](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/tablemap/Problem.ts#L28) |

```ts
{
  n: number;
  pos: number;
  type: "overlong_rowspan";
}
```

| Name   | Type                 | Description                                               | Defined in                                                                                                                                                                     |
| ------ | -------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `n`    | `number`             | Number of rows that extend beyond the table               | [tables/src/types/tablemap/Problem.ts:40](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/tablemap/Problem.ts#L40) |
| `pos`  | `number`             | Table-relative position of the cell with overlong rowspan | [tables/src/types/tablemap/Problem.ts:38](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/tablemap/Problem.ts#L38) |
| `type` | `"overlong_rowspan"` | Rowspan extends beyond table height                       | [tables/src/types/tablemap/Problem.ts:36](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/tablemap/Problem.ts#L36) |

```ts
{
  type: "zero_sized";
}
```

| Name   | Type           | Description                    | Defined in                                                                                                                                                                     |
| ------ | -------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `type` | `"zero_sized"` | Table has zero width or height | [tables/src/types/tablemap/Problem.ts:44](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/tables/src/types/tablemap/Problem.ts#L44) |

[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [types/content-parser/ContentPattern](../README.md) / ContentPattern

# Type Alias: ContentPattern

```ts
type ContentPattern =
  | {
      exprs: ContentPattern[];
      type: "choice";
    }
  | {
      exprs: ContentPattern[];
      type: "seq";
    }
  | {
      expr: ContentPattern;
      type: "plus";
    }
  | {
      expr: ContentPattern;
      type: "star";
    }
  | {
      expr: ContentPattern;
      type: "opt";
    }
  | {
      expr: ContentPattern;
      max: number;
      min: number;
      type: "range";
    }
  | {
      type: "name";
      value: NodeType;
    };
```

Defined in: [packages/model/src/types/content-parser/ContentPattern.ts:7](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L7)

Expression types representing different patterns in content expressions.
These form the abstract syntax tree of a parsed content expression.

## Type Declaration

```ts
{
  exprs: ContentPattern[];
  type: "choice";
}
```

| Name    | Type               | Defined in                                                                                                                                                                                                    |
| ------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `exprs` | `ContentPattern`[] | [packages/model/src/types/content-parser/ContentPattern.ts:9](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L9) |
| `type`  | `"choice"`         | [packages/model/src/types/content-parser/ContentPattern.ts:9](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L9) |

Choice between multiple expressions (e.g., "a | b")

```ts
{
  exprs: ContentPattern[];
  type: "seq";
}
```

| Name    | Type               | Defined in                                                                                                                                                                                                      |
| ------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `exprs` | `ContentPattern`[] | [packages/model/src/types/content-parser/ContentPattern.ts:11](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L11) |
| `type`  | `"seq"`            | [packages/model/src/types/content-parser/ContentPattern.ts:11](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L11) |

Sequence of expressions (e.g., "a b c")

```ts
{
  expr: ContentPattern;
  type: "plus";
}
```

| Name   | Type             | Defined in                                                                                                                                                                                                      |
| ------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `expr` | `ContentPattern` | [packages/model/src/types/content-parser/ContentPattern.ts:13](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L13) |
| `type` | `"plus"`         | [packages/model/src/types/content-parser/ContentPattern.ts:13](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L13) |

One or more repetitions (e.g., "a+")

```ts
{
  expr: ContentPattern;
  type: "star";
}
```

| Name   | Type             | Defined in                                                                                                                                                                                                      |
| ------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `expr` | `ContentPattern` | [packages/model/src/types/content-parser/ContentPattern.ts:15](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L15) |
| `type` | `"star"`         | [packages/model/src/types/content-parser/ContentPattern.ts:15](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L15) |

Zero or more repetitions (e.g., "a\*")

```ts
{
  expr: ContentPattern;
  type: "opt";
}
```

| Name   | Type             | Defined in                                                                                                                                                                                                      |
| ------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `expr` | `ContentPattern` | [packages/model/src/types/content-parser/ContentPattern.ts:17](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L17) |
| `type` | `"opt"`          | [packages/model/src/types/content-parser/ContentPattern.ts:17](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L17) |

Optional expression (e.g., "a?")

```ts
{
  expr: ContentPattern;
  max: number;
  min: number;
  type: "range";
}
```

| Name   | Type             | Defined in                                                                                                                                                                                                      |
| ------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `expr` | `ContentPattern` | [packages/model/src/types/content-parser/ContentPattern.ts:19](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L19) |
| `max`  | `number`         | [packages/model/src/types/content-parser/ContentPattern.ts:19](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L19) |
| `min`  | `number`         | [packages/model/src/types/content-parser/ContentPattern.ts:19](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L19) |
| `type` | `"range"`        | [packages/model/src/types/content-parser/ContentPattern.ts:19](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L19) |

Ranged repetition (e.g., "a{2,5}")

```ts
{
  type: "name";
  value: NodeType;
}
```

| Name    | Type                                                          | Defined in                                                                                                                                                                                                      |
| ------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`  | `"name"`                                                      | [packages/model/src/types/content-parser/ContentPattern.ts:21](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L21) |
| `value` | [`NodeType`](../../../../schema/NodeType/classes/NodeType.md) | [packages/model/src/types/content-parser/ContentPattern.ts:21](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/types/content-parser/ContentPattern.ts#L21) |

Named node type or group reference

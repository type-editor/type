[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/changeset](../../../README.md) / [types/TokenEncoder](../README.md) / TokenEncoder

# Interface: TokenEncoder&lt;T&gt;

Defined in: [types/TokenEncoder.ts:14](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/changeset/src/types/TokenEncoder.ts#L14)

A token encoder can be passed when creating a `ChangeSet` in order
to influence the way the library runs its diffing algorithm. The
encoder determines how document tokens (such as nodes and
characters) are encoded and compared.

Note that both the encoding and the comparison may run a lot, and
doing non-trivial work in these functions could impact
performance.

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Methods

### compareTokens()

```ts
compareTokens(a, b): boolean;
```

Defined in: [types/TokenEncoder.ts:51](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/changeset/src/types/TokenEncoder.ts#L51)

Compare the given tokens. Should return true when they count as
equal.

#### Parameters

| Parameter | Type | Description                  |
| --------- | ---- | ---------------------------- |
| `a`       | `T`  | The first token to compare.  |
| `b`       | `T`  | The second token to compare. |

#### Returns

`boolean`

True if the tokens are equal, false otherwise.

---

### encodeCharacter()

```ts
encodeCharacter(char, marks): T;
```

Defined in: [types/TokenEncoder.ts:23](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/changeset/src/types/TokenEncoder.ts#L23)

Encode a given character, with the given marks applied.

#### Parameters

| Parameter | Type              | Description                         |
| --------- | ----------------- | ----------------------------------- |
| `char`    | `number`          | The character code to encode.       |
| `marks`   | readonly `Mark`[] | The marks applied to the character. |

#### Returns

`T`

The encoded representation of the character.

---

### encodeNodeEnd()

```ts
encodeNodeEnd(node): T;
```

Defined in: [types/TokenEncoder.ts:41](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/changeset/src/types/TokenEncoder.ts#L41)

Encode the end token for the given node. It is valid to encode
every end token in the same way.

#### Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `node`    | `Node_2` | The node to encode the end token for. |

#### Returns

`T`

The encoded representation of the node end.

---

### encodeNodeStart()

```ts
encodeNodeStart(node): T;
```

Defined in: [types/TokenEncoder.ts:32](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/changeset/src/types/TokenEncoder.ts#L32)

Encode the start of a node or, if this is a leaf node, the
entire node.

#### Parameters

| Parameter | Type     | Description         |
| --------- | -------- | ------------------- |
| `node`    | `Node_2` | The node to encode. |

#### Returns

`T`

The encoded representation of the node start.

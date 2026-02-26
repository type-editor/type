[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [content-parser/TokenStream](../README.md) / TokenStream

# Class: TokenStream

Defined in: [packages/model/src/content-parser/TokenStream.ts:7](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/content-parser/TokenStream.ts#L7)

Tokenizes and provides streaming access to a content expression string.
Splits the expression into individual tokens for parsing.

## Constructors

### Constructor

```ts
new TokenStream(expression, nodeTypes): TokenStream;
```

Defined in: [packages/model/src/content-parser/TokenStream.ts:26](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/content-parser/TokenStream.ts#L26)

Creates a new token stream from a content expression string.

#### Parameters

| Parameter    | Type                                                                                                   | Description                                     |
| ------------ | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| `expression` | `string`                                                                                               | The content expression to tokenize              |
| `nodeTypes`  | `Readonly`&lt;`Record`&lt;`string`, [`NodeType`](../../../schema/NodeType/classes/NodeType.md)&gt;&gt; | Map of available node types for name resolution |

#### Returns

`TokenStream`

## Accessors

### inline

#### Get Signature

```ts
get inline(): boolean;
```

Defined in: [packages/model/src/content-parser/TokenStream.ts:48](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/content-parser/TokenStream.ts#L48)

Tracks whether the expression contains inline content (true),
block content (false), or hasn't been determined yet (null).
Used to prevent mixing inline and block content in expressions.

##### Returns

`boolean`

#### Set Signature

```ts
set inline(isInline): void;
```

Defined in: [packages/model/src/content-parser/TokenStream.ts:52](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/content-parser/TokenStream.ts#L52)

##### Parameters

| Parameter  | Type      |
| ---------- | --------- |
| `isInline` | `boolean` |

##### Returns

`void`

---

### next

#### Get Signature

```ts
get next(): string;
```

Defined in: [packages/model/src/content-parser/TokenStream.ts:88](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/content-parser/TokenStream.ts#L88)

Gets the current token without consuming it.

##### Returns

`string`

The current token, or undefined if at end of stream

---

### nodeTypes

#### Get Signature

```ts
get nodeTypes(): Readonly<Record<string, NodeType>>;
```

Defined in: [packages/model/src/content-parser/TokenStream.ts:79](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/content-parser/TokenStream.ts#L79)

Map of available node types for name resolution

##### Returns

`Readonly`&lt;`Record`&lt;`string`, [`NodeType`](../../../schema/NodeType/classes/NodeType.md)&gt;&gt;

---

### pos

#### Get Signature

```ts
get pos(): number;
```

Defined in: [packages/model/src/content-parser/TokenStream.ts:59](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/content-parser/TokenStream.ts#L59)

Current position in the token array

##### Returns

`number`

#### Set Signature

```ts
set pos(position): void;
```

Defined in: [packages/model/src/content-parser/TokenStream.ts:69](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/content-parser/TokenStream.ts#L69)

Current position in the token array

##### Throws

If position is negative

##### Parameters

| Parameter  | Type     |
| ---------- | -------- |
| `position` | `number` |

##### Returns

`void`

## Methods

### eat()

```ts
eat(tok): boolean;
```

Defined in: [packages/model/src/content-parser/TokenStream.ts:99](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/content-parser/TokenStream.ts#L99)

Attempts to consume a specific token.
If the current token matches, advances the position and returns true.

#### Parameters

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `tok`     | `string` | The token to try to consume |

#### Returns

`boolean`

true if the token was consumed, false otherwise

---

### err()

```ts
err(str): never;
```

Defined in: [packages/model/src/content-parser/TokenStream.ts:113](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/content-parser/TokenStream.ts#L113)

Throws a syntax error with context about the content expression.

#### Parameters

| Parameter | Type     | Description       |
| --------- | -------- | ----------------- |
| `str`     | `string` | The error message |

#### Returns

`never`

#### Throws

Always throws with the provided message and expression context

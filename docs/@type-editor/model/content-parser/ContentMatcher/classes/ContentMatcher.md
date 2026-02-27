[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [content-parser/ContentMatcher](../README.md) / ContentMatcher

# Class: ContentMatcher

Defined in: [packages/model/src/content-parser/ContentMatcher.ts:20](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/content-parser/ContentMatcher.ts#L20)

Compiles content expressions into a deterministic finite automaton (DFA).

The compilation process follows these steps:

1. Build a Non-deterministic Finite Automaton (NFA) from the expression AST
2. Convert the NFA to a DFA using subset construction
3. Validate the DFA for dead-end states (non-generatable required content)

For background on NFA/DFA construction, see:
https://swtch.com/~rsc/regexp/regexp1.html

## Constructors

### Constructor

```ts
new ContentMatcher(expression): ContentMatcher;
```

Defined in: [packages/model/src/content-parser/ContentMatcher.ts:35](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/content-parser/ContentMatcher.ts#L35)

Creates a new content matcher and compiles the expression into a DFA.

#### Parameters

| Parameter    | Type                                                                                            | Description                          |
| ------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------ |
| `expression` | [`ContentPattern`](../../../types/content-parser/ContentPattern/type-aliases/ContentPattern.md) | The parsed expression AST to compile |

#### Returns

`ContentMatcher`

## Accessors

### match

#### Get Signature

```ts
get match(): ContentMatch;
```

Defined in: [packages/model/src/content-parser/ContentMatcher.ts:46](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/content-parser/ContentMatcher.ts#L46)

Gets the compiled content match automaton.

##### Returns

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md)

The compiled ContentMatch DFA

## Methods

### getCheckedMatch()

```ts
getCheckedMatch(stream): ContentMatch;
```

Defined in: [packages/model/src/content-parser/ContentMatcher.ts:57](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/content-parser/ContentMatcher.ts#L57)

Gets the compiled content match after validating it for dead ends.

#### Parameters

| Parameter | Type                                                      | Description                                 |
| --------- | --------------------------------------------------------- | ------------------------------------------- |
| `stream`  | [`TokenStream`](../../TokenStream/classes/TokenStream.md) | The token stream (used for error reporting) |

#### Returns

[`ContentMatch`](../../../types/content-parser/ContentMatch/interfaces/ContentMatch.md)

The compiled and validated ContentMatch DFA

#### Throws

If the expression contains unreachable or non-generatable content

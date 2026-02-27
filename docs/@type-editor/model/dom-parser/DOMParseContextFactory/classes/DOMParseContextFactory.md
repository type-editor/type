[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [dom-parser/DOMParseContextFactory](../README.md) / DOMParseContextFactory

# Class: DOMParseContextFactory

Defined in: [packages/model/src/dom-parser/DOMParseContextFactory.ts:7](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/dom-parser/DOMParseContextFactory.ts#L7)

## Constructors

### Constructor

```ts
new DOMParseContextFactory(): DOMParseContextFactory;
```

#### Returns

`DOMParseContextFactory`

## Methods

### createParseContext()

```ts
static createParseContext(
   domParser,
   parseOptions,
   isOpen): DOMParseContext;
```

Defined in: [packages/model/src/dom-parser/DOMParseContextFactory.ts:17](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/dom-parser/DOMParseContextFactory.ts#L17)

Creates a new parse context instance

#### Parameters

| Parameter      | Type                                                                                | Description                                            |
| -------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `domParser`    | [`DOMParser`](../../DOMParser/classes/DOMParser.md)                                 | The DOM parser instance to use for parsing             |
| `parseOptions` | [`ParseOptions`](../../../types/dom-parser/ParseOptions/interfaces/ParseOptions.md) | Configuration options for the parsing operation        |
| `isOpen`       | `boolean`                                                                           | Whether the context should be created in an open state |

#### Returns

[`DOMParseContext`](../../../types/dom-parser/DOMParseContext/interfaces/DOMParseContext.md)

A new parse context instance

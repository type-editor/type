[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [types/dom-parser/DOMParseContext](../README.md) / DOMParseContext

# Interface: DOMParseContext

Defined in: [packages/model/src/types/dom-parser/DOMParseContext.ts:14](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/types/dom-parser/DOMParseContext.ts#L14)

Interface for parsing context that manages the state during DOM to ProseMirror conversion.

## Remarks

The parse context maintains a stack of node contexts and handles the conversion
of DOM nodes into ProseMirror nodes while respecting schema constraints and parse rules.

## Properties

| Property                                      | Modifier   | Type                                                                        | Description                                                                                                                                                                       | Defined in                                                                                                                                                                                                |
| --------------------------------------------- | ---------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-currentpos"></a> `currentPos` | `readonly` | `number`                                                                    | The current position in the document being constructed. **Remarks** This position is calculated based on the content added so far and is used for tracking DOM position mappings. | [packages/model/src/types/dom-parser/DOMParseContext.ts:31](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/types/dom-parser/DOMParseContext.ts#L31) |
| <a id="property-top"></a> `top`               | `readonly` | [`NodeParseContext`](../../NodeParseContext/interfaces/NodeParseContext.md) | The currently active node context at the top of the context stack. **Remarks** This represents the node being currently built during parsing.                                     | [packages/model/src/types/dom-parser/DOMParseContext.ts:22](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/types/dom-parser/DOMParseContext.ts#L22) |

## Methods

### addAll()

```ts
addAll(
   parent,
   marks,
   startIndex?,
   endIndex?): void;
```

Defined in: [packages/model/src/types/dom-parser/DOMParseContext.ts:45](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/types/dom-parser/DOMParseContext.ts#L45)

Parses and adds all child nodes from a DOM element to the current context.

#### Parameters

| Parameter     | Type                                                           | Description                                                 |
| ------------- | -------------------------------------------------------------- | ----------------------------------------------------------- |
| `parent`      | `Node`                                                         | The DOM node whose children should be parsed                |
| `marks`       | readonly [`Mark`](../../../../elements/Mark/classes/Mark.md)[] | The marks to apply to the parsed content                    |
| `startIndex?` | `number`                                                       | Optional starting index of child nodes to parse (inclusive) |
| `endIndex?`   | `number`                                                       | Optional ending index of child nodes to parse (exclusive)   |

#### Returns

`void`

#### Remarks

If startIndex and endIndex are not provided, all children are parsed.
The method handles position tracking and synchronization after block elements.

---

### finish()

```ts
finish():
  | Fragment
  | Node;
```

Defined in: [packages/model/src/types/dom-parser/DOMParseContext.ts:59](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/types/dom-parser/DOMParseContext.ts#L59)

Completes the parsing process and returns the final result.

#### Returns

\| [`Fragment`](../../../../elements/Fragment/classes/Fragment.md)
\| [`Node`](../../../../elements/Node/classes/Node.md)

The parsed content as either a complete Node or a Fragment

#### Remarks

This method closes all open node contexts and performs final validation
and content filling according to schema requirements.

---

### matchesContext()

```ts
matchesContext(context): boolean;
```

Defined in: [packages/model/src/types/dom-parser/DOMParseContext.ts:72](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/model/src/types/dom-parser/DOMParseContext.ts#L72)

Checks whether a context string matches the current parsing context.

#### Parameters

| Parameter | Type     | Description                                                               |
| --------- | -------- | ------------------------------------------------------------------------- |
| `context` | `string` | A context string to match against, supporting pipe-separated alternatives |

#### Returns

`boolean`

True if the context matches, false otherwise

#### Remarks

Context strings use slash-separated node type names to specify ancestor chains.
Empty string segments act as wildcards. Pipe characters separate alternative contexts.
Example: "doc/blockquote/" matches a blockquote with any descendant in a doc.

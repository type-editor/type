[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/util/document-is-not-empty](../README.md) / documentIsNotEmpty

# Function: documentIsNotEmpty()

```ts
function documentIsNotEmpty(state): boolean;
```

Defined in: [packages/menu/src/menu-items/util/document-is-not-empty.ts:13](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/menu/src/menu-items/util/document-is-not-empty.ts#L13)

Checks if the document contains any meaningful content.

A document is considered empty if it has exactly one child that is an empty textblock
(e.g., an empty paragraph).

## Parameters

| Parameter | Type            | Description              |
| --------- | --------------- | ------------------------ |
| `state`   | `PmEditorState` | The current editor state |

## Returns

`boolean`

`true` if the document has content, `false` if it's empty

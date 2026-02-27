[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/view](../../../README.md) / [util/find-composition-node](../README.md) / findCompositionNode

# Function: findCompositionNode()

```ts
function findCompositionNode(view): Text;
```

Defined in: [util/find-composition-node.ts:13](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/view/src/util/find-composition-node.ts#L13)

Finds the text node where composition is occurring. Looks at text nodes
before and after the cursor, using heuristics to determine which one
is being composed in.

## Parameters

| Parameter | Type                                                      | Description     |
| --------- | --------------------------------------------------------- | --------------- |
| `view`    | [`EditorView`](../../../EditorView/classes/EditorView.md) | The editor view |

## Returns

`Text`

The text node being composed in, or null if none found

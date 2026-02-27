[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/view/decoration/DecorationSource](../README.md) / DecorationSource

# Interface: DecorationSource

Defined in: [packages/editor-types/src/types/view/decoration/DecorationSource.ts:14](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/decoration/DecorationSource.ts#L14)

An object that can [provide](#view.EditorProps.decorations)
decorations. Implemented by [`DecorationSet`](#view.DecorationSet),
and passed to [node views](#view.EditorProps.nodeViews).

This interface defines the contract for objects that manage decorations
in the editor.

## Properties

| Property                        | Type                                      | Description                                                         | Defined in                                                                                                                                                                                                                          |
| ------------------------------- | ----------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-map"></a> `map` | (`mapping`, `node`) => `DecorationSource` | Map the set of decorations in response to a change in the document. | [packages/editor-types/src/types/view/decoration/DecorationSource.ts:21](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/decoration/DecorationSource.ts#L21) |

## Methods

### eq()

```ts
eq(other): boolean;
```

Defined in: [packages/editor-types/src/types/view/decoration/DecorationSource.ts:45](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/decoration/DecorationSource.ts#L45)

**`Internal`**

Check equality with another decoration source.

#### Parameters

| Parameter | Type               | Description                  |
| --------- | ------------------ | ---------------------------- |
| `other`   | `DecorationSource` | The other decoration source. |

#### Returns

`boolean`

True if equal.

---

### forChild()

```ts
forChild(offset, child): DecorationSource;
```

Defined in: [packages/editor-types/src/types/view/decoration/DecorationSource.ts:37](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/decoration/DecorationSource.ts#L37)

Extract a DecorationSource containing decorations for the given child node at the given offset.

#### Parameters

| Parameter | Type     | Description                   |
| --------- | -------- | ----------------------------- |
| `offset`  | `number` | The offset of the child node. |
| `child`   | `Node_2` | The child node.               |

#### Returns

`DecorationSource`

DecorationSource for the child.

---

### forEachSet()

```ts
forEachSet(callbackFunc): void;
```

Defined in: [packages/editor-types/src/types/view/decoration/DecorationSource.ts:51](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/decoration/DecorationSource.ts#L51)

Call the given function for each decoration set in the group.

#### Parameters

| Parameter      | Type              | Description                               |
| -------------- | ----------------- | ----------------------------------------- |
| `callbackFunc` | (`set`) => `void` | Function to call for each decoration set. |

#### Returns

`void`

---

### locals()

```ts
locals(node): readonly PmDecoration[];
```

Defined in: [packages/editor-types/src/types/view/decoration/DecorationSource.ts:29](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/editor-types/src/types/view/decoration/DecorationSource.ts#L29)

**`Internal`**

Get local decorations for the given node.

#### Parameters

| Parameter | Type     | Description                      |
| --------- | -------- | -------------------------------- |
| `node`    | `Node_2` | The node to get decorations for. |

#### Returns

readonly [`PmDecoration`](../../PmDecoration/interfaces/PmDecoration.md)[]

Array of decorations.

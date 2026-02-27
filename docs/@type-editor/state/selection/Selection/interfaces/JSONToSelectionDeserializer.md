[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/state](../../../README.md) / [selection/Selection](../README.md) / JSONToSelectionDeserializer

# Interface: JSONToSelectionDeserializer

Defined in: [state/src/selection/Selection.ts:29](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L29)

## Constructors

### Constructor

```ts
new JSONToSelectionDeserializer(...args): any;
```

Defined in: [state/src/selection/Selection.ts:31](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L31)

#### Parameters

| Parameter | Type    |
| --------- | ------- |
| ...`args` | `any`[] |

#### Returns

`any`

## Methods

### fromJSON()

```ts
fromJSON(doc, json?): PmSelection;
```

Defined in: [state/src/selection/Selection.ts:32](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/state/src/selection/Selection.ts#L32)

#### Parameters

| Parameter | Type            |
| --------- | --------------- |
| `doc`     | `Node_2`        |
| `json?`   | `SelectionJSON` |

#### Returns

`PmSelection`

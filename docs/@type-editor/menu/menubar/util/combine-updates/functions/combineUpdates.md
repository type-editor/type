[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menubar/util/combine-updates](../README.md) / combineUpdates

# Function: combineUpdates()

```ts
function combineUpdates(updates, nodes): (state) => boolean;
```

Defined in: [packages/menu/src/menubar/util/combine-updates.ts:11](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/menubar/util/combine-updates.ts#L11)

Combines multiple update functions into a single update function.
Each update function controls the visibility of its corresponding node.

## Parameters

| Parameter | Type                              | Description                                              |
| --------- | --------------------------------- | -------------------------------------------------------- |
| `updates` | readonly (`state`) => `boolean`[] | Array of update functions to combine                     |
| `nodes`   | readonly `HTMLElement`[]          | Array of DOM nodes corresponding to each update function |

## Returns

A combined update function that returns true if any item is visible

```ts
(state): boolean;
```

### Parameters

| Parameter | Type            |
| --------- | --------------- |
| `state`   | `PmEditorState` |

### Returns

`boolean`

[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/tables](../../README.md) / [schema](../README.md) / setDOMAttr

# Type Alias: setDOMAttr()

```ts
type setDOMAttr = (value, attrs) => void;
```

Defined in: [tables/src/schema.ts:135](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/tables/src/schema.ts#L135)

Function type for setting an attribute value on a DOM attributes object.

## Parameters

| Parameter | Type                                                                    | Description                              |
| --------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| `value`   | `unknown`                                                               | The attribute value from the node.       |
| `attrs`   | [`MutableAttrs`](../../types/MutableAttrs/type-aliases/MutableAttrs.md) | The mutable attributes object to modify. |

## Returns

`void`

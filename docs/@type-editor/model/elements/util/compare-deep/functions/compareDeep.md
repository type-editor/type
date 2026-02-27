[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [elements/util/compare-deep](../README.md) / compareDeep

# Function: compareDeep()

```ts
function compareDeep<T>(value1, value2): boolean;
```

Defined in: [packages/model/src/elements/util/compare-deep.ts:36](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/model/src/elements/util/compare-deep.ts#L36)

Performs a deep equality comparison between two values.

This function recursively compares objects and arrays by their structure and content,
rather than by reference. It supports nested structures and handles various data types
including primitives, arrays, and plain objects.

**Comparison behavior:**

- Primitives are compared using Object.is (handles NaN correctly)
- Arrays are compared element-by-element (order matters)
- Objects are compared property-by-property (order doesn't matter)
- null and undefined are compared using strict equality
- Circular references are detected and handled safely

**Note:** This function is designed for comparing plain objects and arrays typically used
in ProseMirror attributes. It does not handle special object types like Date, RegExp,
Map, Set, or custom class instances.

## Type Parameters

| Type Parameter | Description                       |
| -------------- | --------------------------------- |
| `T`            | The type of values being compared |

## Parameters

| Parameter | Type | Description                 |
| --------- | ---- | --------------------------- |
| `value1`  | `T`  | The first value to compare  |
| `value2`  | `T`  | The second value to compare |

## Returns

`boolean`

`true` if the values are deeply equal, `false` otherwise

## Example

```typescript
compareDeep(1, 1); // true
compareDeep([1, 2], [1, 2]); // true
compareDeep({ a: 1 }, { a: 1 }); // true
compareDeep({ a: 1 }, { a: 2 }); // false
compareDeep([1, 2], [2, 1]); // false
compareDeep(NaN, NaN); // true
```

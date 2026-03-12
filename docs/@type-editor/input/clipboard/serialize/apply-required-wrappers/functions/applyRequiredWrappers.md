[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [clipboard/serialize/apply-required-wrappers](../README.md) / applyRequiredWrappers

# Function: applyRequiredWrappers()

```ts
function applyRequiredWrappers(wrap, doc): number;
```

Defined in: [clipboard/serialize/apply-required-wrappers.ts:14](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/input/src/clipboard/serialize/apply-required-wrappers.ts#L14)

Apply required wrapper elements to ensure certain HTML tags can be properly
inserted via innerHTML (e.g., wrapping \<td\> with \<table\>\<tbody\>\<tr\>).

## Parameters

| Parameter | Type             | Description                                 |
| --------- | ---------------- | ------------------------------------------- |
| `wrap`    | `HTMLDivElement` | The wrapper div element to potentially wrap |
| `doc`     | `Document`       | The document to create new elements         |

## Returns

`number`

The number of wrapper layers applied

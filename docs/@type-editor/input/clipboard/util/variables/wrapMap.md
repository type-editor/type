[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/input](../../../README.md) / [clipboard/util](../README.md) / wrapMap

# Variable: wrapMap

```ts
const wrapMap: Record<string, string[]>;
```

Defined in: [clipboard/util.ts:12](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/input/src/clipboard/util.ts#L12)

Trick from jQuery -- some elements must be wrapped in other
elements for innerHTML to work. I.e. if you do `div.innerHTML =
"<td>..</td>"` the table cells are ignored.

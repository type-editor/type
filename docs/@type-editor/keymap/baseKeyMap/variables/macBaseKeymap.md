[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/keymap](../../README.md) / [baseKeyMap](../README.md) / macBaseKeymap

# Variable: macBaseKeymap

```ts
const macBaseKeymap: Record<string, Command>;
```

Defined in: [baseKeyMap.ts:122](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/keymap/src/baseKeyMap.ts#L122)

A copy of `pcBaseKeymap` that also binds **Ctrl-h** like Backspace,
**Ctrl-d** like Delete, **Alt-Backspace** like Ctrl-Backspace, and
**Ctrl-Alt-Backspace**, **Alt-Delete**, and **Alt-d** like
Ctrl-Delete.

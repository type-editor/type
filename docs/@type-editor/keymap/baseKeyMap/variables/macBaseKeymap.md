[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/keymap](../../README.md) / [baseKeyMap](../README.md) / macBaseKeymap

# Variable: macBaseKeymap

```ts
const macBaseKeymap: Record<string, Command>;
```

Defined in: [baseKeyMap.ts:122](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/keymap/src/baseKeyMap.ts#L122)

A copy of `pcBaseKeymap` that also binds **Ctrl-h** like Backspace,
**Ctrl-d** like Delete, **Alt-Backspace** like Ctrl-Backspace, and
**Ctrl-Alt-Backspace**, **Alt-Delete**, and **Alt-d** like
Ctrl-Delete.

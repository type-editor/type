[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/keymap](../../README.md) / [baseKeyMap](../README.md) / macBaseKeymap

# Variable: macBaseKeymap

```ts
const macBaseKeymap: Record<string, Command>;
```

Defined in: [baseKeyMap.ts:122](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/keymap/src/baseKeyMap.ts#L122)

A copy of `pcBaseKeymap` that also binds **Ctrl-h** like Backspace,
**Ctrl-d** like Delete, **Alt-Backspace** like Ctrl-Backspace, and
**Ctrl-Alt-Backspace**, **Alt-Delete**, and **Alt-d** like
Ctrl-Delete.

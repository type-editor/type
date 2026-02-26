[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [dom-parser/context/ContextFlags](../README.md) / ContextFlags

# Enumeration: ContextFlags

Defined in: [packages/model/src/dom-parser/context/ContextFlags.ts:7](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/dom-parser/context/ContextFlags.ts#L7)

Bitfield flags for node context options.
These flags control whitespace handling and parsing behavior for each node context.
Multiple flags can be combined using bitwise OR operations.

## Enumeration Members

| Enumeration Member                                                          | Value | Description                                                                          | Defined in                                                                                                                                                                                              |
| --------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="enumeration-member-opt_open_left"></a> `OPT_OPEN_LEFT`               | `4`   | Flag indicating that the left side of the content is open (no automatic filling)     | [packages/model/src/dom-parser/context/ContextFlags.ts:16](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/dom-parser/context/ContextFlags.ts#L16) |
| <a id="enumeration-member-opt_preserve_ws"></a> `OPT_PRESERVE_WS`           | `1`   | Flag indicating that whitespace should be preserved (but newlines may be normalized) | [packages/model/src/dom-parser/context/ContextFlags.ts:10](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/dom-parser/context/ContextFlags.ts#L10) |
| <a id="enumeration-member-opt_preserve_ws_full"></a> `OPT_PRESERVE_WS_FULL` | `2`   | Flag indicating that all whitespace should be preserved entirely, including newlines | [packages/model/src/dom-parser/context/ContextFlags.ts:13](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/model/src/dom-parser/context/ContextFlags.ts#L13) |

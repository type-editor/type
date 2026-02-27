[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/inputrules](../../../README.md) / [types/PluginState](../README.md) / PluginState

# Type Alias: PluginState

```ts
type PluginState = {
  from: number;
  text: string;
  to: number;
  transform: Transaction;
} | null;
```

Defined in: [types/PluginState.ts:8](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/inputrules/src/types/PluginState.ts#L8)

Internal state stored in the input rules plugin to track the last applied rule
for undo functionality.

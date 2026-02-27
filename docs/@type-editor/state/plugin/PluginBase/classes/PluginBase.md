[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/state](../../../README.md) / [plugin/PluginBase](../README.md) / PluginBase

# Abstract Class: PluginBase

Defined in: [state/src/plugin/PluginBase.ts:2](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/plugin/PluginBase.ts#L2)

## Extended by

- [`Plugin`](../../Plugin/classes/Plugin.md)
- [`PluginKey`](../../PluginKey/classes/PluginKey.md)

## Constructors

### Constructor

```ts
new PluginBase(): PluginBase;
```

#### Returns

`PluginBase`

## Methods

### createKey()

```ts
protected createKey(name): string;
```

Defined in: [state/src/plugin/PluginBase.ts:10](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/plugin/PluginBase.ts#L10)

Creates a unique key by appending a counter to the given name.
Each call with the same name increments the counter.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `name`    | `string` |

#### Returns

`string`

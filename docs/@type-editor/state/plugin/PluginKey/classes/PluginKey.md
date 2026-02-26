[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/state](../../../README.md) / [plugin/PluginKey](../README.md) / PluginKey

# Class: PluginKey&lt;PluginState&gt;

Defined in: [state/src/plugin/PluginKey.ts:13](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/state/src/plugin/PluginKey.ts#L13)

A key is used to [tag](#state.PluginSpec.key) plugins in a way
that makes it possible to find them, given an editor state.
Assigning a key does mean only one plugin of that type can be
active in a state.

## Extends

- [`PluginBase`](../../PluginBase/classes/PluginBase.md)

## Type Parameters

| Type Parameter | Default type |
| -------------- | ------------ |
| `PluginState`  | `any`        |

## Implements

- `PmPluginKey`&lt;`PluginState`&gt;

## Constructors

### Constructor

```ts
new PluginKey<PluginState>(name?): PluginKey<PluginState>;
```

Defined in: [state/src/plugin/PluginKey.ts:20](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/state/src/plugin/PluginKey.ts#L20)

Create a plugin key.

#### Parameters

| Parameter | Type     | Default value |
| --------- | -------- | ------------- |
| `name`    | `string` | `'key'`       |

#### Returns

`PluginKey`&lt;`PluginState`&gt;

#### Overrides

[`PluginBase`](../../PluginBase/classes/PluginBase.md).[`constructor`](../../PluginBase/classes/PluginBase.md#constructor)

## Accessors

### key

#### Get Signature

```ts
get key(): string;
```

Defined in: [state/src/plugin/PluginKey.ts:25](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/state/src/plugin/PluginKey.ts#L25)

##### Returns

`string`

#### Implementation of

```ts
PmPluginKey.key;
```

## Methods

### createKey()

```ts
protected createKey(name): string;
```

Defined in: [state/src/plugin/PluginBase.ts:10](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/state/src/plugin/PluginBase.ts#L10)

Creates a unique key by appending a counter to the given name.
Each call with the same name increments the counter.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `name`    | `string` |

#### Returns

`string`

#### Inherited from

[`PluginBase`](../../PluginBase/classes/PluginBase.md).[`createKey`](../../PluginBase/classes/PluginBase.md#createkey)

---

### get()

```ts
get(state): PmPlugin<PluginState>;
```

Defined in: [state/src/plugin/PluginKey.ts:33](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/state/src/plugin/PluginKey.ts#L33)

Get the active plugin with this key, if any, from an editor
state.

#### Parameters

| Parameter | Type            |
| --------- | --------------- |
| `state`   | `PmEditorState` |

#### Returns

`PmPlugin`&lt;`PluginState`&gt;

#### Implementation of

```ts
PmPluginKey.get;
```

---

### getState()

```ts
getState(state): PluginState;
```

Defined in: [state/src/plugin/PluginKey.ts:53](https://github.com/type-editor/type/blob/e4864dcc638305a01de9e1948959c6e89a004528/packages/state/src/plugin/PluginKey.ts#L53)

Get the plugin's state from an editor state.

#### Parameters

| Parameter | Type            |
| --------- | --------------- |
| `state`   | `PmEditorState` |

#### Returns

`PluginState`

#### Implementation of

```ts
PmPluginKey.getState;
```

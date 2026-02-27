[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/state](../../../README.md) / [plugin/Plugin](../README.md) / Plugin

# Class: Plugin&lt;PluginState&gt;

Defined in: [state/src/plugin/Plugin.ts:14](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/state/src/plugin/Plugin.ts#L14)

Plugins bundle functionality that can be added to an editor.
They are part of the [editor state](#state.EditorState) and
may influence that state and the view that contains it.

## Extends

- [`PluginBase`](../../PluginBase/classes/PluginBase.md)

## Type Parameters

| Type Parameter | Default type |
| -------------- | ------------ |
| `PluginState`  | `any`        |

## Implements

- `PmPlugin`&lt;`PluginState`&gt;

## Constructors

### Constructor

```ts
new Plugin<PluginState>(spec): Plugin<PluginState>;
```

Defined in: [state/src/plugin/Plugin.ts:24](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/state/src/plugin/Plugin.ts#L24)

Create a plugin.

#### Parameters

| Parameter | Type                              | Description                                    |
| --------- | --------------------------------- | ---------------------------------------------- |
| `spec`    | `PluginSpec`&lt;`PluginState`&gt; | The plugin's [spec object](#state.PluginSpec). |

#### Returns

`Plugin`&lt;`PluginState`&gt;

#### Overrides

[`PluginBase`](../../PluginBase/classes/PluginBase.md).[`constructor`](../../PluginBase/classes/PluginBase.md#constructor)

## Accessors

### key

#### Get Signature

```ts
get key(): string;
```

Defined in: [state/src/plugin/Plugin.ts:40](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/state/src/plugin/Plugin.ts#L40)

##### Returns

`string`

#### Implementation of

```ts
PmPlugin.key;
```

---

### props

#### Get Signature

```ts
get props(): EditorProps<Plugin<PluginState>>;
```

Defined in: [state/src/plugin/Plugin.ts:36](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/state/src/plugin/Plugin.ts#L36)

The [props](#view.EditorProps) exported by this plugin.

##### Returns

`EditorProps`&lt;`Plugin`&lt;`PluginState`&gt;&gt;

#### Implementation of

```ts
PmPlugin.props;
```

---

### spec

#### Get Signature

```ts
get spec(): PluginSpec<PluginState>;
```

Defined in: [state/src/plugin/Plugin.ts:44](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/state/src/plugin/Plugin.ts#L44)

##### Returns

`PluginSpec`&lt;`PluginState`&gt;

#### Implementation of

```ts
PmPlugin.spec;
```

## Methods

### createKey()

```ts
protected createKey(name): string;
```

Defined in: [state/src/plugin/PluginBase.ts:10](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/state/src/plugin/PluginBase.ts#L10)

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

### getState()

```ts
getState(state): PluginState;
```

Defined in: [state/src/plugin/Plugin.ts:51](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/state/src/plugin/Plugin.ts#L51)

Extract the plugin's state field from an editor state.

#### Parameters

| Parameter | Type                                                                      |
| --------- | ------------------------------------------------------------------------- |
| `state`   | [`EditorState`](../../../editor-state/EditorState/classes/EditorState.md) |

#### Returns

`PluginState`

#### Implementation of

```ts
PmPlugin.getState;
```

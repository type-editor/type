[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/state](../../../README.md) / [editor-state/EditorState](../README.md) / EditorState

# Class: EditorState

Defined in: [state/src/editor-state/EditorState.ts:65](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L65)

The state of a ProseMirror editor is represented by an object of
this type. A state is a persistent data structure—it isn't
updated, but rather a new state value is computed from an old one
using the [`apply`](#state.EditorState.apply) method.

A state holds a number of built-in fields, and plugins can
[define](#state.PluginSpec.state) additional fields.

## Implements

- `PmEditorState`

## Constructors

### Constructor

```ts
new EditorState(
   config,
   editorStateDto,
   isUpdate?): EditorState;
```

Defined in: [state/src/editor-state/EditorState.ts:93](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L93)

Constructor for EditorState. Should not be called directly - use EditorState.create() or EditorState.fromJSON() instead.

#### Parameters

| Parameter        | Type                                                                    | Default value | Description                                                                                                  |
| ---------------- | ----------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------ |
| `config`         | [`EditorStateConfiguration`](../interfaces/EditorStateConfiguration.md) | `undefined`   | The editor state configuration containing schema, plugins, and field descriptors                             |
| `editorStateDto` | `EditorStateDto`                                                        | `undefined`   | The initial state data including document, selection, stored marks, and field data                           |
| `isUpdate`       | `boolean`                                                               | `false`       | If true, treats this as an update operation (applying a transaction); if false, treats as new state creation |

#### Returns

`EditorState`

#### Throws

If editorStateDto is null/undefined or if isUpdate is true but transaction is missing

## Accessors

### doc

#### Get Signature

```ts
get doc(): Node_2;
```

Defined in: [state/src/editor-state/EditorState.ts:141](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L141)

The current document.

##### Returns

`Node_2`

#### Implementation of

```ts
PmEditorState.doc;
```

---

### plugins

#### Get Signature

```ts
get plugins(): readonly Plugin<any>[];
```

Defined in: [state/src/editor-state/EditorState.ts:178](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L178)

The plugins that are active in this state.

##### Returns

readonly [`Plugin`](../../../plugin/Plugin/classes/Plugin.md)&lt;`any`&gt;[]

#### Implementation of

```ts
PmEditorState.plugins;
```

---

### schema

#### Get Signature

```ts
get schema(): Schema;
```

Defined in: [state/src/editor-state/EditorState.ts:171](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L171)

The schema of the state's document.

##### Returns

`Schema`

#### Implementation of

```ts
PmEditorState.schema;
```

---

### scrollToSelection

#### Get Signature

```ts
get scrollToSelection(): number;
```

Defined in: [state/src/editor-state/EditorState.ts:156](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L156)

Counter that is incremented whenever a transaction with scrolledIntoView set is applied.
Used by the view to detect when it should scroll the selection into view.

##### Returns

`number`

#### Implementation of

```ts
PmEditorState.scrollToSelection;
```

---

### selection

#### Get Signature

```ts
get selection(): PmSelection;
```

Defined in: [state/src/editor-state/EditorState.ts:148](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L148)

The current selection.

##### Returns

`PmSelection`

#### Implementation of

```ts
PmEditorState.selection;
```

---

### storedMarks

#### Get Signature

```ts
get storedMarks(): readonly Mark[];
```

Defined in: [state/src/editor-state/EditorState.ts:164](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L164)

A set of marks to apply to the next input. Will be null when
no explicit marks have been set.

##### Returns

readonly `Mark`[]

#### Implementation of

```ts
PmEditorState.storedMarks;
```

---

### tr

#### Get Signature

```ts
get tr(): Transaction;
```

Defined in: [state/src/editor-state/EditorState.ts:192](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L192)

##### Deprecated

use transaction

##### Returns

[`Transaction`](../../../Transaction/classes/Transaction.md)

#### Implementation of

```ts
PmEditorState.tr;
```

---

### transaction

#### Get Signature

```ts
get transaction(): Transaction;
```

Defined in: [state/src/editor-state/EditorState.ts:185](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L185)

Accessor that constructs and returns a new [transaction](#state.Transaction) from this state.

##### Returns

[`Transaction`](../../../Transaction/classes/Transaction.md)

#### Implementation of

```ts
PmEditorState.transaction;
```

---

### type

#### Get Signature

```ts
get type(): string;
```

Defined in: [state/src/editor-state/EditorState.ts:134](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L134)

##### Returns

`string`

## Methods

### apply()

```ts
apply(transaction): EditorState;
```

Defined in: [state/src/editor-state/EditorState.ts:406](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L406)

Apply the given transaction to produce a new state.
This is a convenience method that calls applyTransaction and returns only the state.

#### Parameters

| Parameter     | Type                                                         | Description              |
| ------------- | ------------------------------------------------------------ | ------------------------ |
| `transaction` | [`Transaction`](../../../Transaction/classes/Transaction.md) | The transaction to apply |

#### Returns

`EditorState`

A new editor state with the transaction applied

#### Implementation of

```ts
PmEditorState.apply;
```

---

### applyTransaction()

```ts
applyTransaction(rootTransaction): {
  state: EditorState;
  transactions: readonly Transaction[];
};
```

Defined in: [state/src/editor-state/EditorState.ts:422](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L422)

Verbose variant of [`apply`](#state.EditorState.apply) that
returns the precise transactions that were applied (which might
be influenced by the transaction hooks (filterTransaction, appendTransaction)
of plugins) along with the new state.

The returned transactions array may contain additional transactions beyond the
root transaction if plugins' appendTransaction hooks added new transactions.

#### Parameters

| Parameter         | Type                                                         | Description                      |
| ----------------- | ------------------------------------------------------------ | -------------------------------- |
| `rootTransaction` | [`Transaction`](../../../Transaction/classes/Transaction.md) | The initial transaction to apply |

#### Returns

```ts
{
  state: EditorState;
  transactions: readonly Transaction[];
}
```

An object containing the new state and array of all applied transactions

| Name           | Type                                                                    | Defined in                                                                                                                                                                         |
| -------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `state`        | `EditorState`                                                           | [state/src/editor-state/EditorState.ts:423](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L423) |
| `transactions` | readonly [`Transaction`](../../../Transaction/classes/Transaction.md)[] | [state/src/editor-state/EditorState.ts:424](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L424) |

#### Implementation of

```ts
PmEditorState.applyTransaction;
```

---

### getFieldPluginValue()

```ts
getFieldPluginValue(key): unknown;
```

Defined in: [state/src/editor-state/EditorState.ts:395](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L395)

Get the value of a plugin field.

#### Parameters

| Parameter | Type     | Description                             |
| --------- | -------- | --------------------------------------- |
| `key`     | `string` | The key of the plugin field to retrieve |

#### Returns

`unknown`

The value of the field, or undefined if not found

#### Implementation of

```ts
PmEditorState.getFieldPluginValue;
```

---

### getPlugin()

```ts
getPlugin(key): Plugin<any>;
```

Defined in: [state/src/editor-state/EditorState.ts:385](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L385)

Get a plugin by its key.

#### Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `key`     | `string` | The unique key identifying the plugin |

#### Returns

[`Plugin`](../../../plugin/Plugin/classes/Plugin.md)&lt;`any`&gt;

The plugin instance, or undefined if not found

#### Implementation of

```ts
PmEditorState.getPlugin;
```

---

### reconfigure()

```ts
reconfigure(config): EditorState;
```

Defined in: [state/src/editor-state/EditorState.ts:468](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L468)

Create a new state based on this one, but with an adjusted set
of active plugins. State fields that exist in both sets of
plugins are kept unchanged. Those that no longer exist are
dropped, and those that are new are initialized using their
init method, passing in the new configuration object.

The document, selection, and stored marks are preserved in the new state.

#### Parameters

| Parameter         | Type                                                                                            | Description                                            |
| ----------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `config`          | \{ `plugins?`: readonly [`Plugin`](../../../plugin/Plugin/classes/Plugin.md)&lt;`any`&gt;[]; \} | Configuration object containing the new set of plugins |
| `config.plugins?` | readonly [`Plugin`](../../../plugin/Plugin/classes/Plugin.md)&lt;`any`&gt;[]                    | Optional array of plugins for the new state            |

#### Returns

`EditorState`

A new editor state with the reconfigured plugins

#### Implementation of

```ts
PmEditorState.reconfigure;
```

---

### toJSON()

```ts
toJSON(pluginFields?, onlyDocument?): StateJSON;
```

Defined in: [state/src/editor-state/EditorState.ts:493](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L493)

Serialize this state to JSON. If you want to serialize the state
of plugins, pass an object mapping property names to use in the
resulting JSON object to plugin objects.

Plugin field values are serialized using JSON.stringify unless they're numbers.
Built-in fields (doc, selection, storedMarks) are always serialized.

#### Parameters

| Parameter       | Type                                                   | Default value | Description                                                                              |
| --------------- | ------------------------------------------------------ | ------------- | ---------------------------------------------------------------------------------------- |
| `pluginFields?` | `Readonly`&lt;`Record`&lt;`string`, `PmPlugin`&gt;&gt; | `undefined`   | Optional mapping of JSON property names to plugin instances for serializing plugin state |
| `onlyDocument?` | `boolean`                                              | `false`       | -                                                                                        |

#### Returns

`StateJSON`

A JSON representation of the state

#### Example

```typescript
const json = state.toJSON({ history: historyPlugin() });
```

#### Implementation of

```ts
PmEditorState.toJSON;
```

---

### create()

```ts
static create(config): EditorState;
```

Defined in: [state/src/editor-state/EditorState.ts:273](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L273)

Create a new editor state from a configuration object.
This is the recommended way to create a new state.

#### Parameters

| Parameter | Type                | Description                                                                            |
| --------- | ------------------- | -------------------------------------------------------------------------------------- |
| `config`  | `EditorStateConfig` | Configuration object containing the schema, initial document, selection, plugins, etc. |

#### Returns

`EditorState`

A new EditorState instance

#### Example

```typescript
const state = EditorState.create({
  schema: mySchema,
  doc: mySchema.node("doc", null, [mySchema.node("paragraph")]),
  plugins: [historyPlugin(), keymap()],
});
```

---

### createConfig()

```ts
static createConfig(schema, plugins?): EditorStateConfiguration;
```

Defined in: [state/src/editor-state/EditorState.ts:296](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L296)

Creates an EditorStateConfiguration object from a schema and plugins array.
This method combines built-in field descriptors with plugin-provided field descriptors.

#### Parameters

| Parameter  | Type                               | Description                                               |
| ---------- | ---------------------------------- | --------------------------------------------------------- |
| `schema`   | `Schema`                           | The schema to use for this configuration                  |
| `plugins?` | readonly `PmPlugin`&lt;`any`&gt;[] | Optional array of plugins to include in the configuration |

#### Returns

[`EditorStateConfiguration`](../interfaces/EditorStateConfiguration.md)

A new EditorStateConfiguration object

#### Throws

If multiple instances of the same keyed plugin are provided

---

### fromJSON()

```ts
static fromJSON(
   config,
   json,
   pluginFields?): EditorState;
```

Defined in: [state/src/editor-state/EditorState.ts:220](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L220)

Deserialize a JSON representation of a state. The `config` parameter should
have at least a `schema` field, and should contain an array of
plugins to initialize the state with. `pluginFields` can be used
to deserialize the state of plugins, by associating plugin instances
with property names in the JSON object.

#### Parameters

| Parameter         | Type                                                                                             | Description                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `config`          | \{ `plugins?`: readonly `PmPlugin`&lt;`any`&gt;[]; `schema`: `Schema`; \}                        | Configuration object with at least a schema field and optionally plugins              |
| `config.plugins?` | readonly `PmPlugin`&lt;`any`&gt;[]                                                               | Optional array of plugins to initialize the state with                                |
| `config.schema`   | `Schema`                                                                                         | The schema to use for deserializing the document                                      |
| `json?`           | `StateJSON`                                                                                      | The JSON representation of the state to deserialize                                   |
| `pluginFields?`   | `Readonly`&lt;`Record`&lt;`string`, [`Plugin`](../../../plugin/Plugin/classes/Plugin.md)&gt;&gt; | Optional mapping of property names to plugin instances for deserializing plugin state |

#### Returns

`EditorState`

A new EditorState instance deserialized from the JSON

#### Throws

If json is invalid or schema is missing

#### Example

```typescript
const state = EditorState.fromJSON(
  { schema: mySchema, plugins: [historyPlugin()] },
  { doc: {...}, selection: {...} },
  { history: historyPlugin() }
);
```

---

### isEditorState()

```ts
static isEditorState(value): value is EditorState;
```

Defined in: [state/src/editor-state/EditorState.ts:320](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/state/src/editor-state/EditorState.ts#L320)

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `value`   | `unknown` |

#### Returns

`value is EditorState`

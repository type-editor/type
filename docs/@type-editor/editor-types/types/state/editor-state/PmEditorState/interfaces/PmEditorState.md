[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/editor-types](../../../../../README.md) / [types/state/editor-state/PmEditorState](../README.md) / PmEditorState

# Interface: PmEditorState

Defined in: [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:9](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L9)

## Properties

| Property                                                    | Modifier   | Type                                                                                  | Defined in                                                                                                                                                                                                                          |
| ----------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-doc"></a> `doc`                             | `readonly` | `Node_2`                                                                              | [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:11](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L11) |
| <a id="property-plugins"></a> `plugins`                     | `readonly` | readonly [`PmPlugin`](../../../plugin/PmPlugin/interfaces/PmPlugin.md)&lt;`any`&gt;[] | [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:16](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L16) |
| <a id="property-schema"></a> `schema`                       | `readonly` | `Schema`                                                                              | [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:15](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L15) |
| <a id="property-scrolltoselection"></a> `scrollToSelection` | `readonly` | `number`                                                                              | [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:13](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L13) |
| <a id="property-selection"></a> `selection`                 | `readonly` | [`PmSelection`](../../../selection/PmSelection/interfaces/PmSelection.md)             | [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:12](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L12) |
| <a id="property-storedmarks"></a> `storedMarks`             | `readonly` | readonly `Mark`[]                                                                     | [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:14](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L14) |
| <a id="property-tr"></a> `tr`                               | `readonly` | [`PmTransaction`](../../../PmTransaction/interfaces/PmTransaction.md)                 | [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:18](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L18) |
| <a id="property-transaction"></a> `transaction`             | `readonly` | [`PmTransaction`](../../../PmTransaction/interfaces/PmTransaction.md)                 | [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:17](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L17) |

## Methods

### apply()

```ts
apply(transaction): PmEditorState;
```

Defined in: [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:43](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L43)

Apply the given transaction to produce a new state.
This is a convenience method that calls applyTransaction and returns only the state.

#### Parameters

| Parameter     | Type                                                                  | Description              |
| ------------- | --------------------------------------------------------------------- | ------------------------ |
| `transaction` | [`PmTransaction`](../../../PmTransaction/interfaces/PmTransaction.md) | The transaction to apply |

#### Returns

`PmEditorState`

A new editor state with the transaction applied

---

### applyTransaction()

```ts
applyTransaction(rootTransaction): {
  state: PmEditorState;
  transactions: readonly PmTransaction[];
};
```

Defined in: [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:57](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L57)

Verbose variant of [`apply`](#state.EditorState.apply) that
returns the precise transactions that were applied (which might
be influenced by the transaction hooks (filterTransaction, appendTransaction)
of plugins) along with the new state.

The returned transactions array may contain additional transactions beyond the
root transaction if plugins' appendTransaction hooks added new transactions.

#### Parameters

| Parameter         | Type                                                                  | Description                      |
| ----------------- | --------------------------------------------------------------------- | -------------------------------- |
| `rootTransaction` | [`PmTransaction`](../../../PmTransaction/interfaces/PmTransaction.md) | The initial transaction to apply |

#### Returns

```ts
{
  state: PmEditorState;
  transactions: readonly PmTransaction[];
}
```

An object containing the new state and array of all applied transactions

| Name           | Type                                                                             | Defined in                                                                                                                                                                                                                          |
| -------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `state`        | `PmEditorState`                                                                  | [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:58](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L58) |
| `transactions` | readonly [`PmTransaction`](../../../PmTransaction/interfaces/PmTransaction.md)[] | [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:59](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L59) |

---

### getFieldPluginValue()

```ts
getFieldPluginValue(key): unknown;
```

Defined in: [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:34](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L34)

Get the value of a plugin field.

#### Parameters

| Parameter | Type     | Description                             |
| --------- | -------- | --------------------------------------- |
| `key`     | `string` | The key of the plugin field to retrieve |

#### Returns

`unknown`

The value of the field, or undefined if not found

---

### getPlugin()

```ts
getPlugin(key): PmPlugin<any>;
```

Defined in: [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:26](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L26)

Get a plugin by its key.

#### Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `key`     | `string` | The unique key identifying the plugin |

#### Returns

[`PmPlugin`](../../../plugin/PmPlugin/interfaces/PmPlugin.md)&lt;`any`&gt;

The plugin instance, or undefined if not found

---

### reconfigure()

```ts
reconfigure(config): PmEditorState;
```

Defined in: [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:75](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L75)

Create a new state based on this one, but with an adjusted set
of active plugins. State fields that exist in both sets of
plugins are kept unchanged. Those that no longer exist are
dropped, and those that are new are initialized using their
init method, passing in the new configuration object.

The document, selection, and stored marks are preserved in the new state.

#### Parameters

| Parameter         | Type                                                                                                     | Description                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `config`          | \{ `plugins?`: readonly [`PmPlugin`](../../../plugin/PmPlugin/interfaces/PmPlugin.md)&lt;`any`&gt;[]; \} | Configuration object containing the new set of plugins |
| `config.plugins?` | readonly [`PmPlugin`](../../../plugin/PmPlugin/interfaces/PmPlugin.md)&lt;`any`&gt;[]                    | Optional array of plugins for the new state            |

#### Returns

`PmEditorState`

A new editor state with the reconfigured plugins

---

### toJSON()

```ts
toJSON(pluginFields?): StateJSON;
```

Defined in: [packages/editor-types/src/types/state/editor-state/PmEditorState.ts:93](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/editor-types/src/types/state/editor-state/PmEditorState.ts#L93)

Serialize this state to JSON. If you want to serialize the state
of plugins, pass an object mapping property names to use in the
resulting JSON object to plugin objects.

Plugin field values are serialized using JSON.stringify unless they're numbers.
Built-in fields (doc, selection, storedMarks) are always serialized.

#### Parameters

| Parameter       | Type                                                                                                      | Description                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `pluginFields?` | `Readonly`&lt;`Record`&lt;`string`, [`PmPlugin`](../../../plugin/PmPlugin/interfaces/PmPlugin.md)&gt;&gt; | Optional mapping of JSON property names to plugin instances for serializing plugin state |

#### Returns

[`StateJSON`](../../StateJSON/interfaces/StateJSON.md)

A JSON representation of the state

#### Example

```typescript
const json = state.toJSON({ history: historyPlugin() });
```

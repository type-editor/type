[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/state](../../../README.md) / [editor-state/FieldDesc](../README.md) / FieldDesc

# Class: FieldDesc&lt;T&gt;

Defined in: [state/src/editor-state/FieldDesc.ts:25](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/editor-state/FieldDesc.ts#L25)

**`Internal`**

Descriptor for a state field that can be initialized and updated.
Wraps the init and apply functions from a StateField specification,
binding them to an optional context object (typically a plugin instance).

This class serves as an adapter that manages the lifecycle of state fields,
ensuring proper initialization and updates when transactions are applied.
It handles function binding when a context object is provided, allowing
StateField methods to maintain their expected `this` context.

## Type Parameters

| Type Parameter | Description                                      |
| -------------- | ------------------------------------------------ |
| `T`            | The type of the value stored in this state field |

## Constructors

### Constructor

```ts
new FieldDesc<T>(
   name,
   stateField,
   self?): FieldDesc<T>;
```

Defined in: [state/src/editor-state/FieldDesc.ts:59](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/editor-state/FieldDesc.ts#L59)

Creates a new field descriptor. This class acts as a wrapper around a given StateField
to allow calling the init and apply functions with a given context.

The constructor validates that the provided StateField contains the required `init` and
`apply` functions. If a context object is provided via the `self` parameter, the functions
will be bound to that context, ensuring they can access their expected `this` binding.

#### Parameters

| Parameter    | Type                    | Description                                                                                                                                                 |
| ------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`       | `string`                | The name of the field (used as a key in the state object). This should be unique across all fields in an editor state.                                      |
| `stateField` | `StateField`&lt;`T`&gt; | The StateField specification containing init and apply functions. Both functions are required and will be validated at construction time.                   |
| `self?`      | `unknown`               | Optional context object to bind the functions to (typically a plugin instance). When provided, both init and apply functions will be bound to this context. |

#### Returns

`FieldDesc`&lt;`T`&gt;

#### Throws

If the stateField is null/undefined or missing required init/apply functions

## Accessors

### name

#### Get Signature

```ts
get name(): string;
```

Defined in: [state/src/editor-state/FieldDesc.ts:76](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/editor-state/FieldDesc.ts#L76)

Gets the unique name/identifier of this field.

##### Returns

`string`

The field name used as a key in the editor state object

## Methods

### apply()

```ts
apply(
   transaction,
   value,
   oldState,
   newState): T;
```

Defined in: [state/src/editor-state/FieldDesc.ts:114](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/editor-state/FieldDesc.ts#L114)

Computes the new field value when a transaction is applied to the editor state.

This method is called during transaction application to update the field's value
based on the changes in the transaction. The field can examine the transaction,
its current value, and both the old and new states to determine the updated value.

#### Parameters

| Parameter     | Type                                                         | Description                                                                                                                          |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `transaction` | [`Transaction`](../../../Transaction/classes/Transaction.md) | The transaction being applied, containing steps, metadata, and other changes to be processed                                         |
| `value`       | `T`                                                          | The current value of this field in the old state                                                                                     |
| `oldState`    | [`EditorState`](../../EditorState/classes/EditorState.md)    | The editor state before the transaction is applied                                                                                   |
| `newState`    | [`EditorState`](../../EditorState/classes/EditorState.md)    | A partially-constructed new editor state. Fields that come after this one in the field list will not yet have their values computed. |

#### Returns

`T`

The new value for this state field after applying the transaction

---

### init()

```ts
init(config, instance): T;
```

Defined in: [state/src/editor-state/FieldDesc.ts:94](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/state/src/editor-state/FieldDesc.ts#L94)

Initializes the field value when creating a new editor state.

This method is called during editor state construction to compute the initial
value for this field. The provided configuration and partially-constructed state
instance are passed to the underlying init function.

#### Parameters

| Parameter  | Type                                                      | Description                                                                                                                    |
| ---------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `config`   | `EditorStateConfig`                                       | The configuration object passed to EditorState.create, containing settings like schema, doc, selection, plugins, etc.          |
| `instance` | [`EditorState`](../../EditorState/classes/EditorState.md) | A partially-initialized editor state instance. Note that fields initialized after this one will not yet have their values set. |

#### Returns

`T`

The initial value for this state field

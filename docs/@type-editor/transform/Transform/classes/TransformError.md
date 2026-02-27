[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/transform](../../README.md) / [Transform](../README.md) / TransformError

# Class: TransformError

Defined in: [packages/transform/src/Transform.ts:39](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L39)

Error thrown when a transformation step fails.

## Extends

- `Error`

## Constructors

### Constructor

```ts
new TransformError(message): TransformError;
```

Defined in: [packages/transform/src/Transform.ts:45](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/transform/src/Transform.ts#L45)

Creates a new TransformError.

#### Parameters

| Parameter | Type     | Description                                                 |
| --------- | -------- | ----------------------------------------------------------- |
| `message` | `string` | The error message describing why the transformation failed. |

#### Returns

`TransformError`

#### Overrides

```ts
Error.constructor;
```

## Properties

| Property                                                | Modifier | Type      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                       | Inherited from          | Defined in                                                                               |
| ------------------------------------------------------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------- |
| <a id="property-cause"></a> `cause?`                    | `public` | `unknown` | -                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Error.cause`           | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2022.error.d.ts:26 |
| <a id="property-message"></a> `message`                 | `public` | `string`  | -                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Error.message`         | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1077        |
| <a id="property-name"></a> `name`                       | `public` | `string`  | -                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Error.name`            | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1076        |
| <a id="property-stack"></a> `stack?`                    | `public` | `string`  | -                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Error.stack`           | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1078        |
| <a id="property-stacktracelimit"></a> `stackTraceLimit` | `static` | `number`  | The `Error.stackTraceLimit` property specifies the number of stack frames collected by a stack trace (whether generated by `new Error().stack` or `Error.captureStackTrace(obj)`). The default value is `10` but may be set to any valid JavaScript number. Changes will affect any stack trace captured _after_ the value has been changed. If set to a non-number value, or set to a negative number, stack traces will not capture any frames. | `Error.stackTraceLimit` | node_modules/.pnpm/@types+node@25.3.1/node_modules/@types/node/globals.d.ts:67           |

## Methods

### captureStackTrace()

```ts
static captureStackTrace(targetObject, constructorOpt?): void;
```

Defined in: node_modules/.pnpm/@types+node@25.3.1/node_modules/@types/node/globals.d.ts:51

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack; // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

#### Parameters

| Parameter         | Type       |
| ----------------- | ---------- |
| `targetObject`    | `object`   |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

```ts
Error.captureStackTrace;
```

---

### isError()

```ts
static isError(error): error is Error;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.esnext.error.d.ts:23

Indicates whether the argument provided is a built-in Error instance or not.

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `error`   | `unknown` |

#### Returns

`error is Error`

#### Inherited from

```ts
Error.isError;
```

---

### prepareStackTrace()

```ts
static prepareStackTrace(err, stackTraces): any;
```

Defined in: node_modules/.pnpm/@types+node@25.3.1/node_modules/@types/node/globals.d.ts:55

#### Parameters

| Parameter     | Type         |
| ------------- | ------------ |
| `err`         | `Error`      |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

```ts
Error.prepareStackTrace;
```

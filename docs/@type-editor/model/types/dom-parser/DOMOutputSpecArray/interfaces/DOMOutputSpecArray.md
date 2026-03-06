[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/model](../../../../README.md) / [types/dom-parser/DOMOutputSpecArray](../README.md) / DOMOutputSpecArray

# Interface: DOMOutputSpecArray

Defined in: [packages/model/src/types/dom-parser/DOMOutputSpecArray.ts:3](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/types/dom-parser/DOMOutputSpecArray.ts#L3)

## Extends

- `ReadonlyArray`&lt;
  \| `string`
  \| `Node`
  \| \{
  `contentDOM?`: `HTMLElement`;
  `dom`: `Node`;
  \}
  \| `DOMOutputSpecArray`
  \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
  \| `0`&gt;

## Indexable

```ts
[n: number]:
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
}
```

## Properties

| Property                                          | Modifier   | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Description                                                                                                   | Inherited from                | Defined in                                                                                                                                                                                                    |
| ------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-unscopables"></a> `[unscopables]` | `readonly` | \{ \[`key`: `number`\]: `boolean`; `[iterator]?`: `boolean`; `[unscopables]?`: `boolean`; `at?`: `boolean`; `concat?`: `boolean`; `entries?`: `boolean`; `every?`: `boolean`; `filter?`: `boolean`; `find?`: `boolean`; `findIndex?`: `boolean`; `findLast?`: `boolean`; `findLastIndex?`: `boolean`; `flat?`: `boolean`; `flatMap?`: `boolean`; `forEach?`: `boolean`; `includes?`: `boolean`; `indexOf?`: `boolean`; `join?`: `boolean`; `keys?`: `boolean`; `lastIndexOf?`: `boolean`; `length?`: `boolean`; `map?`: `boolean`; `reduce?`: `boolean`; `reduceRight?`: `boolean`; `slice?`: `boolean`; `some?`: `boolean`; `toLocaleString?`: `boolean`; `toReversed?`: `boolean`; `toSorted?`: `boolean`; `toSpliced?`: `boolean`; `toString?`: `boolean`; `values?`: `boolean`; `with?`: `boolean`; \} | Is an object whose properties have the value 'true' when they will be absent when used in a 'with' statement. | `ReadonlyArray.[unscopables]` | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:107                                                                                                          |
| `[unscopables].[iterator]?`                       | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts:114                                                                                                                  |
| `[unscopables].[unscopables]?`                    | `readonly` | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Is an object whose properties have the value 'true' when they will be absent when used in a 'with' statement. | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:107                                                                                                          |
| `[unscopables].at?`                               | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2022.array.d.ts:32                                                                                                                      |
| `[unscopables].concat?`                           | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1208                                                                                                                             |
| `[unscopables].entries?`                          | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts:119                                                                                                                  |
| `[unscopables].every?`                            | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1245                                                                                                                             |
| `[unscopables].filter?`                           | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1281                                                                                                                             |
| `[unscopables].find?`                             | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2015.core.d.ts:352                                                                                                                      |
| `[unscopables].findIndex?`                        | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2015.core.d.ts:364                                                                                                                      |
| `[unscopables].findLast?`                         | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2023.array.d.ts:98                                                                                                                      |
| `[unscopables].findLastIndex?`                    | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2023.array.d.ts:116                                                                                                                     |
| `[unscopables].flat?`                             | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2019.array.d.ts:47                                                                                                                      |
| `[unscopables].flatMap?`                          | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2019.array.d.ts:36                                                                                                                      |
| `[unscopables].forEach?`                          | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1269                                                                                                                             |
| `[unscopables].includes?`                         | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2016.array.include.d.ts:34                                                                                                              |
| `[unscopables].indexOf?`                          | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1230                                                                                                                             |
| `[unscopables].join?`                             | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1218                                                                                                                             |
| `[unscopables].keys?`                             | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts:124                                                                                                                  |
| `[unscopables].lastIndexOf?`                      | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1236                                                                                                                             |
| `[unscopables].length?`                           | `readonly` | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Gets the length of the array. This is a number one higher than the highest element defined in an array.       | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1195                                                                                                                             |
| `[unscopables].map?`                              | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1275                                                                                                                             |
| `[unscopables].reduce?`                           | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1293                                                                                                                             |
| `[unscopables].reduceRight?`                      | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1306                                                                                                                             |
| `[unscopables].slice?`                            | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1224                                                                                                                             |
| `[unscopables].some?`                             | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1263                                                                                                                             |
| `[unscopables].toLocaleString?`                   | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1203                                                                                                                             |
| `[unscopables].toReversed?`                       | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2023.array.d.ts:124                                                                                                                     |
| `[unscopables].toSorted?`                         | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2023.array.d.ts:135                                                                                                                     |
| `[unscopables].toSpliced?`                        | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2023.array.d.ts:144                                                                                                                     |
| `[unscopables].toString?`                         | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1199                                                                                                                             |
| `[unscopables].values?`                           | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts:129                                                                                                                  |
| `[unscopables].with?`                             | `public`   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                             | -                             | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2023.array.d.ts:163                                                                                                                     |
| <a id="property-0"></a> `0`                       | `readonly` | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | -                                                                                                             | -                             | [packages/model/src/types/dom-parser/DOMOutputSpecArray.ts:7](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/model/src/types/dom-parser/DOMOutputSpecArray.ts#L7) |
| <a id="property-length"></a> `length`             | `readonly` | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Gets the length of the array. This is a number one higher than the highest element defined in an array.       | `ReadonlyArray.length`        | node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1195                                                                                                                             |

## Methods

### \[iterator\]()

```ts
iterator: ArrayIterator<
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
      contentDOM?: HTMLElement;
      dom: Node;
    }
>;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts:114

Iterator of values in the array.

#### Returns

`ArrayIterator`&lt;
\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\}&gt;

#### Inherited from

```ts
ReadonlyArray.[iterator]
```

---

### at()

```ts
at(index):
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
};
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2022.array.d.ts:32

Returns the item located at the specified index.

#### Parameters

| Parameter | Type     | Description                                                                                         |
| --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `index`   | `number` | The zero-based index of the desired code unit. A negative index will count back from the last item. |

#### Returns

\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\}

#### Inherited from

```ts
ReadonlyArray.at;
```

---

### concat()

#### Call Signature

```ts
concat(...items): (
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
})[];
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1208

Combines two or more arrays.

##### Parameters

| Parameter  | Type                                                                                                                                                                                                       | Description                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| ...`items` | `ConcatArray`&lt; \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \}&gt;[] | Additional items to add to the end of array1. |

##### Returns

(
\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\})[]

##### Inherited from

```ts
ReadonlyArray.concat;
```

#### Call Signature

```ts
concat(...items): (
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
})[];
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1213

Combines two or more arrays.

##### Parameters

| Parameter  | Type                                                                                                                                                                                                                                                                                                                                                                                                | Description                                   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| ...`items` | ( \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \} \| `ConcatArray`&lt; \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \}&gt;)[] | Additional items to add to the end of array1. |

##### Returns

(
\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\})[]

##### Inherited from

```ts
ReadonlyArray.concat;
```

---

### entries()

```ts
entries(): ArrayIterator<[number,
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
}]>;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts:119

Returns an iterable of key, value pairs for every entry in the array

#### Returns

`ArrayIterator`&lt;\[`number`,
\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\}\]&gt;

#### Inherited from

```ts
ReadonlyArray.entries;
```

---

### every()

#### Call Signature

```ts
every<S>(predicate, thisArg?): this is readonly S[];
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1245

Determines whether all the members of an array satisfy the specified test.

##### Type Parameters

| Type Parameter                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `S` _extends_ \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \} |

##### Parameters

| Parameter   | Type                                        | Description                                                                                                                                                                                                                                  |
| ----------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `predicate` | (`value`, `index`, `array`) => `value is S` | A function that accepts up to three arguments. The every method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value false, or until the end of the array. |
| `thisArg?`  | `any`                                       | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.                                                                                                         |

##### Returns

`this is readonly S[]`

##### Inherited from

```ts
ReadonlyArray.every;
```

#### Call Signature

```ts
every(predicate, thisArg?): boolean;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1254

Determines whether all the members of an array satisfy the specified test.

##### Parameters

| Parameter   | Type                                     | Description                                                                                                                                                                                                                                  |
| ----------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `predicate` | (`value`, `index`, `array`) => `unknown` | A function that accepts up to three arguments. The every method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value false, or until the end of the array. |
| `thisArg?`  | `any`                                    | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.                                                                                                         |

##### Returns

`boolean`

##### Inherited from

```ts
ReadonlyArray.every;
```

---

### filter()

#### Call Signature

```ts
filter<S>(predicate, thisArg?): S[];
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1281

Returns the elements of an array that meet the condition specified in a callback function.

##### Type Parameters

| Type Parameter                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `S` _extends_ \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \} |

##### Parameters

| Parameter   | Type                                        | Description                                                                                                                           |
| ----------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `predicate` | (`value`, `index`, `array`) => `value is S` | A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array. |
| `thisArg?`  | `any`                                       | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.  |

##### Returns

`S`[]

##### Inherited from

```ts
ReadonlyArray.filter;
```

#### Call Signature

```ts
filter(predicate, thisArg?): (
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
})[];
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1287

Returns the elements of an array that meet the condition specified in a callback function.

##### Parameters

| Parameter   | Type                                     | Description                                                                                                                           |
| ----------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `predicate` | (`value`, `index`, `array`) => `unknown` | A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array. |
| `thisArg?`  | `any`                                    | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.  |

##### Returns

(
\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\})[]

##### Inherited from

```ts
ReadonlyArray.filter;
```

---

### find()

#### Call Signature

```ts
find<S>(predicate, thisArg?): S;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2015.core.d.ts:352

Returns the value of the first element in the array where predicate is true, and undefined
otherwise.

##### Type Parameters

| Type Parameter                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `S` _extends_ \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \} |

##### Parameters

| Parameter   | Type                                      | Description                                                                                                                                                                                                                                |
| ----------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `predicate` | (`value`, `index`, `obj`) => `value is S` | find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined. |
| `thisArg?`  | `any`                                     | If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead.                                                                                                         |

##### Returns

`S`

##### Inherited from

```ts
ReadonlyArray.find;
```

#### Call Signature

```ts
find(predicate, thisArg?):
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
};
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2015.core.d.ts:353

##### Parameters

| Parameter   | Type                                   |
| ----------- | -------------------------------------- |
| `predicate` | (`value`, `index`, `obj`) => `unknown` |
| `thisArg?`  | `any`                                  |

##### Returns

\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\}

##### Inherited from

```ts
ReadonlyArray.find;
```

---

### findIndex()

```ts
findIndex(predicate, thisArg?): number;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2015.core.d.ts:364

Returns the index of the first element in the array where predicate is true, and -1
otherwise.

#### Parameters

| Parameter   | Type                                   | Description                                                                                                                                                                                                                                   |
| ----------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `predicate` | (`value`, `index`, `obj`) => `unknown` | find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, findIndex immediately returns that element index. Otherwise, findIndex returns -1. |
| `thisArg?`  | `any`                                  | If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead.                                                                                                            |

#### Returns

`number`

#### Inherited from

```ts
ReadonlyArray.findIndex;
```

---

### findLast()

#### Call Signature

```ts
findLast<S>(predicate, thisArg?): S;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2023.array.d.ts:98

Returns the value of the last element in the array where predicate is true, and undefined
otherwise.

##### Type Parameters

| Type Parameter                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `S` _extends_ \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \} |

##### Parameters

| Parameter   | Type                                        | Description                                                                                                                                                                                                                                             |
| ----------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `predicate` | (`value`, `index`, `array`) => `value is S` | findLast calls predicate once for each element of the array, in descending order, until it finds one where predicate returns true. If such an element is found, findLast immediately returns that element value. Otherwise, findLast returns undefined. |
| `thisArg?`  | `any`                                       | If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead.                                                                                                                      |

##### Returns

`S`

##### Inherited from

```ts
ReadonlyArray.findLast;
```

#### Call Signature

```ts
findLast(predicate, thisArg?):
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
};
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2023.array.d.ts:102

##### Parameters

| Parameter   | Type                                     |
| ----------- | ---------------------------------------- |
| `predicate` | (`value`, `index`, `array`) => `unknown` |
| `thisArg?`  | `any`                                    |

##### Returns

\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\}

##### Inherited from

```ts
ReadonlyArray.findLast;
```

---

### findLastIndex()

```ts
findLastIndex(predicate, thisArg?): number;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2023.array.d.ts:116

Returns the index of the last element in the array where predicate is true, and -1
otherwise.

#### Parameters

| Parameter   | Type                                     | Description                                                                                                                                                                                                                                                     |
| ----------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `predicate` | (`value`, `index`, `array`) => `unknown` | findLastIndex calls predicate once for each element of the array, in descending order, until it finds one where predicate returns true. If such an element is found, findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1. |
| `thisArg?`  | `any`                                    | If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead.                                                                                                                              |

#### Returns

`number`

#### Inherited from

```ts
ReadonlyArray.findLastIndex;
```

---

### flat()

```ts
flat<A, D>(this, depth?): FlatArray<A, D>[];
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2019.array.d.ts:47

Returns a new array with all sub-array elements concatenated into it recursively up to the
specified depth.

#### Type Parameters

| Type Parameter         | Default type |
| ---------------------- | ------------ |
| `A`                    | -            |
| `D` _extends_ `number` | `1`          |

#### Parameters

| Parameter | Type | Description                 |
| --------- | ---- | --------------------------- |
| `this`    | `A`  | -                           |
| `depth?`  | `D`  | The maximum recursion depth |

#### Returns

`FlatArray`&lt;`A`, `D`&gt;[]

#### Inherited from

```ts
ReadonlyArray.flat;
```

---

### flatMap()

```ts
flatMap<U, This>(callback, thisArg?): U[];
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2019.array.d.ts:36

Calls a defined callback function on each element of an array. Then, flattens the result into
a new array.
This is identical to a map followed by flat with depth 1.

#### Type Parameters

| Type Parameter | Default type |
| -------------- | ------------ |
| `U`            | -            |
| `This`         | `undefined`  |

#### Parameters

| Parameter  | Type                                                         | Description                                                                                                                           |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `callback` | (`this`, `value`, `index`, `array`) => `U` \| readonly `U`[] | A function that accepts up to three arguments. The flatMap method calls the callback function one time for each element in the array. |
| `thisArg?` | `This`                                                       | An object to which the this keyword can refer in the callback function. If thisArg is omitted, undefined is used as the this value.   |

#### Returns

`U`[]

#### Inherited from

```ts
ReadonlyArray.flatMap;
```

---

### forEach()

```ts
forEach(callbackfn, thisArg?): void;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1269

Performs the specified action for each element in an array.

#### Parameters

| Parameter    | Type                                  | Description                                                                                                                           |
| ------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `callbackfn` | (`value`, `index`, `array`) => `void` | A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.          |
| `thisArg?`   | `any`                                 | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`void`

#### Inherited from

```ts
ReadonlyArray.forEach;
```

---

### includes()

```ts
includes(searchElement, fromIndex?): boolean;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2016.array.include.d.ts:34

Determines whether an array includes a certain element, returning true or false as appropriate.

#### Parameters

| Parameter       | Type                                                                                                                                                                               | Description                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `searchElement` | \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \} | The element to search for.                                                |
| `fromIndex?`    | `number`                                                                                                                                                                           | The position in this array at which to begin searching for searchElement. |

#### Returns

`boolean`

#### Inherited from

```ts
ReadonlyArray.includes;
```

---

### indexOf()

```ts
indexOf(searchElement, fromIndex?): number;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1230

Returns the index of the first occurrence of a value in an array.

#### Parameters

| Parameter       | Type                                                                                                                                                                               | Description                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `searchElement` | \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \} | The value to locate in the array.                                                                    |
| `fromIndex?`    | `number`                                                                                                                                                                           | The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0. |

#### Returns

`number`

#### Inherited from

```ts
ReadonlyArray.indexOf;
```

---

### join()

```ts
join(separator?): string;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1218

Adds all the elements of an array separated by the specified separator string.

#### Parameters

| Parameter    | Type     | Description                                                                                                                                         |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `separator?` | `string` | A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma. |

#### Returns

`string`

#### Inherited from

```ts
ReadonlyArray.join;
```

---

### keys()

```ts
keys(): ArrayIterator<number>;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts:124

Returns an iterable of keys in the array

#### Returns

`ArrayIterator`&lt;`number`&gt;

#### Inherited from

```ts
ReadonlyArray.keys;
```

---

### lastIndexOf()

```ts
lastIndexOf(searchElement, fromIndex?): number;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1236

Returns the index of the last occurrence of a specified value in an array.

#### Parameters

| Parameter       | Type                                                                                                                                                                               | Description                                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `searchElement` | \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \} | The value to locate in the array.                                                                                        |
| `fromIndex?`    | `number`                                                                                                                                                                           | The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array. |

#### Returns

`number`

#### Inherited from

```ts
ReadonlyArray.lastIndexOf;
```

---

### map()

```ts
map<U>(callbackfn, thisArg?): U[];
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1275

Calls a defined callback function on each element of an array, and returns an array that contains the results.

#### Type Parameters

| Type Parameter |
| -------------- |
| `U`            |

#### Parameters

| Parameter    | Type                               | Description                                                                                                                           |
| ------------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `callbackfn` | (`value`, `index`, `array`) => `U` | A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.   |
| `thisArg?`   | `any`                              | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`U`[]

#### Inherited from

```ts
ReadonlyArray.map;
```

---

### reduce()

#### Call Signature

```ts
reduce(callbackfn):
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
};
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1293

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

##### Parameters

| Parameter    | Type                                                                                                                                                                                                                                             | Description                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `callbackfn` | (`previousValue`, `currentValue`, `currentIndex`, `array`) => \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \} | A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array. |

##### Returns

\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\}

##### Inherited from

```ts
ReadonlyArray.reduce;
```

#### Call Signature

```ts
reduce(callbackfn, initialValue):
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
};
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1294

##### Parameters

| Parameter      | Type                                                                                                                                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `callbackfn`   | (`previousValue`, `currentValue`, `currentIndex`, `array`) => \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \} |
| `initialValue` | \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \}                                                               |

##### Returns

\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\}

##### Inherited from

```ts
ReadonlyArray.reduce;
```

#### Call Signature

```ts
reduce<U>(callbackfn, initialValue): U;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1300

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

##### Type Parameters

| Type Parameter |
| -------------- |
| `U`            |

##### Parameters

| Parameter      | Type                                                              | Description                                                                                                                                                                                      |
| -------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `callbackfn`   | (`previousValue`, `currentValue`, `currentIndex`, `array`) => `U` | A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.                                                            |
| `initialValue` | `U`                                                               | If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value. |

##### Returns

`U`

##### Inherited from

```ts
ReadonlyArray.reduce;
```

---

### reduceRight()

#### Call Signature

```ts
reduceRight(callbackfn):
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
};
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1306

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

##### Parameters

| Parameter    | Type                                                                                                                                                                                                                                             | Description                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `callbackfn` | (`previousValue`, `currentValue`, `currentIndex`, `array`) => \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \} | A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array. |

##### Returns

\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\}

##### Inherited from

```ts
ReadonlyArray.reduceRight;
```

#### Call Signature

```ts
reduceRight(callbackfn, initialValue):
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
};
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1307

##### Parameters

| Parameter      | Type                                                                                                                                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `callbackfn`   | (`previousValue`, `currentValue`, `currentIndex`, `array`) => \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \} |
| `initialValue` | \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \}                                                               |

##### Returns

\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\}

##### Inherited from

```ts
ReadonlyArray.reduceRight;
```

#### Call Signature

```ts
reduceRight<U>(callbackfn, initialValue): U;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1313

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

##### Type Parameters

| Type Parameter |
| -------------- |
| `U`            |

##### Parameters

| Parameter      | Type                                                              | Description                                                                                                                                                                                      |
| -------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `callbackfn`   | (`previousValue`, `currentValue`, `currentIndex`, `array`) => `U` | A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.                                                       |
| `initialValue` | `U`                                                               | If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value. |

##### Returns

`U`

##### Inherited from

```ts
ReadonlyArray.reduceRight;
```

---

### slice()

```ts
slice(start?, end?): (
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
})[];
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1224

Returns a section of an array.

#### Parameters

| Parameter | Type     | Description                                                                                         |
| --------- | -------- | --------------------------------------------------------------------------------------------------- |
| `start?`  | `number` | The beginning of the specified portion of the array.                                                |
| `end?`    | `number` | The end of the specified portion of the array. This is exclusive of the element at the index 'end'. |

#### Returns

(
\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\})[]

#### Inherited from

```ts
ReadonlyArray.slice;
```

---

### some()

```ts
some(predicate, thisArg?): boolean;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1263

Determines whether the specified callback function returns true for any element of an array.

#### Parameters

| Parameter   | Type                                     | Description                                                                                                                                                                                                                                |
| ----------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `predicate` | (`value`, `index`, `array`) => `unknown` | A function that accepts up to three arguments. The some method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value true, or until the end of the array. |
| `thisArg?`  | `any`                                    | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.                                                                                                       |

#### Returns

`boolean`

#### Inherited from

```ts
ReadonlyArray.some;
```

---

### toLocaleString()

#### Call Signature

```ts
toLocaleString(): string;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1203

Returns a string representation of an array. The elements are converted to string using their toLocaleString methods.

##### Returns

`string`

##### Inherited from

```ts
ReadonlyArray.toLocaleString;
```

#### Call Signature

```ts
toLocaleString(locales, options?): string;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2015.core.d.ts:366

##### Parameters

| Parameter  | Type                                            |
| ---------- | ----------------------------------------------- |
| `locales`  | `string` \| `string`[]                          |
| `options?` | `NumberFormatOptions` & `DateTimeFormatOptions` |

##### Returns

`string`

##### Inherited from

```ts
ReadonlyArray.toLocaleString;
```

---

### toReversed()

```ts
toReversed(): (
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
})[];
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2023.array.d.ts:124

Copies the array and returns the copied array with all of its elements reversed.

#### Returns

(
\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\})[]

#### Inherited from

```ts
ReadonlyArray.toReversed;
```

---

### toSorted()

```ts
toSorted(compareFn?): (
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
})[];
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2023.array.d.ts:135

Copies and sorts the array.

#### Parameters

| Parameter    | Type                   | Description                                                                                                                                                                                                                                                                                                                                           |
| ------------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `compareFn?` | (`a`, `b`) => `number` | Function used to determine the order of the elements. It is expected to return a negative value if the first argument is less than the second argument, zero if they're equal, and a positive value otherwise. If omitted, the elements are sorted in ascending, UTF-16 code unit order. `[11, 2, 22, 1].toSorted((a, b) => a - b) // [1, 2, 11, 22]` |

#### Returns

(
\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\})[]

#### Inherited from

```ts
ReadonlyArray.toSorted;
```

---

### toSpliced()

#### Call Signature

```ts
toSpliced(
   start,
   deleteCount, ...
   items): (
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
})[];
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2023.array.d.ts:144

Copies an array and removes elements while, if necessary, inserting new elements in their place, returning the remaining elements.

##### Parameters

| Parameter     | Type                                                                                                                                                                                    | Description                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `start`       | `number`                                                                                                                                                                                | The zero-based location in the array from which to start removing elements. |
| `deleteCount` | `number`                                                                                                                                                                                | The number of elements to remove.                                           |
| ...`items`    | ( \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \})[] | Elements to insert into the copied array in place of the deleted elements.  |

##### Returns

(
\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\})[]

A copy of the original array with the remaining elements.

##### Inherited from

```ts
ReadonlyArray.toSpliced;
```

#### Call Signature

```ts
toSpliced(start, deleteCount?): (
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
})[];
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2023.array.d.ts:152

Copies an array and removes elements while returning the remaining elements.

##### Parameters

| Parameter      | Type     | Description                                                                 |
| -------------- | -------- | --------------------------------------------------------------------------- |
| `start`        | `number` | The zero-based location in the array from which to start removing elements. |
| `deleteCount?` | `number` | The number of elements to remove.                                           |

##### Returns

(
\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\})[]

A copy of the original array with the remaining elements.

##### Inherited from

```ts
ReadonlyArray.toSpliced;
```

---

### toString()

```ts
toString(): string;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1199

Returns a string representation of an array.

#### Returns

`string`

#### Inherited from

```ts
ReadonlyArray.toString;
```

---

### values()

```ts
values(): ArrayIterator<
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
}>;
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts:129

Returns an iterable of values in the array

#### Returns

`ArrayIterator`&lt;
\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\}&gt;

#### Inherited from

```ts
ReadonlyArray.values;
```

---

### with()

```ts
with(index, value): (
  | string
  | 0
  | DOMAttributes
  | DOMOutputSpecArray
  | Node
  | {
  contentDOM?: HTMLElement;
  dom: Node;
})[];
```

Defined in: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es2023.array.d.ts:163

Copies an array, then overwrites the value at the provided index with the
given value. If the index is negative, then it replaces from the end
of the array

#### Parameters

| Parameter | Type                                                                                                                                                                               | Description                                                                                                |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `index`   | `number`                                                                                                                                                                           | The index of the value to overwrite. If the index is negative, then it replaces from the end of the array. |
| `value`   | \| `string` \| `0` \| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md) \| `DOMOutputSpecArray` \| `Node` \| \{ `contentDOM?`: `HTMLElement`; `dom`: `Node`; \} | The value to insert into the copied array.                                                                 |

#### Returns

(
\| `string`
\| `0`
\| [`DOMAttributes`](../../DOMAttributes/type-aliases/DOMAttributes.md)
\| `DOMOutputSpecArray`
\| `Node`
\| \{
`contentDOM?`: `HTMLElement`;
`dom`: `Node`;
\})[]

A copy of the original array with the inserted value.

#### Inherited from

```ts
ReadonlyArray.with;
```

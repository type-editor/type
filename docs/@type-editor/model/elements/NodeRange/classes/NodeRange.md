[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/model](../../../README.md) / [elements/NodeRange](../README.md) / NodeRange

# Class: NodeRange

Defined in: [packages/model/src/elements/NodeRange.ts:9](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/elements/NodeRange.ts#L9)

Represents a flat range of content, i.e. one that starts and
ends in the same node.

## Constructors

### Constructor

```ts
new NodeRange(
   $from,
   $to,
   depth): NodeRange;
```

Defined in: [packages/model/src/elements/NodeRange.ts:42](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/elements/NodeRange.ts#L42)

Construct a node range. `$from` and `$to` should point into the
same node until at least the given `depth`, since a node range
denotes an adjacent set of nodes in a single parent node.

#### Parameters

| Parameter | Type                                                      | Description                                                                                                                                                                                                                                  |
| --------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$from`   | [`ResolvedPos`](../../ResolvedPos/classes/ResolvedPos.md) | A resolved position along the start of the content. May have a `depth` greater than this object's `depth` property, since these are the positions that were used to compute the range, not re-resolved positions directly at its boundaries. |
| `$to`     | [`ResolvedPos`](../../ResolvedPos/classes/ResolvedPos.md) | A position along the end of the content. See caveat for [`$from`](#model.NodeRange.$from).                                                                                                                                                   |
| `depth`   | `number`                                                  | The depth of the node that this range points into.                                                                                                                                                                                           |

#### Returns

`NodeRange`

## Accessors

### $from

#### Get Signature

```ts
get $from(): ResolvedPos;
```

Defined in: [packages/model/src/elements/NodeRange.ts:51](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/elements/NodeRange.ts#L51)

A resolved position at the start of the range.

##### Returns

[`ResolvedPos`](../../ResolvedPos/classes/ResolvedPos.md)

---

### $to

#### Get Signature

```ts
get $to(): ResolvedPos;
```

Defined in: [packages/model/src/elements/NodeRange.ts:58](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/elements/NodeRange.ts#L58)

A resolved position at the end of the range.

##### Returns

[`ResolvedPos`](../../ResolvedPos/classes/ResolvedPos.md)

---

### depth

#### Get Signature

```ts
get depth(): number;
```

Defined in: [packages/model/src/elements/NodeRange.ts:65](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/elements/NodeRange.ts#L65)

The depth of the node that this range points into.

##### Returns

`number`

---

### end

#### Get Signature

```ts
get end(): number;
```

Defined in: [packages/model/src/elements/NodeRange.ts:83](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/elements/NodeRange.ts#L83)

The position at the end of the range.

##### Returns

`number`

The absolute position at the end of this node range.

---

### endIndex

#### Get Signature

```ts
get endIndex(): number;
```

Defined in: [packages/model/src/elements/NodeRange.ts:110](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/elements/NodeRange.ts#L110)

The end index of the range in the parent node.

##### Returns

`number`

The child index after where this range ends within its parent.

---

### parent

#### Get Signature

```ts
get parent(): Node;
```

Defined in: [packages/model/src/elements/NodeRange.ts:92](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/elements/NodeRange.ts#L92)

The parent node that the range points into.

##### Returns

[`Node`](../../Node/classes/Node.md)

The parent node containing this range at the specified depth.

---

### start

#### Get Signature

```ts
get start(): number;
```

Defined in: [packages/model/src/elements/NodeRange.ts:74](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/elements/NodeRange.ts#L74)

The position at the start of the range.

##### Returns

`number`

The absolute position at the start of this node range.

---

### startIndex

#### Get Signature

```ts
get startIndex(): number;
```

Defined in: [packages/model/src/elements/NodeRange.ts:101](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/model/src/elements/NodeRange.ts#L101)

The start index of the range in the parent node.

##### Returns

`number`

The child index where this range starts within its parent.

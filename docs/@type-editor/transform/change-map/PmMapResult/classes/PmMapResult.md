[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/transform](../../../README.md) / [change-map/PmMapResult](../README.md) / PmMapResult

# Class: PmMapResult

Defined in: [packages/transform/src/change-map/PmMapResult.ts:32](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-map/PmMapResult.ts#L32)

An object representing a mapped position with additional information about the mapping.

This class implements the `IMapResult` interface and provides detailed feedback about
what happened to a position during a document transformation. It includes the mapped
position itself, deletion information (as bitwise flags and convenient boolean properties),
and recovery values for handling mirrored transformations in collaborative editing scenarios.

The deletion flags indicate whether content was deleted before, after, or across the
position, which is crucial for correctly handling selections and cursor positions during
document changes.

## Example

```typescript
// Map a position through a deletion
const stepMap = new StepMap([5, 10, 0]); // Delete 10 chars at position 5
const result = stepMap.mapResult(8, 1);

console.log(result.pos); // 5 (maps to deletion start)
console.log(result.deleted); // true (position was deleted)
console.log(result.deletedAcross); // true (deletion spans across position)
console.log(result.recover); // Recovery value if mirror exists, or null
```

## See

- IMapResult for the interface definition
- StepMap.mapResult for the primary way to create MapResult instances

## Implements

- `MapResult`

## Constructors

### Constructor

```ts
new PmMapResult(
   pos,
   delInfo,
   recover): PmMapResult;
```

Defined in: [packages/transform/src/change-map/PmMapResult.ts:85](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-map/PmMapResult.ts#L85)

Create a mapping result object.

This constructor is typically called by `StepMap.mapResult()` or `Mapping.mapResult()`
rather than being instantiated directly in application code.

#### Parameters

| Parameter | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                              |
| --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pos`     | `number` | The mapped version of the position in the transformed document. This represents where the original position ends up after applying the transformation(s). If the position was deleted, this will typically be the position where the deletion started.                                                                                                                                                   |
| `delInfo` | `number` | Bitwise combination of `DeletionInfo` flags indicating what content was deleted relative to the position: - `BEFORE` (1): Content before the position was deleted - `AFTER` (2): Content after the position was deleted - `ACROSS` (4): Content both before and after (spanning) was deleted - `SIDE` (8): The position itself is on the deleted side Flags can be combined using bitwise OR operations. |
| `recover` | `number` | Recovery value that can be used to map through mirrored transformations, or `null` if no mirror relationship exists. When mapping through a sequence of steps where some are inverses of others, this value enables position recovery. This is essential for collaborative editing and undo/redo.                                                                                                        |

#### Returns

`PmMapResult`

#### Example

```typescript
// Typically created by StepMap:
const result = new MapResult(5, DeletionInfo.ACROSS | DeletionInfo.SIDE, null);

// With recovery value for mirrored steps:
const resultWithRecover = new MapResult(10, DeletionInfo.AFTER, 12345);
```

## Accessors

### deleted

#### Get Signature

```ts
get deleted(): boolean;
```

Defined in: [packages/transform/src/change-map/PmMapResult.ts:214](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-map/PmMapResult.ts#L214)

Indicates whether the position was deleted during the transformation.

A position is considered "deleted" when the transformation removed the token
on the side specified by the `assoc` parameter used when mapping. This flag
is determined by checking if the `SIDE` bit is set in the deletion info flags.

The meaning of "deleted" depends on the association side:

- When `assoc = 1` (right): Position is deleted if content to the right was removed
- When `assoc = -1` (left): Position is deleted if content to the left was removed
- When content on both sides is removed: Always `true` regardless of `assoc`

##### Example

```typescript
const deleteMap = new StepMap([5, 10, 0]); // Delete 10 chars at position 5

// Position inside deleted range
deleteMap.mapResult(8, 1).deleted; // true

// Position at boundary with different associations
deleteMap.mapResult(5, -1).deleted; // false (assoc points left, away from deletion)
deleteMap.mapResult(5, 1).deleted; // true (assoc points right, into deletion)

// Position outside deleted range
deleteMap.mapResult(20, 1).deleted; // false
```

##### Returns

`boolean`

`true` if the position was deleted, `false` otherwise.

#### Implementation of

```ts
MapResult.deleted;
```

---

### deletedAcross

#### Get Signature

```ts
get deletedAcross(): boolean;
```

Defined in: [packages/transform/src/change-map/PmMapResult.ts:310](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-map/PmMapResult.ts#L310)

Indicates whether a deletion spanned across the position.

This returns `true` when the `ACROSS` flag is set, meaning the transformation
deleted content that included both the token before and after the position.
This indicates the position was in the middle of a deleted range, not just
adjacent to one.

This is the strongest form of deletion - it means the position was completely
surrounded by deleted content. This is useful for determining whether a position
needs special handling, such as collapsing a selection or adjusting a cursor.

##### Example

```typescript
const deleteMap = new StepMap([5, 20, 0]); // Delete 20 chars at position 5

// Position in middle of deleted range
deleteMap.mapResult(10, 1).deletedAcross; // true (deletion spans across)
deleteMap.mapResult(15, 1).deletedAcross; // true (deletion spans across)

// Position at boundary of deleted range
deleteMap.mapResult(5, -1).deletedAcross; // false (at boundary, not across)

// Position outside deleted range
deleteMap.mapResult(30, 1).deletedAcross; // false (no deletion here)
```

##### Returns

`boolean`

`true` if deletion spanned across the position, `false` otherwise.

#### Implementation of

```ts
MapResult.deletedAcross;
```

---

### deletedAfter

#### Get Signature

```ts
get deletedAfter(): boolean;
```

Defined in: [packages/transform/src/change-map/PmMapResult.ts:277](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-map/PmMapResult.ts#L277)

Indicates whether content immediately after the mapped position was deleted.

This returns `true` when either:

- The `AFTER` flag is set (content directly after the position was deleted)
- The `ACROSS` flag is set (deletion spanned across the position, including after it)

This is useful for determining if the position is at the boundary of a deletion
that occurred after it, which can affect how selections and cursors should be
adjusted after the transformation.

##### Example

```typescript
const deleteMap = new StepMap([10, 5, 0]); // Delete 5 chars at position 10

// Position before the deletion
deleteMap.mapResult(8, 1).deletedAfter; // true (deletion happens after position 8)

// Position after the deletion
deleteMap.mapResult(20, 1).deletedAfter; // false (no deletion after position 20)

// Position in middle of deleted range
deleteMap.mapResult(12, 1).deletedAfter; // true (ACROSS flag set)
```

##### Returns

`boolean`

`true` if content after the position was deleted, `false` otherwise.

#### Implementation of

```ts
MapResult.deletedAfter;
```

---

### deletedBefore

#### Get Signature

```ts
get deletedBefore(): boolean;
```

Defined in: [packages/transform/src/change-map/PmMapResult.ts:246](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-map/PmMapResult.ts#L246)

Indicates whether content immediately before the mapped position was deleted.

This returns `true` when either:

- The `BEFORE` flag is set (content directly before the position was deleted)
- The `ACROSS` flag is set (deletion spanned across the position, including before it)

This is useful for determining if the position is at the boundary of a deletion
that occurred before it, which can affect how selections and cursors should be
adjusted after the transformation.

##### Example

```typescript
const deleteMap = new StepMap([5, 10, 0]); // Delete 10 chars at position 5

// Position after the deletion
deleteMap.mapResult(15, 1).deletedBefore; // true (deletion happened before position 15)

// Position before the deletion
deleteMap.mapResult(3, 1).deletedBefore; // false (no deletion before position 3)

// Position in middle of deleted range
deleteMap.mapResult(8, 1).deletedBefore; // true (ACROSS flag set)
```

##### Returns

`boolean`

`true` if content before the position was deleted, `false` otherwise.

#### Implementation of

```ts
MapResult.deletedBefore;
```

---

### delInfo

#### Get Signature

```ts
get delInfo(): number;
```

Defined in: [packages/transform/src/change-map/PmMapResult.ts:145](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-map/PmMapResult.ts#L145)

Bitwise flags indicating what content was deleted at the mapped position.

This is a bitwise combination of `DeletionInfo` flags that provide detailed
information about how deletions affected the position. The flags can be:

- `BEFORE` (1): Content before the position was deleted
- `AFTER` (2): Content after the position was deleted
- `ACROSS` (4): Content spanning across the position was deleted
- `SIDE` (8): The position itself is on the deleted side

For easier access to deletion information, use the boolean properties
(`deleted`, `deletedBefore`, `deletedAfter`, `deletedAcross`) instead of
working with these raw bitwise flags directly.

##### Example

```typescript
const result = stepMap.mapResult(pos, assoc);

// Check specific flags using bitwise operations
if (result.delInfo & DeletionInfo.BEFORE) {
  console.log("Content before was deleted");
}

// Or use the convenient boolean properties
if (result.deletedBefore) {
  console.log("Content before was deleted");
}
```

##### Returns

`number`

A non-negative integer representing the bitwise combination of flags.

#### Implementation of

```ts
MapResult.delInfo;
```

---

### pos

#### Get Signature

```ts
get pos(): number;
```

Defined in: [packages/transform/src/change-map/PmMapResult.ts:110](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-map/PmMapResult.ts#L110)

The mapped position in the transformed document.

This is the position in the post-transformation document that corresponds to
the original position that was mapped. When content at the original position
was deleted, this will typically be the position where the deletion started.

##### Example

```typescript
const insertMap = new StepMap([10, 0, 5]); // Insert 5 chars at position 10
insertMap.mapResult(15, 1).pos; // Returns 20 (position shifted by insertion)

const deleteMap = new StepMap([10, 5, 0]); // Delete 5 chars at position 10
deleteMap.mapResult(12, 1).pos; // Returns 10 (deleted position maps to deletion start)
```

##### Returns

`number`

The mapped position as a non-negative integer.

#### Implementation of

```ts
MapResult.pos;
```

---

### recover

#### Get Signature

```ts
get recover(): number;
```

Defined in: [packages/transform/src/change-map/PmMapResult.ts:181](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/transform/src/change-map/PmMapResult.ts#L181)

Recovery value for mapping through mirrored transformations, or `null`.

When a position is deleted and a mirror relationship exists between transformation
steps (indicating one step is the inverse of another), this value can be used to
recover the position by mapping it through the mirrored step. This is essential
for collaborative editing scenarios and undo/redo functionality where operations
need to be reversed or rebased.

Returns `null` when:

- No mirror relationship exists for the step(s) that affected this position
- The position wasn't affected by a deletion
- The mapping doesn't involve mirrored transformations

##### Example

```typescript
const mapping = new Mapping();
mapping.appendMap(deleteStep); // Delete something
mapping.appendMap(insertStep, 0); // Insert (mirrors the delete at index 0)

const result = mapping.mapResult(somePos, 1);
if (result.recover !== null) {
  // Can use result.recover to map through the mirror
  const recovered = mapping.maps[0].recover(result.recover);
}
```

##### See

- Mapping.setMirror for establishing mirror relationships
- StepMap.recover for using recovery values

##### Returns

`number`

A recovery value (integer) if mirror recovery is possible, or `null` otherwise.

#### Implementation of

```ts
MapResult.recover;
```

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/tables](../../../README.md) / [utils/move-row-in-array-of-rows](../README.md) / MoveDirection

# Type Alias: MoveDirection

```ts
type MoveDirection = -1 | 0 | 1;
```

Defined in: [tables/src/utils/move-row-in-array-of-rows.ts:7](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/tables/src/utils/move-row-in-array-of-rows.ts#L7)

Direction indicator for row movement.

- `-1`: Moving backward/upward (toward smaller indexes)
- `0`: Natural direction based on origin/target positions
- `1`: Moving forward/downward (toward larger indexes)

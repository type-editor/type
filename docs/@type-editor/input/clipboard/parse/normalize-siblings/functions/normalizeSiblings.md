[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [clipboard/parse/normalize-siblings](../README.md) / normalizeSiblings

# Function: normalizeSiblings()

```ts
function normalizeSiblings(fragment, $context): Fragment;
```

Defined in: [clipboard/parse/normalize-siblings.ts:13](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/clipboard/parse/normalize-siblings.ts#L13)

Try to wrap a list of top-level sibling nodes so they fit into a parent
in the current context. This transforms nodes where necessary to make
the slice coherent (so Transform.replace can insert it).

## Parameters

| Parameter  | Type          | Description                         |
| ---------- | ------------- | ----------------------------------- |
| `fragment` | `Fragment`    | Fragment containing top-level nodes |
| `$context` | `ResolvedPos` | Current resolved position context   |

## Returns

`Fragment`

Either the original fragment or a new fragment with wrapped nodes

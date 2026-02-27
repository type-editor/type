[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [parse-change/looks-like-backspace](../README.md) / looksLikeBackspace

# Function: looksLikeBackspace()

```ts
function looksLikeBackspace(old, start, end, $newStart, $newEnd): boolean;
```

Defined in: [parse-change/looks-like-backspace.ts:33](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/dom-change-util/src/dom-change/parse-change/looks-like-backspace.ts#L33)

Determines if a change looks like a backspace operation (joining or deleting blocks).

This function performs a sophisticated analysis to detect if a change resulted from
a backspace operation. Backspace can either delete an entire block or join two blocks
together. The detection helps determine if the change should be delegated to the
Backspace key handler instead of being processed as a regular DOM change.

**Detection Logic:**

1. **Content must have shrunk:** The old content range must be larger than the new range
2. **Valid end position:** The new end position must be at or after the block boundary
3. **Block deletion:** If not in a textblock, check if an entire block was removed
4. **Block join:** If in a textblock, verify:
   - Start is at the end of a textblock
   - Next textblock exists and was joined
   - Content after join point matches

The function uses internal helpers to navigate block boundaries and verify
that the structure matches a backspace operation pattern.

## Parameters

| Parameter   | Type          | Description                                                |
| ----------- | ------------- | ---------------------------------------------------------- |
| `old`       | `Node_2`      | The old (before change) document                           |
| `start`     | `number`      | Start position of the change in the old document           |
| `end`       | `number`      | End position of the change in the old document             |
| `$newStart` | `ResolvedPos` | Resolved start position in the new (after change) document |
| `$newEnd`   | `ResolvedPos` | Resolved end position in the new (after change) document   |

## Returns

`boolean`

True if the change pattern matches a backspace operation
(either block deletion or block join), false otherwise

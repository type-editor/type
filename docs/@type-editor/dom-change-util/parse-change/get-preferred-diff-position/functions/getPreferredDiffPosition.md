[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [parse-change/get-preferred-diff-position](../README.md) / getPreferredDiffPosition

# Function: getPreferredDiffPosition()

```ts
function getPreferredDiffPosition(view): {
  preferredPos: number;
  preferredSide: "start" | "end";
};
```

Defined in: [parse-change/get-preferred-diff-position.ts:29](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/dom-change-util/src/dom-change/parse-change/get-preferred-diff-position.ts#L29)

Determines the preferred position and side for diff calculation.

The diff algorithm needs to know where the user's cursor was to make better
decisions about how to align changes. This function determines the preferred
position based on recent keypress activity:

- **After Backspace:** Prefers anchoring to the end (selection.to) since
  backspace deletes backwards from the cursor position
- **Otherwise:** Prefers anchoring to the start (selection.from) which is
  the default for insertions and other changes

The preferred side ('start' or 'end') affects how ambiguous changes are
resolved in the diff algorithm.

## Parameters

| Parameter | Type           | Description                                                  |
| --------- | -------------- | ------------------------------------------------------------ |
| `view`    | `PmEditorView` | The editor view containing input state and current selection |

## Returns

```ts
{
  preferredPos: number;
  preferredSide: "start" | "end";
}
```

Object containing: - preferredPos: The document position to anchor the diff from - preferredSide: Whether to prefer 'start' or 'end' alignment

| Name            | Type                 | Defined in                                                                                                                                                                                                                  |
| --------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preferredPos`  | `number`             | [parse-change/get-preferred-diff-position.ts:29](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/dom-change-util/src/dom-change/parse-change/get-preferred-diff-position.ts#L29) |
| `preferredSide` | `"start"` \| `"end"` | [parse-change/get-preferred-diff-position.ts:29](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/dom-change-util/src/dom-change/parse-change/get-preferred-diff-position.ts#L29) |

## See

findDiff for how these values are used

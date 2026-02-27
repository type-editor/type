[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/input](../../../../../README.md) / [input-handler/keyboard/browser-hacks/safari-down-arrow-bug](../README.md) / safariDownArrowBug

# Function: safariDownArrowBug()

```ts
function safariDownArrowBug(view): boolean;
```

Defined in: [input-handler/keyboard/browser-hacks/safari-down-arrow-bug.ts:16](https://github.com/type-editor/type/blob/29c0b7ebbb68b1528c0edc5e9973c4538cccdb64/packages/input/src/input-handler/keyboard/browser-hacks/safari-down-arrow-bug.ts#L16)

Workaround for Safari down arrow bug.

Issue #867, #1090 / https://bugs.chromium.org/p/chromium/issues/detail?id=903821
Safari does incorrect things when down arrow is pressed with cursor at the start
of a textblock that has an uneditable node after it. This temporarily makes the
node editable to work around the issue.

## Parameters

| Parameter | Type           | Description             |
| --------- | -------------- | ----------------------- |
| `view`    | `PmEditorView` | The EditorView instance |

## Returns

`boolean`

Always returns false (doesn't prevent default)

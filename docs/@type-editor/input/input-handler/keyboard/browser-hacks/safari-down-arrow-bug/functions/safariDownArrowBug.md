[**Type Editor**](../../../../../../../README.md)

---

[Type Editor](../../../../../../../index.md) / [@type-editor/input](../../../../../README.md) / [input-handler/keyboard/browser-hacks/safari-down-arrow-bug](../README.md) / safariDownArrowBug

# Function: safariDownArrowBug()

```ts
function safariDownArrowBug(view): boolean;
```

Defined in: [input-handler/keyboard/browser-hacks/safari-down-arrow-bug.ts:16](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/input/src/input-handler/keyboard/browser-hacks/safari-down-arrow-bug.ts#L16)

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

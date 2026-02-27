[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/dom-change-util](../../../README.md) / [browser-hacks/adjust-for-chrome-backspace-bug](../README.md) / adjustForChromeBackspaceBug

# Function: adjustForChromeBackspaceBug()

```ts
function adjustForChromeBackspaceBug(
  view,
  parent,
  fromOffset,
  toOffset,
): number;
```

Defined in: [browser-hacks/adjust-for-chrome-backspace-bug.ts:30](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/dom-change-util/src/dom-change/browser-hacks/adjust-for-chrome-backspace-bug.ts#L30)

Adjusts the toOffset to work around Chrome's backspace bug where it sometimes
replaces deleted content with a random BR node (issues #799, #831).

Chrome has a quirk where after a backspace operation, it sometimes inserts
a stray BR element in the DOM. This function scans backwards from the end
of the range looking for such BR nodes that don't have an associated view
descriptor (indicating they're not part of the ProseMirror document structure).

The function also checks for empty view descriptors (size 0) and stops scanning
if it encounters a view descriptor with actual size, as that indicates real content.

This workaround is only applied on Chrome and only when the last key pressed
was Backspace.

## Parameters

| Parameter    | Type           | Description                                                       |
| ------------ | -------------- | ----------------------------------------------------------------- |
| `view`       | `PmEditorView` | The editor view containing the input state                        |
| `parent`     | `Node`         | The parent DOM node containing the range being parsed             |
| `fromOffset` | `number`       | Start offset (child index) in the parent node                     |
| `toOffset`   | `number`       | End offset (child index) in the parent node to potentially adjust |

## Returns

`number`

The adjusted toOffset, which may be reduced if a stray BR was found,
or the original toOffset if no adjustment is needed

## See

- https://github.com/ProseMirror/prosemirror/issues/799
- https://github.com/ProseMirror/prosemirror/issues/831

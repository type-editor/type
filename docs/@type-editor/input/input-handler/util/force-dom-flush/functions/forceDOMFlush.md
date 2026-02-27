[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/util/force-dom-flush](../README.md) / forceDOMFlush

# Function: forceDOMFlush()

```ts
function forceDOMFlush(view): boolean;
```

Defined in: [input-handler/util/force-dom-flush.ts:11](https://github.com/type-editor/type/blob/a2760cc13c592972408bf3457981c13a24abf3a2/packages/input/src/input-handler/util/force-dom-flush.ts#L11)

Forces any pending DOM changes to be flushed and composition to end.

## Parameters

| Parameter | Type           | Description     |
| --------- | -------------- | --------------- |
| `view`    | `PmEditorView` | The editor view |

## Returns

`boolean`

True if composition was ended

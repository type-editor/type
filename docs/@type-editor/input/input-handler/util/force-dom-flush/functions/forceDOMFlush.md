[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/util/force-dom-flush](../README.md) / forceDOMFlush

# Function: forceDOMFlush()

```ts
function forceDOMFlush(view): boolean;
```

Defined in: [input-handler/util/force-dom-flush.ts:11](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/input/src/input-handler/util/force-dom-flush.ts#L11)

Forces any pending DOM changes to be flushed and composition to end.

## Parameters

| Parameter | Type           | Description     |
| --------- | -------------- | --------------- |
| `view`    | `PmEditorView` | The editor view |

## Returns

`boolean`

True if composition was ended

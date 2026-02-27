[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/util/force-dom-flush](../README.md) / forceDOMFlush

# Function: forceDOMFlush()

```ts
function forceDOMFlush(view): boolean;
```

Defined in: [input-handler/util/force-dom-flush.ts:11](https://github.com/type-editor/type/blob/8f2401b36ac56cc1b338db1b9300f2d4f10eb04a/packages/input/src/input-handler/util/force-dom-flush.ts#L11)

Forces any pending DOM changes to be flushed and composition to end.

## Parameters

| Parameter | Type           | Description     |
| --------- | -------------- | --------------- |
| `view`    | `PmEditorView` | The editor view |

## Returns

`boolean`

True if composition was ended

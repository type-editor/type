[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [clipboard/parse/restore-replaced-spaces](../README.md) / restoreReplacedSpaces

# Function: restoreReplacedSpaces()

```ts
function restoreReplacedSpaces(dom): void;
```

Defined in: [clipboard/parse/restore-replaced-spaces.ts:9](https://github.com/type-editor/type/blob/70862bf5e8a5266dfb443941f265014c48842b41/packages/input/src/clipboard/parse/restore-replaced-spaces.ts#L9)

WebKit sometimes replaces spaces with NBSPs inside a wrapper span when
copying. This restores normal spaces for those placeholder spans.

## Parameters

| Parameter | Type          | Description                |
| --------- | ------------- | -------------------------- |
| `dom`     | `HTMLElement` | The DOM element to process |

## Returns

`void`

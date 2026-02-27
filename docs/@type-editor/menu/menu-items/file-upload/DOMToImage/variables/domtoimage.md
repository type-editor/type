[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/file-upload/DOMToImage](../README.md) / domtoimage

# Variable: domtoimage

```ts
const domtoimage: DomToImage;
```

Defined in: [packages/menu/src/menu-items/file-upload/DOMToImage.ts:1609](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/menu-items/file-upload/DOMToImage.ts#L1609)

Main export: DOM to Image conversion library

## Example

```typescript
import { domtoimage } from "./main";

const element = document.getElementById("myElement");
const dataUrl = await domtoimage.toImage(element, {
  quality: 0.9,
  pixelRatio: 2,
  maxWidth: 1920,
  maxHeight: 1080,
});
```

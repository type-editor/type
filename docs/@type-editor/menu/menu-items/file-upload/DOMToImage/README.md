[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / menu-items/file-upload/DOMToImage

# menu-items/file-upload/DOMToImage

## Interfaces

<table>
<thead>
<tr>
<th>Interface</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[DomToImage](interfaces/DomToImage.md)

</td>
<td>

Main DomToImage API interface

</td>
</tr>
<tr>
<td>

[DomToImageOptions](interfaces/DomToImageOptions.md)

</td>
<td>

Configuration options for DOM to Image conversion

</td>
</tr>
</tbody>
</table>

## Variables

<table>
<thead>
<tr>
<th>Variable</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[domtoimage](variables/domtoimage.md)

</td>
<td>

Main export: DOM to Image conversion library

**Example**

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

</td>
</tr>
</tbody>
</table>

[**Type Editor**](../../../../../README.md)

---

[Type Editor](../../../../../index.md) / [@type-editor/menu](../../../README.md) / menu-items/file-upload/ThumbnailGenerator

# menu-items/file-upload/ThumbnailGenerator

## Classes

<table>
<thead>
<tr>
<th>Class</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[ThumbnailGenerator](classes/ThumbnailGenerator.md)

</td>
<td>

Generates thumbnail images from various file types including PDFs, images, and text files.

The generator supports multiple file formats and automatically selects the best
thumbnail generation strategy based on the file's MIME type.

**Example**

```typescript
const generator = new ThumbnailGenerator({
  targetWidth: 200,
  targetHeight: 300,
});
const thumbnail = await generator.generateThumbnail(file);
if (thumbnail) {
  img.src = thumbnail.src;
}
```

</td>
</tr>
</tbody>
</table>

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

[Thumbnail](interfaces/Thumbnail.md)

</td>
<td>

Represents a generated thumbnail with its dimensions.

</td>
</tr>
<tr>
<td>

[ThumbnailGeneratorOptions](interfaces/ThumbnailGeneratorOptions.md)

</td>
<td>

Configuration options for the ThumbnailGenerator.

</td>
</tr>
</tbody>
</table>

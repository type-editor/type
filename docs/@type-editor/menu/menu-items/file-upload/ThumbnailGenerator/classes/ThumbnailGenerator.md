[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/menu](../../../../README.md) / [menu-items/file-upload/ThumbnailGenerator](../README.md) / ThumbnailGenerator

# Class: ThumbnailGenerator

Defined in: [packages/menu/src/menu-items/file-upload/ThumbnailGenerator.ts:67](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/menu-items/file-upload/ThumbnailGenerator.ts#L67)

Generates thumbnail images from various file types including PDFs, images, and text files.

The generator supports multiple file formats and automatically selects the best
thumbnail generation strategy based on the file's MIME type.

## Example

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

## Constructors

### Constructor

```ts
new ThumbnailGenerator(options?): ThumbnailGenerator;
```

Defined in: [packages/menu/src/menu-items/file-upload/ThumbnailGenerator.ts:84](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/menu-items/file-upload/ThumbnailGenerator.ts#L84)

Creates a new ThumbnailGenerator instance.

#### Parameters

| Parameter | Type                                                                      | Description                                    |
| --------- | ------------------------------------------------------------------------- | ---------------------------------------------- |
| `options` | [`ThumbnailGeneratorOptions`](../interfaces/ThumbnailGeneratorOptions.md) | Configuration options for thumbnail generation |

#### Returns

`ThumbnailGenerator`

## Methods

### generateThumbnail()

```ts
generateThumbnail(file): Promise<Thumbnail>;
```

Defined in: [packages/menu/src/menu-items/file-upload/ThumbnailGenerator.ts:101](https://github.com/type-editor/type/blob/1440286448396eb7a2fecaed8442b6ac57cafd0e/packages/menu/src/menu-items/file-upload/ThumbnailGenerator.ts#L101)

Generates a thumbnail for the given file.

The method selects the appropriate thumbnail generation strategy based on
the file's MIME type:

- PDF files: Renders the first page
- Image files: Creates a scaled preview
- Text/code files: Renders the content
- Other files: Falls back to displaying the filename

#### Parameters

| Parameter | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| `file`    | `File` | The file to generate a thumbnail for |

#### Returns

`Promise`&lt;[`Thumbnail`](../interfaces/Thumbnail.md)&gt;

A Promise resolving to a Thumbnail object, or null if generation fails

[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/markdown](../../../../README.md) / [to-markdown/schema/markdown-schema-marks](../README.md) / markdownSchemaMarks

# Variable: markdownSchemaMarks

```ts
const markdownSchemaMarks: {
  code: {
    escape: boolean;
    close: string;
    open: string;
  };
  em: {
    close: string;
    expelEnclosingWhitespace: boolean;
    mixable: boolean;
    open: string;
  };
  link: {
    mixable: boolean;
    close: string;
    open: string;
  };
  strong: {
    close: string;
    expelEnclosingWhitespace: boolean;
    mixable: boolean;
    open: string;
  };
};
```

Defined in: [to-markdown/schema/markdown-schema-marks.ts:9](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L9)

## Type Declaration

| Name                                  | Type                                                                                                    | Default value | Defined in                                                                                                                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-code"></a> `code`     | \{ `escape`: `boolean`; `close`: `string`; `open`: `string`; \}                                         | -             | [to-markdown/schema/markdown-schema-marks.ts:34](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L34) |
| `code.escape`                         | `boolean`                                                                                               | `false`       | [to-markdown/schema/markdown-schema-marks.ts:43](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L43) |
| `close()`                             | ( `_state`, `_mark`, `parent`, `index`) => `string`                                                     | -             | [to-markdown/schema/markdown-schema-marks.ts:39](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L39) |
| `open()`                              | ( `_state`, `_mark`, `parent`, `index`) => `string`                                                     | -             | [to-markdown/schema/markdown-schema-marks.ts:35](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L35) |
| <a id="property-em"></a> `em`         | \{ `close`: `string`; `expelEnclosingWhitespace`: `boolean`; `mixable`: `boolean`; `open`: `string`; \} | -             | [to-markdown/schema/markdown-schema-marks.ts:11](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L11) |
| `em.close`                            | `string`                                                                                                | `'*'`         | [to-markdown/schema/markdown-schema-marks.ts:11](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L11) |
| `em.expelEnclosingWhitespace`         | `boolean`                                                                                               | `true`        | [to-markdown/schema/markdown-schema-marks.ts:11](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L11) |
| `em.mixable`                          | `boolean`                                                                                               | `true`        | [to-markdown/schema/markdown-schema-marks.ts:11](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L11) |
| `em.open`                             | `string`                                                                                                | `'*'`         | [to-markdown/schema/markdown-schema-marks.ts:11](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L11) |
| <a id="property-link"></a> `link`     | \{ `mixable`: `boolean`; `close`: `string`; `open`: `string`; \}                                        | -             | [to-markdown/schema/markdown-schema-marks.ts:15](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L15) |
| `link.mixable`                        | `boolean`                                                                                               | `true`        | [to-markdown/schema/markdown-schema-marks.ts:31](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L31) |
| `close()`                             | ( `state`, `mark`, `_parent`, `_index`) => `string`                                                     | -             | [to-markdown/schema/markdown-schema-marks.ts:21](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L21) |
| `open()`                              | ( `state`, `mark`, `parent`, `index`) => `string`                                                       | -             | [to-markdown/schema/markdown-schema-marks.ts:16](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L16) |
| <a id="property-strong"></a> `strong` | \{ `close`: `string`; `expelEnclosingWhitespace`: `boolean`; `mixable`: `boolean`; `open`: `string`; \} | -             | [to-markdown/schema/markdown-schema-marks.ts:13](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L13) |
| `strong.close`                        | `string`                                                                                                | `'**'`        | [to-markdown/schema/markdown-schema-marks.ts:13](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L13) |
| `strong.expelEnclosingWhitespace`     | `boolean`                                                                                               | `true`        | [to-markdown/schema/markdown-schema-marks.ts:13](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L13) |
| `strong.mixable`                      | `boolean`                                                                                               | `true`        | [to-markdown/schema/markdown-schema-marks.ts:13](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L13) |
| `strong.open`                         | `string`                                                                                                | `'**'`        | [to-markdown/schema/markdown-schema-marks.ts:13](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/markdown/src/to-markdown/schema/markdown-schema-marks.ts#L13) |

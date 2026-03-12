[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/util/end-composition](../README.md) / endComposition

# Function: endComposition()

```ts
function endComposition(view, restarting?): boolean;
```

Defined in: [input-handler/util/end-composition.ts:15](https://github.com/type-editor/type/blob/99c78b8d1f93eef5c6a5bbfe09ed0a72a4c9ab4c/packages/input/src/input-handler/util/end-composition.ts#L15)

Ends the current composition, flushing any pending DOM changes and
updating the editor state as necessary.

## Parameters

| Parameter    | Type           | Default value | Description                                                |
| ------------ | -------------- | ------------- | ---------------------------------------------------------- |
| `view`       | `PmEditorView` | `undefined`   | The editor view                                            |
| `restarting` | `boolean`      | `false`       | Whether composition is being restarted (for mark handling) |

## Returns

`boolean`

True if the editor state was updated

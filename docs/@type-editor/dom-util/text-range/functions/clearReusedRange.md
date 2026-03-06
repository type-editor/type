[**Type Editor**](../../../../README.md)

---

[Type Editor](../../../../index.md) / [@type-editor/dom-util](../../README.md) / [text-range](../README.md) / clearReusedRange

# Function: clearReusedRange()

```ts
function clearReusedRange(): void;
```

Defined in: [text-range.ts:43](https://github.com/type-editor/type/blob/038251caf1e55ad0b5bc733a9b37b984ac250944/packages/dom-util/src/dom/text-range.ts#L43)

Clears the reused Range object.

This should be called when you need to ensure the cached Range is properly released,
particularly when switching contexts or cleaning up resources.

## Returns

`void`

## Example

```typescript
const range = textRange(textNode, 0, 5);
// ... use range ...
clearReusedRange(); // Clean up when done
```

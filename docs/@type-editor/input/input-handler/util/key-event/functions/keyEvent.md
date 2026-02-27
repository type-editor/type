[**Type Editor**](../../../../../../README.md)

---

[Type Editor](../../../../../../index.md) / [@type-editor/input](../../../../README.md) / [input-handler/util/key-event](../README.md) / keyEvent

# Function: keyEvent()

```ts
function keyEvent(keyCode, key): KeyboardEvent;
```

Defined in: [input-handler/util/key-event.ts:14](https://github.com/type-editor/type/blob/c311ca079abd6b61221c2aab5ce7aaefbf4271cf/packages/input/src/input-handler/util/key-event.ts#L14)

Creates a synthetic keyboard event for testing or programmatic key simulation.

## Parameters

| Parameter | Type     | Description                                     |
| --------- | -------- | ----------------------------------------------- |
| `keyCode` | `number` | The numeric key code for the keyboard event     |
| `key`     | `string` | The key value (e.g., 'Enter', 'a', 'ArrowLeft') |

## Returns

`KeyboardEvent`

A KeyboardEvent object configured as a keydown event

## Example

```typescript
const enterEvent = keyEvent(13, "Enter");
element.dispatchEvent(enterEvent);
```

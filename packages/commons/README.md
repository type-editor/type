# @type-editor/commons

Common utilities and shared constants for the Type Editor ecosystem. This module provides browser detection, keyboard constants, DOM node types, and data structures used across all Type Editor packages.

## Installation

```bash
npm install @type-editor/commons
```

## Overview

This module exports utility functions, constants, and data structures that are commonly needed across the Type Editor ecosystem. It serves as a foundation layer that other packages depend on.

## Exports

### Browser Detection

The `browser` object provides information about the current runtime environment:

```typescript
import { browser } from '@type-editor/commons';

if (browser.safari) {
  // Safari-specific code
}

if (browser.mac) {
  // macOS-specific keybindings
}
```

| Property         | Type             | Description                                                |
|------------------|------------------|------------------------------------------------------------|
| `ie`             | `boolean`        | Whether the browser is Internet Explorer or Edge (legacy). |
| `ie_version`     | `number`         | IE version number, or 0 if not IE.                         |
| `gecko`          | `boolean`        | Whether the browser uses the Gecko engine (Firefox).       |
| `gecko_version`  | `number`         | Firefox version number, or 0 if not Gecko.                 |
| `chrome`         | `boolean`        | Whether the browser is Chrome.                             |
| `chrome_version` | `number`         | Chrome version number, or 0 if not Chrome.                 |
| `safari`         | `boolean`        | Whether the browser is Safari.                             |
| `ios`            | `boolean`        | Whether the device is iOS or iPadOS.                       |
| `mac`            | `boolean`        | Whether the platform is macOS (includes iOS).              |
| `windows`        | `boolean`        | Whether the platform is Windows.                           |
| `android`        | `boolean`        | Whether the platform is Android.                           |
| `webkit`         | `boolean`        | Whether the browser uses WebKit.                           |
| `webkit_version` | `number`         | WebKit version number, or 0 if not WebKit.                 |
| `dir`            | `'rtl' \| 'ltr'` | Document text direction.                                   |

### Direction Enum

The `Direction` enum provides constants for directional navigation:

```typescript
import { Direction } from '@type-editor/commons';

function navigate(direction: Direction) {
  if (direction === Direction.Forward) {
    // Move forward
  }
}
```

| Value                | Description                                    |
|----------------------|------------------------------------------------|
| `Direction.Backward` | Backward direction (-1). Also used for Up.     |
| `Direction.Forward`  | Forward direction (1). Also used for Down.     |
| `Direction.Up`       | Upward direction (-1). Same value as Backward. |
| `Direction.Down`     | Downward direction (1). Same value as Forward. |

### Key Codes

Constants for keyboard event handling:

```typescript
import { 
  ENTER_KEY_CODE, 
  KEY_BACKSPACE, 
  KEY_ARROW_LEFT 
} from '@type-editor/commons';

element.addEventListener('keydown', (e) => {
  if (e.key === KEY_BACKSPACE) {
    // Handle backspace
  }
});
```

#### Key Code Constants (numeric)

| Constant               | Value | Description               |
|------------------------|-------|---------------------------|
| `BACKSPACE_KEY_CODE`   | `8`   | Backspace key code.       |
| `ENTER_KEY_CODE`       | `13`  | Enter key code.           |
| `SHIFT_KEY_CODE`       | `16`  | Shift key code.           |
| `INSERT_KEY_CODE`      | `45`  | Insert key code.          |
| `DELETE_KEY_CODE`      | `46`  | Delete key code.          |
| `COMPOSITION_KEY_CODE` | `229` | IME composition key code. |

#### Key Constants (string)

| Constant          | Value          | Description                |
|-------------------|----------------|----------------------------|
| `KEY_CONTROL`     | `'Control'`    | Control modifier key.      |
| `KEY_META`        | `'Meta'`       | Meta/Command modifier key. |
| `KEY_ALT`         | `'Alt'`        | Alt/Option modifier key.   |
| `KEY_SHIFT`       | `'Shift'`      | Shift modifier key.        |
| `KEY_BACKSPACE`   | `'Backspace'`  | Backspace key.             |
| `KEY_DELETE`      | `'Delete'`     | Delete key.                |
| `KEY_INSERT`      | `'Insert'`     | Insert key.                |
| `KEY_ENTER`       | `'Enter'`      | Enter key.                 |
| `KEY_ESCAPE`      | `'Escape'`     | Escape key.                |
| `KEY_ARROW_LEFT`  | `'ArrowLeft'`  | Left arrow key.            |
| `KEY_ARROW_RIGHT` | `'ArrowRight'` | Right arrow key.           |
| `KEY_ARROW_UP`    | `'ArrowUp'`    | Up arrow key.              |
| `KEY_ARROW_DOWN`  | `'ArrowDown'`  | Down arrow key.            |

### DOM Node Type Constants

Constants for DOM node type checking:

```typescript
import { ELEMENT_NODE, TEXT_NODE } from '@type-editor/commons';

if (node.nodeType === ELEMENT_NODE) {
  // Handle element node
} else if (node.nodeType === TEXT_NODE) {
  // Handle text node
}
```

| Constant                 | Value | Description                  |
|--------------------------|-------|------------------------------|
| `ELEMENT_NODE`           | `1`   | Element node type.           |
| `TEXT_NODE`              | `3`   | Text node type.              |
| `DOCUMENT_NODE`          | `9`   | Document node type.          |
| `DOCUMENT_FRAGMENT_NODE` | `11`  | Document fragment node type. |

### OrderedMap

A persistent data structure representing an ordered mapping from strings to values:

```typescript
import { OrderedMap } from '@type-editor/commons';

// Create from object
const map = OrderedMap.from({ a: 1, b: 2, c: 3 });

// Access values
console.log(map.get('a')); // 1
console.log(map.size); // 3

// Update (returns new map)
const updated = map.update('a', 10);

// Remove (returns new map)
const removed = map.remove('b');

// Iterate
map.forEach((key, value) => {
  console.log(key, value);
});
```

#### Static Methods

| Method                   | Description                                                        |
|--------------------------|--------------------------------------------------------------------|
| `OrderedMap.from(value)` | Creates an OrderedMap from an object, null, or another OrderedMap. |

#### Instance Properties

| Property | Type     | Description                               |
|----------|----------|-------------------------------------------|
| `size`   | `number` | The number of key-value pairs in the map. |

#### Instance Methods

| Method                         | Description                                                         |
|--------------------------------|---------------------------------------------------------------------|
| `get(key)`                     | Returns the value for the given key, or `undefined`.                |
| `find(key)`                    | Returns the index of the key, or `-1` if not found.                 |
| `update(key, value, newKey?)`  | Returns a new map with the key updated. Optionally renames the key. |
| `remove(key)`                  | Returns a new map with the key removed.                             |
| `addToStart(key, value)`       | Returns a new map with the key-value pair added at the start.       |
| `addToEnd(key, value)`         | Returns a new map with the key-value pair added at the end.         |
| `addBefore(place, key, value)` | Returns a new map with the key-value pair added before `place`.     |
| `forEach(fn)`                  | Calls `fn(key, value)` for each entry in order.                     |
| `prepend(map)`                 | Returns a new map with entries from `map` prepended.                |
| `append(map)`                  | Returns a new map with entries from `map` appended.                 |
| `subtract(map)`                | Returns a new map with entries present in `map` removed.            |
| `toObject()`                   | Converts the map to a plain JavaScript object.                      |

### Utility Functions

General-purpose utility functions:

```typescript
import { 
  isUndefinedOrNull, 
  isTrue, 
  hasOwnProperty 
} from '@type-editor/commons';

if (isUndefinedOrNull(value)) {
  // Handle null/undefined
}

if (hasOwnProperty(obj, 'key')) {
  // Safe property access
}
```

| Function                      | Description                                                                 |
|-------------------------------|-----------------------------------------------------------------------------|
| `isUndefinedOrNull(value)`    | Returns `true` if the value is `null` or `undefined`.                       |
| `isTrue(value)`               | Returns `true` if the string value is `'true'` or `'1'` (case-insensitive). |
| `isNotFalse(value)`           | Returns `true` if the value is not explicitly `false`.                      |
| `isFalse(value)`              | Returns `true` if the value is explicitly `false`.                          |
| `hasOwnProperty(object, key)` | Safely checks if an object has an own property.                             |

## License

MIT


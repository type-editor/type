# @type-editor/search

A refactored version of ProseMirror's [prosemirror-search](https://github.com/ProseMirror/prosemirror-search) module, providing search and replace functionality for rich text editors.

## Installation

```bash
npm install @type-editor/search
```

## Overview

This module provides a comprehensive search and replace API for ProseMirror-based editors. It includes:

- A **search plugin** that manages search state and highlights matches
- A **SearchQuery** class for defining search parameters (literal, regex, case-sensitive, whole-word)
- **Commands** for navigating between matches and performing replacements

### Styling

When using this module, you should either load the provided CSS file or define your own styles:

```css
/* Import the provided styles */
@import '@type-editor/search/style/search.css';

/* Or define your own */
.ProseMirror-search-match {
  background-color: #ffff0054;
}
.ProseMirror-active-search-match {
  background-color: #ff6a0054;
}
```

## Usage

### Basic Setup

```typescript
import { searchPlugin, SearchQuery, findNext, findPrev, replaceNext, replaceAll } from '@type-editor/search';
import { keymap } from '@type-editor/keymap';
import { EditorState } from '@type-editor/state';

const state = EditorState.create({
  schema,
  plugins: [
    searchPlugin(),
    keymap({
      'Mod-f': openSearchDialog, // Your custom handler
      'F3': findNext,
      'Shift-F3': findPrev
    })
  ]
});
```

### Configuration Options

The `searchPlugin()` function accepts an optional configuration object:

```typescript
searchPlugin({
  initialQuery: new SearchQuery({ search: 'hello' }),
  initialRange: { from: 0, to: 100 }
});
```

| Option         | Type                           | Description                                                |
|----------------|--------------------------------|------------------------------------------------------------|
| `initialQuery` | `SearchQuery`                  | The initial search query to use when the plugin is created |
| `initialRange` | `{ from: number, to: number }` | Optional range to limit the initial search scope           |

### Creating a Search Query

```typescript
import { SearchQuery } from '@type-editor/search';

// Simple text search
const simpleQuery = new SearchQuery({ search: 'hello' });

// Case-sensitive search
const caseSensitiveQuery = new SearchQuery({
  search: 'Hello',
  caseSensitive: true
});

// Regular expression search
const regexQuery = new SearchQuery({
  search: '\\bword\\b',
  regexp: true
});

// Search and replace
const replaceQuery = new SearchQuery({
  search: 'old',
  replace: 'new'
});

// Whole word matching
const wholeWordQuery = new SearchQuery({
  search: 'the',
  wholeWord: true
});

// Regex search with capture groups
const captureQuery = new SearchQuery({
  search: '(\\w+)@(\\w+)',
  regexp: true,
  replace: '$2:$1'  // Swap the groups
});
```

### SearchQuery Configuration

| Option          | Type       | Default    | Description                                                                    |
|-----------------|------------|------------|--------------------------------------------------------------------------------|
| `search`        | `string`   | (required) | The search string or regular expression pattern                                |
| `caseSensitive` | `boolean`  | `false`    | Whether the search should be case-sensitive                                    |
| `literal`       | `boolean`  | `false`    | When false, `\n`, `\r`, and `\t` are replaced with their character equivalents |
| `regexp`        | `boolean`  | `false`    | When true, interpret the search string as a regular expression                 |
| `replace`       | `string`   | `''`       | The replacement text (supports `$1`, `$&` etc. for regex)                      |
| `wholeWord`     | `boolean`  | `false`    | When true, only match whole words                                              |
| `filter`        | `function` | `null`     | Optional filter to exclude certain results                                     |

### Updating the Search State

To update the search state after the plugin is initialized, you can dispatch a transaction with metadata:

```typescript
import { searchPlugin, SearchQuery } from '@type-editor/search';

// Create a new query and update via plugin key
const newQuery = new SearchQuery({ search: 'new search term' });

// The plugin listens for metadata updates on the search plugin key
// See the search-plugin-key module for advanced usage
```

## Commands

### Find Commands

| Command          | Description                                                                                     |
|------------------|-------------------------------------------------------------------------------------------------|
| `findNext`       | Find the next match after the current selection and move to it. Wraps around at the end.        |
| `findPrev`       | Find the previous match before the current selection and move to it. Wraps around at the start. |
| `findNextNoWrap` | Find the next match without wrapping at document/range end.                                     |
| `findPrevNoWrap` | Find the previous match without wrapping at document/range start.                               |

### Replace Commands

| Command             | Description                                                                                       |
|---------------------|---------------------------------------------------------------------------------------------------|
| `replaceNext`       | Replace the current match and move to the next one, or select the next match if none is selected. |
| `replaceNextNoWrap` | Replace the next match without wrapping at document end.                                          |
| `replaceCurrent`    | Replace the currently selected match and keep it selected.                                        |
| `replaceAll`        | Replace all matches in the document or search range.                                              |

### Example: Search Dialog Integration

```typescript
import {
  searchPlugin,
  SearchQuery,
  findNext,
  findPrev,
  replaceNext,
  replaceAll
} from '@type-editor/search';

// The search plugin manages state internally
// Use the provided commands to navigate and replace

function handleFindNext(view) {
  findNext(view.state, view.dispatch);
}

function handleFindPrev(view) {
  findPrev(view.state, view.dispatch);
}

function handleReplaceAll(view) {
  replaceAll(view.state, view.dispatch);
}
```

## SearchQuery API

### Properties

| Property        | Type      | Description                                            |
|-----------------|-----------|--------------------------------------------------------|
| `search`        | `string`  | The search string or pattern                           |
| `caseSensitive` | `boolean` | Whether the search is case-sensitive                   |
| `valid`         | `boolean` | Whether the query is non-empty and syntactically valid |

### Methods

| Method                           | Returns        | Description                                     |
|----------------------------------|----------------|-------------------------------------------------|
| `eq(other)`                      | `boolean`      | Compare this query to another query             |
| `findNext(state, from?, to?)`    | `SearchResult` | Find the next occurrence in the given range     |
| `findPrev(state, from?, to?)`    | `SearchResult` | Find the previous occurrence in the given range |
| `getReplacements(state, result)` | `Array`        | Get the replacement ranges for a search result  |

## SearchResult Interface

When a match is found, it returns a `SearchResult` object:

```typescript
interface SearchResult {
  from: number;    // Start position of the match
  to: number;      // End position of the match
  match: RegExpMatchArray | null;  // The regex match array (only for regex queries)
}
```

## API Reference

### Exports

| Export              | Type       | Description                                       |
|---------------------|------------|---------------------------------------------------|
| `searchPlugin`      | `function` | Creates the search plugin                         |
| `search`            | `function` | Alias for `searchPlugin` (backward compatibility) |
| `SearchQuery`       | `class`    | Class for defining search parameters              |
| `findNext`          | `Command`  | Find next match with wrap                         |
| `findPrev`          | `Command`  | Find previous match with wrap                     |
| `findNextNoWrap`    | `Command`  | Find next match without wrap                      |
| `findPrevNoWrap`    | `Command`  | Find previous match without wrap                  |
| `replaceNext`       | `Command`  | Replace current and find next                     |
| `replaceNextNoWrap` | `Command`  | Replace next without wrap                         |
| `replaceCurrent`    | `Command`  | Replace current match                             |
| `replaceAll`        | `Command`  | Replace all matches                               |
| `SearchResult`      | `type`     | Interface for search match results                |

## License

MIT

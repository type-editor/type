[**Type Editor**](../../README.md)

---

[Type Editor](../../index.md) / @type-editor/changeset

# @type-editor/changeset

A refactored version of ProseMirror's [prosemirror-changeset](https://github.com/ProseMirror/prosemirror-changeset) module, providing tools for tracking and comparing document changes over time.

## Installation

```bash
npm install @type-editor/changeset
```

## Overview

This module provides utilities for tracking changes to a document from a given point in the past. It condenses step maps down to a flat sequence of replacements and simplifies replacements that partially undo themselves by comparing their content.

The `ChangeSet` maintains two coordinate systems:

- **A coordinates**: Positions in the original (starting) document
- **B coordinates**: Positions in the current (modified) document

## Use Cases

- **Track Changes**: Visualize insertions and deletions in collaborative editing
- **Change History**: Build "diff view" features showing document modifications
- **Attribution**: Track which users made which changes when combined with metadata

## Core Classes

### ChangeSet

The main class for tracking document changes. A `ChangeSet` collects and simplifies a sequence of document modifications, making it easy to visualize what changed between two document states.

```typescript
import { ChangeSet } from "@type-editor/changeset";

// Create a changeset from a starting document
const changeSet = ChangeSet.create(startDoc);

// Add steps as document changes occur
const updated = changeSet.addSteps(newDoc, stepMaps, metadata);

// Access the tracked changes
for (const change of updated.changes) {
  console.log(
    `Replaced ${change.fromA}-${change.toA} with content at ${change.fromB}-${change.toB}`,
  );
}
```

#### Methods

| Method                                 | Description                                                         |
| -------------------------------------- | ------------------------------------------------------------------- |
| `create(doc, combine?, tokenEncoder?)` | Creates a new changeset tracking from the given document.           |
| `addSteps(doc, stepMaps, data?)`       | Computes a new changeset by adding step maps and optional metadata. |
| `changes`                              | The array of changes tracked from the starting document.            |
| `startDoc`                             | The starting document that changes are tracked relative to.         |

### Change

Represents a change between two document versions. A `Change` tracks a replaced range in the document, including both what was deleted from the old version and what was inserted in the new version.

```typescript
interface Change<Data> {
  fromA: number; // Start position in old document
  toA: number; // End position in old document
  fromB: number; // Start position in new document
  toB: number; // End position in new document
  deleted: ReadonlyArray<Span<Data>>; // Metadata spans for deleted content
  inserted: ReadonlyArray<Span<Data>>; // Metadata spans for inserted content
}
```

#### Methods

| Method                              | Description                                                            |
| ----------------------------------- | ---------------------------------------------------------------------- |
| `fromJSON(json)`                    | Static method that deserializes a Change from its JSON representation. |
| `toJSON()`                          | Serializes this Change to a JSON-compatible representation.            |
| `slice(startA, endA, startB, endB)` | Creates a sub-change by slicing ranges from both coordinate systems.   |

#### Serialization Example

```typescript
import { Change } from "@type-editor/changeset";

// Serialize a change to JSON
const json = change.toJSON();

// Deserialize a change from JSON
const restored = Change.fromJSON(json);
```

### Span

Stores metadata for a part of a change. A `Span` represents a contiguous range in a document with associated metadata.

```typescript
import { Span } from "@type-editor/changeset";

const span = new Span(10, { author: "user1" });
console.log(span.length); // 10
console.log(span.data); // { author: 'user1' }
```

## Utility Functions

### computeDiff

Computes the difference between two document fragments using Myers' diff algorithm.

```typescript
import { computeDiff } from "@type-editor/changeset";

const changes = computeDiff(fragmentA, fragmentB, range);
```

### simplifyChanges

Simplifies a set of changes for presentation by expanding insertions and deletions to word boundaries.

```typescript
import { simplifyChanges } from "@type-editor/changeset";

const simplified = simplifyChanges(changes, document);
```

## Token Encoder

A `TokenEncoder` can be provided when creating a `ChangeSet` to influence how the diffing algorithm compares document content. The default encoder compares nodes by name and text by character, ignoring marks and attributes.

```typescript
import type { TokenEncoder } from "@type-editor/changeset";

const customEncoder: TokenEncoder<string> = {
  encodeCharacter: (char, marks) => String.fromCharCode(char),
  encodeNodeStart: (node) => node.type.name,
  encodeNodeEnd: (node) => `/${node.type.name}`,
  compareTokens: (a, b) => a === b,
};

const changeSet = ChangeSet.create(doc, combine, customEncoder);
```

### TokenEncoder Interface

| Method                         | Description                                         |
| ------------------------------ | --------------------------------------------------- |
| `encodeCharacter(char, marks)` | Encode a character with its applied marks.          |
| `encodeNodeStart(node)`        | Encode the start of a node or the entire leaf node. |
| `encodeNodeEnd(node)`          | Encode the end token for a node.                    |
| `compareTokens(a, b)`          | Compare two encoded tokens for equality.            |

## License

MIT

## Modules

<table>
<thead>
<tr>
<th>Module</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[Change](Change/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[ChangeSet](ChangeSet/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[compute-diff](compute-diff/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[default-encoder](default-encoder/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[max-simplify-distance](max-simplify-distance/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[myers-diff/run-myers-diff](myers-diff/run-myers-diff/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[simplify-changes](simplify-changes/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[simplify-changes/expand-to-word-boundaries](simplify-changes/expand-to-word-boundaries/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[simplify-changes/fill-change](simplify-changes/fill-change/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[simplify-changes/get-text](simplify-changes/get-text/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[simplify-changes/has-word-boundary](simplify-changes/has-word-boundary/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[simplify-changes/is-letter](simplify-changes/is-letter/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[simplify-changes/simplify-adjacent-changes](simplify-changes/simplify-adjacent-changes/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[Span](Span/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[tokenizer/tokenize-block-node](tokenizer/tokenize-block-node/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[tokenizer/tokenize-fragment](tokenizer/tokenize-fragment/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[tokenizer/tokenize-textNode](tokenizer/tokenize-textNode/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/ChangeJSON](types/ChangeJSON/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/ChangeSetConfig](types/ChangeSetConfig/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/TokenEncoder](types/TokenEncoder/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/TrimmedRange](types/TrimmedRange/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>

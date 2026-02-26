[**Type Editor**](../../README.md)

---

[Type Editor](../../index.md) / @type-editor/transform

# @type-editor/transform

This is a refactored version of the [prosemirror-transform](https://github.com/ProseMirror/prosemirror-transform) module.

This module implements document transformations, which are used by the
editor to treat changes as first-class values that can be saved, shared,
and reasoned about.

## Installation

```bash
npm install @type-editor/transform
```

## Overview

The transform module defines a way of modifying documents that allows changes
to be recorded, replayed, and reordered. Transformations happen in atomic units
called "steps", which can be applied, inverted, and mapped between document versions.

This is essential for:

- **Undo/Redo history** - Steps can be inverted to undo changes
- **Collaborative editing** - Steps can be rebased and merged
- **Change tracking** - All modifications are recorded as discrete operations

## Steps

Transforming happens in `Step`s, which are atomic, well-defined
modifications to a document. Applying a step produces a new document.

Each step provides a change map that maps positions in the old document
to positions in the transformed document. Steps can be inverted to create
a step that undoes their effect, and chained together in a convenience
object called a `Transform`.

@Step
@StepResult

### Step Types

The module provides several built-in step types:

@ReplaceStep
@ReplaceAroundStep
@AddMarkStep
@RemoveMarkStep
@AddNodeMarkStep
@RemoveNodeMarkStep
@AttrStep
@DocAttrStep

## Position Mapping

Mapping positions from one document to another by running through the
step maps produced by steps is an important operation. It is used, for
example, for updating the selection when the document changes.

## Document Transforms

Because you often need to collect a number of steps together to effect
a composite change, the module provides the `Transform` abstraction to
make this easy. State transactions are a subclass of transforms.

### Transform Methods

The `Transform` class provides methods for common document modifications:

- **Content replacement**: `replace`, `replaceWith`, `delete`, `insert`
- **Mark operations**: `addMark`, `removeMark`, `addNodeMark`, `removeNodeMark`
- **Block changes**: `setBlockType`, `setNodeMarkup`, `split`, `join`, `wrap`, `lift`
- **Attribute changes**: `setNodeAttribute`, `setDocAttribute`

## Helper Functions

The following helper functions can be useful when creating transformations
or determining whether they are even possible.

@replaceStep
@liftTarget
@findWrapping
@canSplit
@canJoin
@joinPoint
@insertPoint
@dropPoint

## Usage Example

```typescript
import {
  Transform,
  ReplaceStep,
  StepMap,
  Mapping,
} from "@type-editor/transform";
import { Node, Slice } from "@type-editor/model";

// Create a transform from a document
const tr = new Transform(doc);

// Apply changes using the fluent API
tr.delete(0, 5)
  .insertText("Hello", 0)
  .addMark(0, 5, schema.marks.bold.create());

// Check if document changed
if (tr.docChanged) {
  const newDoc = tr.doc;
  const steps = tr.steps;
  const mapping = tr.mapping;
}

// Map positions through changes
const newPos = tr.mapping.map(originalPos);
```

## API Reference

### Transform

The main class for building document transformations:

```typescript
class Transform {
  doc: PmNode; // The current (transformed) document
  steps: Step[]; // All applied steps
  docs: PmNode[]; // Document state before each step
  mapping: Mapping; // Combined position mapping
  before: PmNode; // The starting document
  docChanged: boolean; // Whether any steps were applied

  step(step: Step): this; // Apply a step (throws on failure)
  maybeStep(step: Step): StepResult; // Apply a step (returns result)
}
```

### Step

The base class for all atomic document changes:

```typescript
abstract class Step {
  apply(doc: PmNode): StepResult;   // Apply to a document
  invert(doc: PmNode): Step;        // Create inverse step
  map(mapping: Mappable): Step | null; // Map through position changes
  getMap(): StepMap;                // Get the position map
  toJSON(): object;                 // Serialize to JSON

  static fromJSON(schema, json): Step; // Deserialize from JSON
  static registerStep(id, class): void; // Register custom step type
}
```

### StepMap

Maps positions through a single step's changes:

```typescript
class StepMap {
  map(pos: number, assoc?: number): number;
  mapResult(pos: number, assoc?: number): MapResult;
  invert(): StepMap;

  static empty: StepMap; // Empty (no-op) map
  static offset(n: number): StepMap; // Offset all positions
}
```

### Mapping

A pipeline of step maps for multi-step transformations:

```typescript
class Mapping {
  maps: StepMap[]; // The step maps in sequence

  map(pos: number, assoc?: number): number;
  mapResult(pos: number, assoc?: number): MapResult;
  appendMap(map: StepMap, mirrors?: number): void;
  appendMapping(mapping: Mapping): void;
  slice(from?: number, to?: number): Mapping;
}
```

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

[block-changes/join](block-changes/join/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[block-changes/lift](block-changes/lift/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[block-changes/lift-target](block-changes/lift-target/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[block-changes/set-block-type](block-changes/set-block-type/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[block-changes/set-node-markup](block-changes/set-node-markup/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[block-changes/split](block-changes/split/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[block-changes/util](block-changes/util/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[block-changes/wrap](block-changes/wrap/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-helper/can-join](change-helper/can-join/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-helper/can-split](change-helper/can-split/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-helper/drop-point](change-helper/drop-point/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-helper/find-wrapping](change-helper/find-wrapping/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-helper/insert-point](change-helper/insert-point/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-helper/join-point](change-helper/join-point/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-helper/util](change-helper/util/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-map/DeletionInfo](change-map/DeletionInfo/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-map/Mapping](change-map/Mapping/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-map/PmMapResult](change-map/PmMapResult/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-map/StepMap](change-map/StepMap/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-steps/AbstractReplaceStep](change-steps/AbstractReplaceStep/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-steps/AddMarkStep](change-steps/AddMarkStep/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-steps/AddNodeMarkStep](change-steps/AddNodeMarkStep/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-steps/AttrStep](change-steps/AttrStep/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-steps/DocAttrStep](change-steps/DocAttrStep/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-steps/MarkStepFactory](change-steps/MarkStepFactory/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-steps/RemoveMarkStep](change-steps/RemoveMarkStep/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-steps/RemoveNodeMarkStep](change-steps/RemoveNodeMarkStep/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-steps/ReplaceAroundStep](change-steps/ReplaceAroundStep/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-steps/ReplaceStep](change-steps/ReplaceStep/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-steps/Step](change-steps/Step/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[change-steps/StepResult](change-steps/StepResult/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[mark-changes/add-mark](mark-changes/add-mark/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[mark-changes/remove-mark](mark-changes/remove-mark/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[replace/delete-range](replace/delete-range/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[replace/replace-range](replace/replace-range/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[replace/replace-range-with](replace/replace-range-with/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[replace/replace-step](replace/replace-step/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[replace/util](replace/util/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[Transform](Transform/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/json/AttrStepJson](types/json/AttrStepJson/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/json/ReplaceAroundStepJSON](types/json/ReplaceAroundStepJSON/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/json/ReplaceStepJSON](types/json/ReplaceStepJSON/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>

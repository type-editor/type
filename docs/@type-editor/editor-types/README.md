[**Type Editor**](../../README.md)

---

[Type Editor](../../index.md) / @type-editor/editor-types

# @type-editor/editor-types

Common TypeScript type definitions for the Type Editor.

This module provides shared interfaces, types, and enums used across the Type Editor packages. It defines the core contracts that other modules implement, enabling better separation of concerns and avoiding circular dependencies between packages.

## Installation

```bash
npm install @type-editor/editor-types
```

## Overview

This package exports type definitions organized into three main categories:

### State Types

Type definitions related to editor state management:

- **Editor State**: `PmEditorState`, `EditorStateConfig`, `EditorStateDto`, `StateJSON`
- **Transactions**: `PmTransaction`
- **Plugins**: `PmPlugin`, `PmPluginKey`, `PluginSpec`, `PluginView`, `StateField`
- **Selection**: `PmSelection`, `PmSelectionRange`, `SelectionBookmark`, `SelectionJSON`

### Transform Types

Type definitions for document transformations:

- **Mapping**: `Mappable`, `MapResult`, `PmMapping`
- **Steps**: `PmStep`, `PmStepMap`, `PmStepResult`, `StepJSON`
- **Document**: `TransformDocument`
- **Attributes**: `AttrValue`

### View Types

Type definitions for the editor view layer:

- **Editor View**: `PmEditorView`, `DirectEditorProps`, `EditorProps`, `NodeViewSet`
- **DOM**: `DOMSelectionRange`, `DOMEventMap`, `PmDOMObserver`
- **Decorations**: `PmDecoration`, `DecorationSource`, `DecorationSpec`, `DecorationType`, `DecorationWidgetOptions`, `InlineDecorationOptions`, `NodeDecorationOptions`
- **Node Views**: `NodeView`, `NodeViewConstructor`, `MarkView`, `MarkViewConstructor`, `PmViewDesc`, `PmNodeViewDesc`, `ViewMutationRecord`
- **Input Handling**: `PmInputState`, `PmDragging`, `PmMouseDown`
- **Selection State**: `PmSelectionState`

### Enums

- **ViewDescType**: Enum for view descriptor types (`VIEW`, `NODE`, `MARK`, `COMPOSITION`, `TEXT`, `WIDGET`, `CUSTOM`, `TRAILING_HACK`)
- **ViewDirtyState**: Enum for tracking view dirty states (`NOT_DIRTY`, `CHILD_DIRTY`, `CONTENT_DIRTY`, `NODE_DIRTY`)

## Usage

```typescript
import type {
  PmEditorState,
  PmEditorView,
  PmTransaction,
  PmPlugin,
  NodeView,
} from "@type-editor/editor-types";

import { ViewDescType, ViewDirtyState } from "@type-editor/editor-types";

// Use types for function signatures
function handleTransaction(
  view: PmEditorView,
  tr: PmTransaction,
): PmEditorState {
  return view.state.apply(tr);
}

// Use enums for comparisons
if (dirtyState === ViewDirtyState.NODE_DIRTY) {
  // Recreate the entire node
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

[@types](@types/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/state/command/Command](types/state/command/Command/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/state/command/DispatchFunction](types/state/command/DispatchFunction/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/state/editor-state/EditorStateConfig](types/state/editor-state/EditorStateConfig/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/state/editor-state/EditorStateDto](types/state/editor-state/EditorStateDto/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/state/editor-state/PmEditorState](types/state/editor-state/PmEditorState/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/state/editor-state/StateJSON](types/state/editor-state/StateJSON/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/state/plugin/PluginSpec](types/state/plugin/PluginSpec/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/state/plugin/PluginView](types/state/plugin/PluginView/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/state/plugin/PmPlugin](types/state/plugin/PmPlugin/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/state/plugin/PmPluginKey](types/state/plugin/PmPluginKey/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/state/plugin/StateField](types/state/plugin/StateField/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/state/PmTransaction](types/state/PmTransaction/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/state/selection/PmSelection](types/state/selection/PmSelection/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/state/selection/PmSelectionRange](types/state/selection/PmSelectionRange/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/state/selection/SelectionBookmark](types/state/selection/SelectionBookmark/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/state/selection/SelectionJSON](types/state/selection/SelectionJSON/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/transform/AttrValue](types/transform/AttrValue/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/transform/Mappable](types/transform/Mappable/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/transform/MapResult](types/transform/MapResult/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/transform/PmMapping](types/transform/PmMapping/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/transform/PmStep](types/transform/PmStep/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/transform/PmStepMap](types/transform/PmStepMap/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/transform/PmStepResult](types/transform/PmStepResult/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/transform/StepJSON](types/transform/StepJSON/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/transform/TransformDocument](types/transform/TransformDocument/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/decoration/DecorationSource](types/view/decoration/DecorationSource/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/decoration/DecorationSpec](types/view/decoration/DecorationSpec/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/decoration/DecorationType](types/view/decoration/DecorationType/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/decoration/DecorationWidgetOptions](types/view/decoration/DecorationWidgetOptions/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/decoration/InlineDecorationOptions](types/view/decoration/InlineDecorationOptions/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/decoration/NodeDecorationOptions](types/view/decoration/NodeDecorationOptions/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/decoration/PmDecoration](types/view/decoration/PmDecoration/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/dom/DOMSelectionRange](types/view/dom/DOMSelectionRange/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/editor-view/DirectEditorProps](types/view/editor-view/DirectEditorProps/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/editor-view/DOMEventMap](types/view/editor-view/DOMEventMap/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/editor-view/EditorProps](types/view/editor-view/EditorProps/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/editor-view/NodeViewSet](types/view/editor-view/NodeViewSet/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/input-handler/PmDragging](types/view/input-handler/PmDragging/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/input-handler/PmInputState](types/view/input-handler/PmInputState/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/input-handler/PmMouseDown](types/view/input-handler/PmMouseDown/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/PmDOMObserver](types/view/PmDOMObserver/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/PmEditorView](types/view/PmEditorView/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/PmSelectionState](types/view/PmSelectionState/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/view-desc/MarkView](types/view/view-desc/MarkView/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/view-desc/MarkViewConstructor](types/view/view-desc/MarkViewConstructor/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/view-desc/NodeView](types/view/view-desc/NodeView/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/view-desc/NodeViewConstructor](types/view/view-desc/NodeViewConstructor/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/view-desc/PmNodeViewDesc](types/view/view-desc/PmNodeViewDesc/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/view-desc/PmViewDesc](types/view/view-desc/PmViewDesc/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/view/view-desc/ViewMutationRecord](types/view/view-desc/ViewMutationRecord/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[view/ViewDescType](view/ViewDescType/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[view/ViewDirtyState](view/ViewDirtyState/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>

[**Type Editor**](../../README.md)

---

[Type Editor](../../index.md) / @type-editor/commands

# @type-editor/commands

A refactored version of ProseMirror's [prosemirror-commands](https://github.com/ProseMirror/prosemirror-commands) module, providing a comprehensive collection of editing commands for rich text editors.

## Installation

```bash
npm install @type-editor/commands
```

## Overview

This module provides a set of command functions that implement common editing operations. Commands follow the standard signature:

```typescript
type Command = (
  state: EditorState,
  dispatch?: DispatchFunction,
  view?: EditorView,
) => boolean;
```

Commands return `true` if they can be applied, and `false` otherwise. When called without a `dispatch` function, they simply check whether the command is applicable without making any changes.

## Commands

### Selection Commands

| Command                      | Description                                                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `selectAll`                  | Selects the entire document content. Typically bound to `Mod-a`.                                                                       |
| `selectParentNode`           | Expands selection to encompass the parent node containing the current selection. Useful for progressively expanding selection outward. |
| `selectTextblockStart`       | Moves cursor to the start of the current textblock. Useful for "Home" key behavior.                                                    |
| `selectTextblockEnd`         | Moves cursor to the end of the current textblock. Useful for "End" key behavior.                                                       |
| `selectNodeBackward`         | Selects the node before the cursor when at the start of a textblock. Fallback for Backspace when joining fails.                        |
| `selectNodeForward`          | Selects the node after the cursor when at the end of a textblock. Fallback for Delete when joining fails.                              |
| `selectHorizontallyBackward` | Handles left arrow key behavior including node selection at boundaries.                                                                |
| `selectHorizontallyForward`  | Handles right arrow key behavior including node selection at boundaries.                                                               |
| `selectVerticallyUp`         | Handles up arrow key behavior for block-level selections.                                                                              |
| `selectVerticallyDown`       | Handles down arrow key behavior for block-level selections.                                                                            |

### Deletion Commands

| Command           | Description                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| `deleteSelection` | Deletes the current selection if one exists. Returns `false` for empty selections.                         |
| `backspace`       | Default command for the Backspace key. Chains `deleteSelection`, `joinBackward`, and `selectNodeBackward`. |
| `del`             | Default command for the Delete key. Chains `deleteSelection`, `joinForward`, and `selectNodeForward`.      |

### Join Commands

| Command                 | Description                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `joinBackward`          | Joins or merges the current block with the one before it. Implements comprehensive backward-joining with multiple fallback strategies. |
| `joinForward`           | Joins or merges the current block with the one after it. Forward counterpart to `joinBackward`.                                        |
| `joinUp`                | Joins the selected block with the block above it. Typically bound to `Alt-ArrowUp`.                                                    |
| `joinDown`              | Joins the selected block with the block below it. Typically bound to `Alt-ArrowDown`.                                                  |
| `joinTextblockBackward` | Specifically joins textblocks, navigating through nested structures. Stricter than `joinBackward`.                                     |
| `joinTextblockForward`  | Specifically joins textblocks, navigating through nested structures. Stricter than `joinForward`.                                      |

### Block Manipulation Commands

| Command                          | Description                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| `splitBlock`                     | Splits the parent block at the selection. Typically bound to Enter.                              |
| `splitBlockKeepMarks`            | Splits a block while preserving active marks for continued formatting.                           |
| `splitBlockAs(splitNode?)`       | Factory function to create custom block splitting commands with control over the new block type. |
| `lift`                           | Lifts the selected block out of its parent node (e.g., removes from list, unwraps blockquote).   |
| `liftEmptyBlock`                 | Lifts an empty textblock out of its parent, with intelligent split/lift behavior.                |
| `createParagraphNear`            | Creates an empty paragraph before or after a selected block node.                                |
| `wrapIn(nodeType, attrs?)`       | Creates a command that wraps the selection in a given node type (e.g., blockquote, list).        |
| `setBlockType(nodeType, attrs?)` | Creates a command that converts selected textblocks to a given type (e.g., heading, paragraph).  |

### Code Block Commands

| Command         | Description                                                                                        |
| --------------- | -------------------------------------------------------------------------------------------------- |
| `newlineInCode` | Inserts a literal newline character inside code blocks. Essential for code formatting.             |
| `exitCode`      | Creates a default block after a code block and moves the cursor there. Allows exiting code blocks. |

### Mark Commands

| Command                                  | Description                                                                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `toggleMark(markType, attrs?, options?)` | Creates a command that toggles a mark (bold, italic, etc.) on the selection. Handles both cursor and range selections. |
| `clearTextFormatting`                    | Removes common text formatting marks (strong, em, underline, link) from the current selection.                         |

### Link Commands

| Command                                                 | Description                                                                                                                  |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `autoLink(keyType, linkMarkType?, codeNodeType?)`       | Automatically converts URLs to clickable links when Enter or Space is pressed. Detects URLs and wraps them with a link mark. |
| `autoDeleteLink(keyType, linkMarkType?, fileLinkType?)` | Removes link marks from the current selection or cursor position. Extends selection to cover entire linked text if needed.   |

### Attribute Commands

| Command                                       | Description                                                                                                                                    |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `setAttribute(attributeName, attribute, ...)` | Sets an attribute on nodes within the current selection. Supports parent mode (outermost ancestor) or selection mode (all nodes in selection). |

### Insert Commands

| Command                     | Description                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `insertHardBreak(nodeType)` | Creates a command that inserts a hard break (line break) at the current selection. |

### Toggle Commands

| Command                                                           | Description                                                                                                               |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `toggleBlockType(nodeType, unwrapNodeType, attrs?, allowUnwrap?)` | Toggles between two block types. Converts to `unwrapNodeType` if already in `nodeType`, otherwise converts to `nodeType`. |
| `toggleWrapIn(nodeType, attrs?, allowUnwrap?)`                    | Toggles wrapping of selected content in the given node type. Lifts (unwraps) if already inside, otherwise wraps.          |

### Zoom Commands

| Command     | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| `zoomIn`    | Zooms in the editor view by 10%, up to a maximum of 200%.   |
| `zoomOut`   | Zooms out the editor view by 10%, down to a minimum of 10%. |
| `zoomReset` | Resets the editor view zoom to 100%.                        |

### Utility Commands

| Command                                                          | Description                                                                                                  |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `chainCommands(...commands)`                                     | Combines multiple commands into one that tries each in sequence until one succeeds.                          |
| `chainCommandsExectuteAll(...commands)`                          | Combines multiple commands into one that executes all commands regardless of their return value.             |
| `autoJoin(command, isJoinable)`                                  | Wraps a command to automatically join adjacent nodes when they become joinable.                              |
| `findExtendedMarkSelection(doc, $cursor, markType, onlyNumbers)` | Finds an extended selection for an empty selection based on mark type. Extends to cover entire marked range. |
| `isCodeBlock(state, codeNodeType?)`                              | Checks if the current selection is within a code block.                                                      |

### Browser Integration Commands

| Command                              | Description                                                             |
| ------------------------------------ | ----------------------------------------------------------------------- |
| `stopNativeHorizontalDeleteBackward` | Prevents native browser delete behavior for non-text nodes (Backspace). |
| `stopNativeHorizontalDeleteForward`  | Prevents native browser delete behavior for non-text nodes (Delete).    |
| `skipIgnoredNodesBefore`             | Ensures cursor isn't positioned after ignored/zero-size nodes.          |
| `skipIgnoredNodesAfter`              | Ensures cursor isn't positioned before ignored/zero-size nodes.         |

## Usage Examples

### Basic Keymap Setup

```typescript
import {
  backspace,
  del,
  joinUp,
  joinDown,
  lift,
  selectAll,
  selectParentNode,
  splitBlockKeepMarks,
  newlineInCode,
  exitCode,
  liftEmptyBlock,
  chainCommands,
} from "@type-editor/commands";

const keymap = {
  Backspace: backspace,
  Delete: del,
  "Mod-a": selectAll,
  Escape: selectParentNode,
  "Alt-ArrowUp": joinUp,
  "Alt-ArrowDown": joinDown,
  "Mod-[": lift,
  Enter: chainCommands(
    newlineInCode,
    exitCode,
    liftEmptyBlock,
    splitBlockKeepMarks,
  ),
};
```

### Formatting Commands

```typescript
import { toggleMark, setBlockType, wrapIn } from "@type-editor/commands";

// Create mark toggle commands
const toggleBold = toggleMark(schema.marks.strong);
const toggleItalic = toggleMark(schema.marks.em);

// Create block type commands
const makeH1 = setBlockType(schema.nodes.heading, { level: 1 });
const makeParagraph = setBlockType(schema.nodes.paragraph);

// Create wrapping commands
const wrapInBlockquote = wrapIn(schema.nodes.blockquote);
const wrapInBulletList = wrapIn(schema.nodes.bullet_list);
```

### Custom Command Chaining

```typescript
import {
  chainCommands,
  deleteSelection,
  joinBackward,
  selectNodeBackward,
} from "@type-editor/commands";

// Create custom backspace behavior
const customBackspace = chainCommands(
  deleteSelection,
  joinBackward,
  selectNodeBackward,
);
```

### Auto-joining Nodes

```typescript
import { autoJoin, wrapIn } from "@type-editor/commands";

// Wrap in list with auto-join for adjacent lists
const wrapInList = autoJoin(wrapIn(schema.nodes.bullet_list), [
  "bullet_list",
  "ordered_list",
]);
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

[auto-delete-link](auto-delete-link/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[auto-join](auto-join/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[auto-link](auto-link/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[backspace](backspace/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[clear-text-formatting](clear-text-formatting/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[create-paragraph-near](create-paragraph-near/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[del](del/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[delete-selection](delete-selection/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[exit-code](exit-code/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[insert-hard-break](insert-hard-break/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[join-backward](join-backward/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[join-down](join-down/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[join-forward](join-forward/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[join-list-item-backward](join-list-item-backward/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[join-textblock-backward](join-textblock-backward/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[join-textblock-forward](join-textblock-forward/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[join-up](join-up/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[lift](lift/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[lift-empty-block](lift-empty-block/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[newline-in-code](newline-in-code/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[select-all](select-all/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[select-horizontally](select-horizontally/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[select-node-backward](select-node-backward/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[select-node-forward](select-node-forward/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[select-parent-node](select-parent-node/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[select-textblock](select-textblock/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[select-vertically](select-vertically/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[set-attribute](set-attribute/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[set-block-type](set-block-type/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[skip-ignored-nodes](skip-ignored-nodes/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[split-block](split-block/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[split-block-keep-marks](split-block-keep-marks/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[stop-native-horizontal-delete](stop-native-horizontal-delete/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[toggle-block-type](toggle-block-type/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[toggle-mark](toggle-mark/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[toggle-wrap-in](toggle-wrap-in/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/SplitInfo](types/SplitInfo/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/ToggleMarkOptions](types/ToggleMarkOptions/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[util/apply-selection](util/apply-selection/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[util/chain-commands](util/chain-commands/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[util/find-extended-mark-selection](util/find-extended-mark-selection/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[util/helpers](util/helpers/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[util/is-code-block](util/is-code-block/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[util/move-selection-block](util/move-selection-block/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[wrap-in](wrap-in/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[zoom](zoom/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>

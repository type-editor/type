[**Type Editor**](../../README.md)

---

[Type Editor](../../index.md) / @type-editor/inputrules

# @type-editor/inputrules

A refactored version of ProseMirror's [prosemirror-inputrules](https://github.com/ProseMirror/prosemirror-inputrules) module, providing a plugin for defining input rules that react to or transform text typed by the user.

## Installation

```bash
npm install @type-editor/inputrules
```

## Overview

This module defines a plugin for attaching _input rules_ to an editor. Input rules are regular expressions describing text patterns that, when typed, trigger automatic transformations. This enables features like:

- Converting `--` into an em dash (`—`)
- Transforming `...` into an ellipsis (`…`)
- Smart quote substitution
- Wrapping paragraphs starting with `> ` into blockquotes
- Converting lines starting with `# ` into headings

## Core API

### InputRule Class

The `InputRule` class represents a single input rule that matches a regex pattern and applies a transformation.

```typescript
import { InputRule } from "@type-editor/inputrules";

const myRule = new InputRule(
  /pattern$/, // RegExp - must end with $
  "replacement", // string or handler function
  { undoable: true }, // optional configuration
);
```

#### Constructor Parameters

| Parameter | Type                         | Description                                             |
| --------- | ---------------------------- | ------------------------------------------------------- |
| `match`   | `RegExp`                     | Pattern to match against typed text. Must end with `$`. |
| `handler` | `string \| InputRuleHandler` | Replacement string or handler function.                 |
| `options` | `InputRuleOptions`           | Optional configuration object.                          |

#### InputRuleOptions

| Option       | Type                | Default | Description                                                                                                        |
| ------------ | ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| `undoable`   | `boolean`           | `true`  | When `false`, the `undoInputRule` command won't work on this rule.                                                 |
| `inCode`     | `boolean \| 'only'` | `false` | Controls behavior in code nodes. `false`: won't apply; `true`: applies everywhere; `'only'`: only applies in code. |
| `inCodeMark` | `boolean`           | `true`  | Controls whether the rule applies inside code marks.                                                               |

#### InputRuleHandler

A handler function receives the editor state and match information:

```typescript
type InputRuleHandler = (
  state: EditorState,
  match: RegExpMatchArray,
  start: number,
  end: number,
) => Transaction | null;
```

### inputRulesPlugin

Creates a plugin that enables input rule matching and application.

```typescript
import { inputRulesPlugin } from "@type-editor/inputrules";

const plugin = inputRulesPlugin({
  rules: [rule1, rule2, rule3],
});
```

Also exported as `inputRules` for compatibility.

## Built-in Rules

### Text Replacement Rules

| Rule       | Pattern | Replacement | Description                                     |
| ---------- | ------- | ----------- | ----------------------------------------------- |
| `emDash`   | `--`    | `—`         | Converts two dashes into an em dash.            |
| `ellipsis` | `...`   | `…`         | Converts three dots into an ellipsis character. |

### Smart Quote Rules

| Rule               | Description                                           |
| ------------------ | ----------------------------------------------------- |
| `openDoubleQuote`  | Inserts `"` (left double quote) in opening contexts.  |
| `closeDoubleQuote` | Inserts `"` (right double quote) in closing contexts. |
| `openSingleQuote`  | Inserts `'` (left single quote) in opening contexts.  |
| `closeSingleQuote` | Inserts `'` (right single quote) in closing contexts. |
| `smartQuotes`      | Array containing all four smart quote rules.          |

Smart quote rules detect context automatically—they insert opening quotes after whitespace or opening punctuation, and closing quotes elsewhere.

## Utility Functions

### wrappingInputRule

Creates an input rule that wraps a textblock in a given node type.

```typescript
import { wrappingInputRule } from "@type-editor/inputrules";

// Wrap lines starting with "> " in a blockquote
const blockQuoteRule = wrappingInputRule(/^>\s$/, schema.nodes.blockquote);

// With computed attributes
const listRule = wrappingInputRule(
  /^(\d+)\.\s$/,
  schema.nodes.ordered_list,
  (match) => ({ order: +match[1] }),
);

// With join predicate
const bulletRule = wrappingInputRule(
  /^\s*([-+*])\s$/,
  schema.nodes.bullet_list,
  null,
  (match, node) => node.childCount > 0,
);
```

#### Parameters

| Parameter       | Type                          | Description                                             |
| --------------- | ----------------------------- | ------------------------------------------------------- |
| `regexp`        | `RegExp`                      | Pattern to match (typically starts with `^`).           |
| `nodeType`      | `NodeType`                    | The node type to wrap in.                               |
| `getAttrs`      | `Attrs \| ((match) => Attrs)` | Attributes for the wrapper node.                        |
| `joinPredicate` | `(match, node) => boolean`    | Whether to join with an adjacent node of the same type. |

### textblockTypeInputRule

Creates an input rule that changes the type of a textblock.

```typescript
import { textblockTypeInputRule } from "@type-editor/inputrules";

// Convert lines starting with "# " to h1
const headingRule = textblockTypeInputRule(/^#\s$/, schema.nodes.heading, {
  level: 1,
});

// With computed attributes for multiple heading levels
const headingRules = [1, 2, 3, 4, 5, 6].map((level) =>
  textblockTypeInputRule(new RegExp(`^#{${level}}\\s$`), schema.nodes.heading, {
    level,
  }),
);
```

#### Parameters

| Parameter  | Type                          | Description                                   |
| ---------- | ----------------------------- | --------------------------------------------- |
| `regexp`   | `RegExp`                      | Pattern to match (typically starts with `^`). |
| `nodeType` | `NodeType`                    | The new node type for the textblock.          |
| `getAttrs` | `Attrs \| ((match) => Attrs)` | Attributes for the new node.                  |

## Commands

### undoInputRule

A command that undoes the last input rule application, if any.

```typescript
import { undoInputRule } from "@type-editor/inputrules";

// Use in a keymap
const keymap = {
  Backspace: undoInputRule,
};
```

This allows users to press Backspace immediately after an input rule fires to revert the transformation.

## Usage Example

````typescript
import {
  inputRulesPlugin,
  emDash,
  ellipsis,
  smartQuotes,
  wrappingInputRule,
  textblockTypeInputRule,
} from "@type-editor/inputrules";
import { schema } from "./my-schema";

// Create custom rules for your schema
const blockquoteRule = wrappingInputRule(/^>\s$/, schema.nodes.blockquote);
const codeBlockRule = textblockTypeInputRule(/^```$/, schema.nodes.code_block);
const headingRule = textblockTypeInputRule(
  /^(#{1,6})\s$/,
  schema.nodes.heading,
  (match) => ({ level: match[1].length }),
);

// Combine all rules into a plugin
const plugin = inputRulesPlugin({
  rules: [
    emDash,
    ellipsis,
    ...smartQuotes,
    blockquoteRule,
    codeBlockRule,
    headingRule,
  ],
});

// Add the plugin to your editor state
````

## Exported Types

| Type                   | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `InputRuleHandler`     | Function signature for custom input rule handlers. |
| `InputRuleOptions`     | Configuration options for `InputRule` constructor. |
| `InputRulesPluginSpec` | Plugin specification interface.                    |
| `PluginState`          | Internal plugin state type.                        |

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

[builder/input-rules-plugin](builder/input-rules-plugin/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[builder/textblock-type-input-rule](builder/textblock-type-input-rule/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[builder/wrapping-input-rule](builder/wrapping-input-rule/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/close-double-quote](commands/close-double-quote/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/close-single-quote](commands/close-single-quote/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/ellipsis](commands/ellipsis/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/em-dash](commands/em-dash/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/open-double-quote](commands/open-double-quote/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/open-single-quote](commands/open-single-quote/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/smart-quotes](commands/smart-quotes/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[commands/undo-input-rule](commands/undo-input-rule/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[InputRule](InputRule/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/InputRuleHandler](types/InputRuleHandler/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/InputRuleOptions](types/InputRuleOptions/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/InputRulesPluginSpec](types/InputRulesPluginSpec/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

[types/PluginState](types/PluginState/README.md)

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>

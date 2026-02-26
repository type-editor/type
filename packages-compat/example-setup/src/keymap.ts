import type { MarkType, NodeType } from '@type-editor/model';
import { liftListItem, sinkListItem, splitListItem, wrapInList } from '@type-editor/schema';
import {
    chainCommands,
    type Command,
    exitCode,
    joinDown,
    joinUp,
    lift,
    selectParentNode,
    setBlockType,
    toggleMark,
    wrapIn,
} from '@type-editor-compat/commands';
import { redo, undo } from '@type-editor-compat/history';
import { undoInputRule } from '@type-editor-compat/inputrules';
import type { CompatNodeTypeInstance, Schema } from '@type-editor-compat/model';

const mac = typeof navigator !== 'undefined' ? /Mac|iP(hone|[oa]d)/.test(navigator.userAgent) : false;

// Inspect the given schema looking for marks and nodes from the
// basic schema, and if found, add key bindings related to them.
// This will add:
//
// * **Mod-b** for toggling [strong](#schema-basic.StrongMark)
// * **Mod-i** for toggling [emphasis](#schema-basic.EmMark)
// * **Mod-`** for toggling [code font](#schema-basic.CodeMark)
// * **Ctrl-Shift-0** for making the current textblock a paragraph
// * **Ctrl-Shift-1** to **Ctrl-Shift-Digit6** for making the current
//   textblock a heading of the corresponding level
// * **Ctrl-Shift-Backslash** to make the current textblock a code block
// * **Ctrl-Shift-8** to wrap the selection in an ordered list
// * **Ctrl-Shift-9** to wrap the selection in a bullet list
// * **Ctrl->** to wrap the selection in a block quote
// * **Enter** to split a non-empty textblock in a list item while at
//   the same time splitting the list item
// * **Mod-Enter** to insert a hard break
// * **Mod-_** to insert a horizontal rule
// * **Backspace** to undo an input rule
// * **Alt-ArrowUp** to `joinUp`
// * **Alt-ArrowDown** to `joinDown`
// * **Mod-BracketLeft** to `lift`
// * **Escape** to `selectParentNode`
//
// You can suppress or map these bindings by passing a `mapKeys`
// argument, which maps key names (say `"Mod-B"` to either `false`, to
// remove the binding, or a new key name string.
export function buildKeymap(schema: Schema, mapKeys?: Record<string, false | string>) {
  const keys: Record<string, Command> = {};
  function bind(key: string, cmd: Command) {
    if (mapKeys) {
      const mapped = mapKeys[key];
      if (mapped === false) {return;}
      if (mapped) {key = mapped;}
    }
    keys[key] = cmd;
  }

  bind('Mod-z', undo);
  bind('Shift-Mod-z', redo);
  bind('Backspace', undoInputRule);
  if (!mac) {bind('Mod-y', redo);}

  bind('Alt-ArrowUp', joinUp);
  bind('Alt-ArrowDown', joinDown);
  bind('Mod-BracketLeft', lift);
  bind('Escape', selectParentNode);

  const strongMark: MarkType | undefined = schema.marks.strong;
  if (strongMark) {
    bind('Mod-b', toggleMark(strongMark));
    bind('Mod-B', toggleMark(strongMark));
  }
  const emMark: MarkType | undefined = schema.marks.em;
  if (emMark) {
    bind('Mod-i', toggleMark(emMark));
    bind('Mod-I', toggleMark(emMark));
  }
  const codeMark: MarkType | undefined = schema.marks.code;
  if (codeMark) {
    bind('Mod-`', toggleMark(codeMark));
  }

  const bulletList: CompatNodeTypeInstance | undefined = schema.nodes.bullet_list;
  if (bulletList) {
    bind('Shift-Ctrl-8', wrapInList(bulletList as unknown as NodeType) as unknown as Command);
  }
  const orderedList: CompatNodeTypeInstance | undefined = schema.nodes.ordered_list;
  if (orderedList) {
    bind('Shift-Ctrl-9', wrapInList(orderedList as unknown as NodeType) as unknown as Command);
  }
  const blockquote: CompatNodeTypeInstance | undefined = schema.nodes.blockquote;
  if (blockquote) {
    bind('Ctrl->', wrapIn(blockquote));
  }
  const hardBreak: CompatNodeTypeInstance | undefined = schema.nodes.hard_break;
  if (hardBreak) {
    const cmd = chainCommands(exitCode, (state, dispatch) => {
      if (dispatch) {dispatch(state.tr.replaceSelectionWith(hardBreak.create()).scrollIntoView());}
      return true;
    });
    bind('Mod-Enter', cmd);
    bind('Shift-Enter', cmd);
    if (mac) {bind('Ctrl-Enter', cmd);}
  }
  const listItem: CompatNodeTypeInstance | undefined = schema.nodes.list_item;
  if (listItem) {
    bind('Enter', splitListItem(listItem as unknown as NodeType) as unknown as Command);
    bind('Mod-[', liftListItem(listItem as unknown as NodeType) as unknown as Command);
    bind('Mod-]', sinkListItem(listItem as unknown as NodeType) as unknown as Command);
  }
  const paragraph: CompatNodeTypeInstance | undefined = schema.nodes.paragraph;
  if (paragraph) {
    bind('Shift-Ctrl-0', setBlockType(paragraph));
  }
  const codeBlock: CompatNodeTypeInstance | undefined = schema.nodes.code_block;
  if (codeBlock) {
    bind('Shift-Ctrl-\\', setBlockType(codeBlock));
  }
  const heading: CompatNodeTypeInstance | undefined = schema.nodes.heading;
  if (heading) {
    for (let i = 1; i <= 6; i++) {bind(`Shift-Ctrl-${i}`, setBlockType(heading, {level: i}));}
  }
  const horizontalRule: CompatNodeTypeInstance | undefined = schema.nodes.horizontal_rule;
  if (horizontalRule) {
    bind('Mod-_', (state, dispatch) => {
      if (dispatch) {dispatch(state.tr.replaceSelectionWith(horizontalRule.create()).scrollIntoView());}
      return true;
    });
  }

  return keys;
}

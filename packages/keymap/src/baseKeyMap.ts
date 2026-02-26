/**
 * A basic keymap containing bindings not specific to any schema.
 * Binds the following keys (when multiple commands are listed, they
 * are chained with [`chainCommands`](#commands.chainCommands)):
 *
 * * **Enter** to `newlineInCode`, `createParagraphNear`, `liftEmptyBlock`, `splitBlock`
 * * **Mod-Enter** to `exitCode`
 * * **Backspace** and **Mod-Backspace** to `deleteSelection`, `joinBackward`, `selectNodeBackward`
 * * **Delete** and **Mod-Delete** to `deleteSelection`, `joinForward`, `selectNodeForward`
 * * **Mod-Delete** to `deleteSelection`, `joinForward`, `selectNodeForward`
 * * **Mod-a** to `selectAll`
 */
import {
    autoDeleteLink,
    autoLink,
    backspace,
    chainCommands,
    clearTextFormatting,
    createParagraphNear,
    del,
    exitCode,
    insertHardBreak,
    liftEmptyBlock,
    newlineInCode,
    selectAll,
    selectHorizontallyBackward,
    selectHorizontallyForward,
    selectTextblockEnd,
    selectTextblockStart,
    selectVerticallyDown,
    selectVerticallyUp,
    setBlockType,
    skipIgnoredNodesAfter,
    splitBlock,
    toggleMark,
    wrapIn,
    zoomIn,
    zoomOut,
    zoomReset,
} from '@type-editor/commands';
import { browser } from '@type-editor/commons';
import type { Command } from '@type-editor/editor-types';
import { redo, undo } from '@type-editor/history';
import { liftListItem, schema, sinkListItem, splitListItem, wrapInList } from '@type-editor/schema';

export const pcBaseKeymap: Record<string, Command> = {

    // Space for auto-linking
    'Space': autoLink('Space'),

    // Bold, Italic, ...
    'Meta-b': toggleMark(schema.marks.strong),
    'Meta-i': toggleMark(schema.marks.em),
    'Meta-u': toggleMark(schema.marks.underline),
    'Meta-s': toggleMark(schema.marks.strikethrough),
    'Meta-h': toggleMark(schema.marks.highlight),

    // Subscript, superscript
    'Meta-,': toggleMark(schema.marks.subscript),
    'Meta-.': toggleMark(schema.marks.superscript),

    // Alignment
    'Meta-Shift-l': setBlockType(schema.nodes.paragraph, { textAlign: 'left' }),
    'Meta-shift-e': setBlockType(schema.nodes.paragraph, { textAlign: 'center' }),
    'Meta-shift-r': setBlockType(schema.nodes.paragraph, { textAlign: 'right' }),
    'Meta-Shift-j': setBlockType(schema.nodes.paragraph, { textAlign: 'justify' }),

    // Clear text format
    'Meta-Alt-0': clearTextFormatting,

    // Headings
    'Meta-Alt-1': setBlockType(schema.nodes.heading, {level: 1}),
    'Meta-Alt-2': setBlockType(schema.nodes.heading, {level: 2}),
    'Meta-Alt-3': setBlockType(schema.nodes.heading, {level: 3}),
    'Meta-Alt-4': setBlockType(schema.nodes.heading, {level: 4}),
    'Meta-Alt-5': setBlockType(schema.nodes.heading, {level: 5}),
    'Meta-Alt-6': setBlockType(schema.nodes.heading, {level: 6}),

    // List
    'Meta-Shift-7': wrapInList(schema.nodes.ordered_list),
    'Meta-Shift-8': wrapInList(schema.nodes.bullet_list),

    // Quote
    'Meta-Shift-b': wrapIn(schema.nodes.blockquote),

    // Code
    'Meta-e': toggleMark(schema.marks.code),
    'Meta-Alt-c': setBlockType(schema.nodes.code_block),

    // Undo / Redo
    // Undo / Redo
    'Meta-z': undo,
    'Shift-Meta-z': redo,
    
    'Enter': chainCommands(autoLink('Enter'), splitListItem(schema.nodes.list_item), newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock),
    'Mod-Enter': chainCommands(exitCode, insertHardBreak(schema.nodes.hard_break)),
    'Shift-Enter': chainCommands(exitCode, insertHardBreak(schema.nodes.hard_break)),
    'Backspace': chainCommands(autoDeleteLink('Backspace'), backspace),
    'Mod-Backspace': backspace,
    'Shift-Backspace': backspace,
    'Delete': chainCommands(autoDeleteLink('Delete'), del),
    'Mod-Delete': del,
    'Mod-a': selectAll,
    'Tab': sinkListItem(schema.nodes.list_item),
    'Shift-Tab': liftListItem(schema.nodes.list_item),
    'ArrowLeft': selectHorizontallyBackward,
    'ArrowRight': selectHorizontallyForward,
    'ArrowUp': selectVerticallyUp,
    'ArrowDown': chainCommands(selectVerticallyDown, skipIgnoredNodesAfter),

    'Mod-+': zoomIn,
    'Mod--': zoomOut,
    'Mod-0': zoomReset,
};

/**
 * A copy of `pcBaseKeymap` that also binds **Ctrl-h** like Backspace,
 * **Ctrl-d** like Delete, **Alt-Backspace** like Ctrl-Backspace, and
 * **Ctrl-Alt-Backspace**, **Alt-Delete**, and **Alt-d** like
 * Ctrl-Delete.
 */
export const macBaseKeymap: Record<string, Command> = {
    ...{
        'Ctrl-h': pcBaseKeymap.Backspace,
        'Alt-Backspace': pcBaseKeymap['Mod-Backspace'],
        'Ctrl-d': pcBaseKeymap.Delete,
        'Ctrl-Alt-Backspace': pcBaseKeymap['Mod-Delete'],
        'Alt-Delete': pcBaseKeymap['Mod-Delete'],
        'Alt-d': pcBaseKeymap['Mod-Delete'],
        'Ctrl-a': selectTextblockStart,
        'Ctrl-e': selectTextblockEnd
    },
    ...pcBaseKeymap
};

export const baseKeymap: Record<string, Command> = browser.mac ? macBaseKeymap : pcBaseKeymap;

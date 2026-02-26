import { dropCursor } from '@type-editor/dropcursor';
import type { PmPlugin } from '@type-editor/editor-types';
import { gapCursor } from '@type-editor/gapcursor';
import { history } from '@type-editor/history';
import { baseKeymap, keymap } from '@type-editor/keymap';

import { createMenu } from './create-menu';


export const defaultPlugins: Array<PmPlugin> = [
    // Standard menu bar
    createMenu(),
    // Shortcuts for bold, italic, etc. and some helper commands e.g. for lists
    // You can customize keymap by creating your own and replacing this one
    keymap(baseKeymap),
    // Undo/redo history
    history(),
    // Cursor that is shown when dragging content. The styling can be changed with CSS.
    // CSS classes:
    // .prosemirror-dropcursor-block,
    // .prosemirror-dropcursor-inline
    // or set a custom class name as specified below
    dropCursor({ class: 'pm-dropcursor', color: false }),
    gapCursor(),
];

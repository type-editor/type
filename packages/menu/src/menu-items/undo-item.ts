import type {PmEditorState} from '@type-editor/editor-types';
import {undo} from '@type-editor/history';

import {icons} from '../menubar/icons/icons';
import {MenuItem} from '../menubar/MenuItem';

/**
 * Menu item for the `undo` command.
 */
export const undoItem = new MenuItem({

    title: 'Undo',
    label: 'Undo',
    run: undo,
    enable: (state: PmEditorState): boolean => undo(state),
    icon: icons.undo

});

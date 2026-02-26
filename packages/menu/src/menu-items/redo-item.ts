import type {PmEditorState} from '@type-editor/editor-types';
import {redo} from '@type-editor/history';

import {icons} from '../menubar/icons/icons';
import {MenuItem} from '../menubar/MenuItem';

/**
 * Menu item for the `redo` command.
 */
export const redoItem = new MenuItem({

    title: 'Redo',
    label: 'Redo',
    run: redo,
    enable: (state: PmEditorState): boolean => redo(state),
    icon: icons.redo

});

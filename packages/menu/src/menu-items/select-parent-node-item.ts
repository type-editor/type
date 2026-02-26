import {selectParentNode} from '@type-editor/commands';
import type {PmEditorState} from '@type-editor/editor-types';

import {icons} from '../menubar/icons/icons';
import {MenuItem} from '../menubar/MenuItem';

/**
 * Menu item for the `selectParentNode` command.
 */
export const selectParentNodeItem = new MenuItem({

    title: 'Select parent node',
    label: 'Select parent node',
    run: selectParentNode,
    select: (state: PmEditorState): boolean => selectParentNode(state),
    icon: icons.selectParentNode

});

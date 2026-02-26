import { toggleWrapIn } from '@type-editor/commands';
import type { PmEditorState } from '@type-editor/editor-types';
import type { NodeType } from '@type-editor/model';
import { schema } from '@type-editor/schema';
import { isInNodeType } from '@type-editor/util';

import { icons } from '../menubar/icons/icons';
import { MenuItem } from '../menubar/MenuItem';
import { isSelectionLengthInRange } from './util/is-len-in-range';
import { documentIsNotEmpty } from './util/document-is-not-empty';


/**
 * Menu item for the `blockquote` command.
 */
export function blockquoteItem(title = 'Blockquote',
                               nodeType: NodeType = schema.nodes.blockquote): MenuItem {
    return new MenuItem({
        title: title,
        label: title,
        run: toggleWrapIn(nodeType),
        enable: (state: PmEditorState): boolean => documentIsNotEmpty(state) && (isInNodeType(state, nodeType) || isSelectionLengthInRange(state, 10000) && toggleWrapIn(nodeType)(state)),
        active: (state: PmEditorState): boolean => isInNodeType(state, nodeType),
        icon: icons.blockquote,
    });
}

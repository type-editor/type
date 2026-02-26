import { toggleBlockType } from '@type-editor/commands';
import type { PmEditorState } from '@type-editor/editor-types';
import type { NodeType } from '@type-editor/model';
import { schema } from '@type-editor/schema';
import { isInNodeType } from '@type-editor/util';

import { icons } from '../menubar/icons/icons';
import { MenuItem } from '../menubar/MenuItem';
import { documentIsNotEmpty } from './util/document-is-not-empty';
import { isSelectionLengthInRange } from './util/is-len-in-range';

/**
 * Menu item for the `code block` command.
 */
export function codeBlockItem(title = 'Code Block',
                              nodeType: NodeType = schema.nodes.code_block,
                              unwrapNodeType: NodeType = schema.nodes.paragraph): MenuItem {
    return new MenuItem({
        title: title,
        label: title,
        run: toggleBlockType(nodeType, unwrapNodeType),
        enable: (state: PmEditorState): boolean => documentIsNotEmpty(state) && (isInNodeType(state, nodeType) || (isSelectionLengthInRange(state, 10000) && toggleBlockType(nodeType, unwrapNodeType)(state))),
        active: (state: PmEditorState): boolean => isInNodeType(state, nodeType),
        icon: icons.codeBlock,
    });
}

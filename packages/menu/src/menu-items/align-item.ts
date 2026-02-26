import { isCodeBlock, setAttribute } from '@type-editor/commands';
import type { PmEditorState } from '@type-editor/editor-types';
import { type NodeType } from '@type-editor/model';
import { schema } from '@type-editor/schema';

import { icons } from '../menubar/icons/icons';
import { MenuItem } from '../menubar/MenuItem';
import { isNodeActive } from './util/is-node-active';
import { documentIsNotEmpty } from './util/document-is-not-empty';


/**
 * Menu item for the `align` command.
 */
export function alignItem(align: 'left' | 'right' | 'center' | 'justify' = 'left',
                          title = align,
                          codeBlockNodeType: NodeType = schema.nodes.code_block,
                          paragraphType: NodeType = schema.nodes.paragraph,
                          figureType: NodeType = schema.nodes.figure,
                          ulNodeType: NodeType = schema.nodes.bullet_list,
                          olNodeType: NodeType = schema.nodes.ordered_list): MenuItem {
    return new MenuItem({
        title: capitalizeFirstLetter(title),
        label: capitalizeFirstLetter(title),
        run: setAttribute('align', align, ulNodeType, olNodeType),
        enable: (state: PmEditorState): boolean => documentIsNotEmpty(state) && !isCodeBlock(state, codeBlockNodeType),
        active: (state: PmEditorState): boolean => isNodeActive(state, null, {align}, align === 'left', paragraphType, figureType, ulNodeType, olNodeType),
        icon: icons[`align${capitalizeFirstLetter(align)}`],
    });
}


function capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}



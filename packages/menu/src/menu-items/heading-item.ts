import { isCodeBlock, setBlockType } from '@type-editor/commands';
import type { PmEditorState } from '@type-editor/editor-types';
import type { NodeType } from '@type-editor/model';
import { schema } from '@type-editor/schema';
import { isInNodeType } from '@type-editor/util';

import { icons } from '../menubar/icons/icons';
import { MenuItem } from '../menubar/MenuItem';
import { documentIsNotEmpty } from './util/document-is-not-empty';
import { isSelectionLengthInRange } from './util/is-len-in-range';


/**
 * Menu item for the `heading` command.
 */
export function headingItem(level: '1'|'2'|'3'|'4'|'5'|'6' = '1',
                            title = `Heading ${level}`,
                            nodeType: NodeType = schema.nodes.heading,
                            codeBlockNodeType: NodeType = schema.nodes.code_block): MenuItem {
    return new MenuItem({
        title: title,
        label: title,
        run: setBlockType(nodeType, {level}),
        enable: (state: PmEditorState): boolean => documentIsNotEmpty(state) && (isInNodeType(state, nodeType) || (isSelectionLengthInRange(state) && !isCodeBlock(state, codeBlockNodeType) && setBlockType(nodeType, {level})(state))),
        active: (state: PmEditorState): boolean => isInNodeType(state, nodeType, {level}),
        icon: icons[`h${level}`],
    });
}



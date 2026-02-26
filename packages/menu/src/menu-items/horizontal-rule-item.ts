import { isCodeBlock } from '@type-editor/commands';
import type { DispatchFunction, PmEditorState } from '@type-editor/editor-types';
import type { NodeType, ResolvedPos } from '@type-editor/model';
import { schema } from '@type-editor/schema';

import { icons } from '../menubar/icons/icons';
import { MenuItem } from '../menubar/MenuItem';


/**
 * Menu item for the `horizontal rule` command.
 */
export function horizontalRuleItem(title = 'Horizontal Rule',
                                   nodeType: NodeType = schema.nodes.horizontal_rule,
                                   codeBlockNodeType: NodeType = schema.nodes.code_block): MenuItem {
    return new MenuItem({
        title: title,
        label: title,
        run: (state: PmEditorState, dispatch: DispatchFunction): boolean => {
            dispatch(state.transaction.replaceSelectionWith(nodeType.create()));
            return true;
        },
        enable: (state: PmEditorState): boolean => canInsert(state, nodeType, codeBlockNodeType),
        icon: icons.horizontalRule,
    });
}

function canInsert(state: PmEditorState, nodeType: NodeType, codeBlockType: NodeType): boolean {
    const $from: ResolvedPos = state.selection.$from;

    if(!$from.parent.type.spec.content.includes('inline')) {
        return false;
    }

    if(isCodeBlock(state, codeBlockType)) {
        return false;
    }

    for (let d = $from.depth; d >= 0; d--) {
        const index: number = $from.index(d);
        if ($from.node(d).canReplaceWith(index, index, nodeType)) {
            return true;
        }
    }
    return false;
}



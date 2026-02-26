import { lift, setBlockType } from '@type-editor/commands';
import type { DispatchFunction, PmEditorState } from '@type-editor/editor-types';
import type { NodeType } from '@type-editor/model';
import { schema, wrapInList } from '@type-editor/schema';
import { isInNodeType } from '@type-editor/util';

import { icons } from '../menubar/icons/icons';
import { MenuItem } from '../menubar/MenuItem';
import { documentIsNotEmpty } from './util/document-is-not-empty';


/**
 * Menu item for the `paragraph` command.
 */
export function paragraphItem(title = 'Paragraph',
                              nodeType: NodeType = schema.nodes.paragraph,
                              ulNodeType: NodeType = schema.nodes.bullet_list,
                              olNodeType: NodeType = schema.nodes.ordered_list): MenuItem {
    return new MenuItem({
        title: title,
        label: title,
        run: (state: PmEditorState, dispatch: DispatchFunction) => applyParagraphOrUnwrap(state, dispatch, nodeType, ulNodeType, olNodeType),
        enable: (state: PmEditorState): boolean => documentIsNotEmpty(state) && (state.selection.$from.parent.isBlock || setBlockType(nodeType)(state)),
        active: (state: PmEditorState): boolean => isInNodeType(state, nodeType),
        icon: icons.paragraph,
    });
}

function applyParagraphOrUnwrap(state: PmEditorState,
                                dispatch: DispatchFunction,
                                nodeType: NodeType,
                                ulNodeType: NodeType,
                                olNodeType: NodeType): boolean {
    if (setBlockType(nodeType)(state, dispatch)) {
        return true;
    }
    if (lift(state, dispatch)) {
        return true;
    }
    if (wrapInList(ulNodeType, null, true)(state, dispatch)) {
        return true;
    }
    return wrapInList(olNodeType, null, true)(state, dispatch) || false;


}



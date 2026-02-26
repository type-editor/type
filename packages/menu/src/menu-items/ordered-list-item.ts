import type { PmEditorState } from '@type-editor/editor-types';
import type { NodeType } from '@type-editor/model';
import { schema, wrapInList } from '@type-editor/schema';
import { isInNodeType } from '@type-editor/util';

import { icons } from '../menubar/icons/icons';
import { MenuItem } from '../menubar/MenuItem';
import { documentIsNotEmpty } from './util/document-is-not-empty';
import { isInList } from './util/is-in-list';


/**
 * Menu item for the `orderedList` command.
 */
export function orderedListItem(title = 'Numbered List',
                                olNodeType: NodeType = schema.nodes.ordered_list,
                                ulNodeType: NodeType = schema.nodes.bullet_list): MenuItem {
    return new MenuItem({
        title: title,
        label: title,
        run: wrapInList(olNodeType),
        enable: (state: PmEditorState): boolean => documentIsNotEmpty(state) && (isInList(state, ulNodeType, olNodeType) || wrapInList(ulNodeType)(state)),
        active: (state: PmEditorState): boolean => isInNodeType(state, olNodeType),
        icon: icons.orderedList,
    });
}

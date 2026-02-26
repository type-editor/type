import { ONLY_NUMBERS_OPTIONS, toggleMark } from '@type-editor/commands';
import type { PmEditorState } from '@type-editor/editor-types';
import type { MarkType } from '@type-editor/model';
import { schema } from '@type-editor/schema';

import { icons } from '../menubar/icons/icons';
import { MenuItem } from '../menubar/MenuItem';
import { isSelectionLengthInRange } from './util/is-len-in-range';
import { isMarkActive } from './util/is-mark-active';
import { documentIsNotEmpty } from './util/document-is-not-empty';


/**
 * Menu item for the `subscript` command.
 */
export function subscriptItem(title = 'Subscript', markType: MarkType = schema.marks.subscript): MenuItem {
    return new MenuItem({
        title: title,
        label: title,
        run: toggleMark(markType, null, ONLY_NUMBERS_OPTIONS),
        active: (state: PmEditorState): boolean => isMarkActive(state, markType),
        enable: (state: PmEditorState): boolean => documentIsNotEmpty(state) && state.selection.isTextSelection() && isSelectionLengthInRange(state, 20, 0) && toggleMark(markType)(state),
        icon: icons.subscript,
    });
}

import { toggleMark } from '@type-editor/commands';
import type { PmEditorState } from '@type-editor/editor-types';
import type { MarkType } from '@type-editor/model';
import { schema } from '@type-editor/schema';

import { icons } from '../menubar/icons/icons';
import { MenuItem } from '../menubar/MenuItem';
import { isMarkActive } from './util/is-mark-active';
import { documentIsNotEmpty } from './util/document-is-not-empty';


/**
 * Menu item for the `strikethrough` command.
 */
export function strikethroughItem(title = 'Strikethrough', markType: MarkType = schema.marks.strikethrough): MenuItem {
    return new MenuItem({
        title: title,
        label: title,
        run: toggleMark(markType),
        active: (state: PmEditorState): boolean => isMarkActive(state, markType),
        enable: (state: PmEditorState): boolean => documentIsNotEmpty(state) && state.selection.isTextSelection() && toggleMark(markType)(state),
        icon: icons.strikethrough,
    });
}

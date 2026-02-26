import {joinUp} from '@type-editor/commands';
import type {PmEditorState} from '@type-editor/editor-types';

import {icons} from '../menubar/icons/icons';
import {MenuItem} from '../menubar/MenuItem';
import { documentIsNotEmpty } from './util/document-is-not-empty';

/**
 * Menu item for the `joinUp` command.
 */
export const joinUpItem = new MenuItem({

    title: 'Join with above block',
    label: 'Join with above block',
    run: joinUp,
    select: (state: PmEditorState): boolean => documentIsNotEmpty(state) && joinUp(state),
    icon: icons.join

});

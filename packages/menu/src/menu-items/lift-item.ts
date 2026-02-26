import {lift} from '@type-editor/commands';
import type {PmEditorState} from '@type-editor/editor-types';

import {icons} from '../menubar/icons/icons';
import {MenuItem} from '../menubar/MenuItem';


/**
 * Menu item for the `lift` command.
 */
export const liftItem = new MenuItem({

    title: 'Lift out of enclosing block',
    label: 'Lift out of enclosing block',
    run: lift,
    select: (state: PmEditorState): boolean => lift(state),
    icon: icons.lift

});

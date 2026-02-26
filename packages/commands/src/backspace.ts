import type { Command } from '@type-editor/editor-types';

import {deleteSelection} from './delete-selection';
import {joinBackward} from './join-backward';
import {joinListItemBackward} from './join-list-item-backward';
import {selectNodeBackward} from './select-node-backward';
import { chainCommands } from './util/chain-commands';

/**
 * Default command for the backspace key.
 *
 * This command chains together four operations:
 * 1. Delete the selection if one exists
 * 2. If the cursor is at the start of the first paragraph of a list item, merge
 *    that paragraph with the last paragraph of the previous list item (inserting a
 *    space at the boundary) instead of simply joining the two list items as containers
 * 3. Try to join with the block before the cursor
 * 4. Try to select the node before the cursor
 */
export const backspace: Command = chainCommands(deleteSelection, joinListItemBackward, joinBackward, selectNodeBackward);

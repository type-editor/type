import type {Command} from '@type-editor/editor-types';

import {deleteSelection} from './delete-selection';
import {joinForward} from './join-forward';
import {selectNodeForward} from './select-node-forward';
import {chainCommands} from './util/chain-commands';

/**
 * Default command for the delete/forward-delete key.
 *
 * This command chains together three operations:
 * 1. Delete the selection if one exists
 * 2. Try to join with the block after the cursor
 * 3. Try to select the node after the cursor
 *
 * This provides comprehensive forward-delete behavior for most editing scenarios.
 */
export const del: Command = chainCommands(deleteSelection, joinForward, selectNodeForward);

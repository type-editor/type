import type {PmEditorState} from '@type-editor/editor-types';

import type {CollabState} from './CollabState';
import {collabPluginKey} from './plugin-key';


/**
 * Gets the version up to which the collab plugin has synced with the
 * central authority.
 *
 * @param state - The current editor state with the collab plugin enabled.
 * @returns The current version number of the collaborative editing state.
 * @throws Error if the collab plugin is not installed.
 */
export function getVersion(state: PmEditorState): number {
    const collabState = collabPluginKey.getState(state) as CollabState | undefined;
    if (!collabState) {
        throw new Error('Collab plugin not found. Make sure to install it via EditorState.create({plugins: [collab()]})');
    }
    return collabState.version;
}

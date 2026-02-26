import type {PmEditorState} from '@type-editor/editor-types';

import {collabPluginKey} from '../plugin-key';
import type {CollabConfig} from '../types/CollabConfig';

/**
 * Gets the client ID from the collab plugin configuration.
 *
 * @param state - The editor state.
 * @returns The client ID for this editor instance.
 * @throws Error if the collab plugin is not installed.
 */
export function getClientID(state: PmEditorState): string | number {
    const plugin = collabPluginKey.get(state);
    if (!plugin) {
        throw new Error('Collab plugin not found. Make sure to install it via EditorState.create({plugins: [collab()]})');
    }
    const config = (plugin.spec as { config: Required<CollabConfig> }).config;
    return config.clientID;
}

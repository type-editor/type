import type {PmEditorState} from '@type-editor/editor-types';
import type {Transform} from '@type-editor/transform';

import type {CollabState} from './CollabState';
import {collabPluginKey} from './plugin-key';
import type {SendableSteps} from './types/SendableSteps';
import {getClientID} from './util/get-client-id';

/**
 * Provides data describing the editor's unconfirmed steps, which need
 * to be sent to the central authority. Returns null when there is
 * nothing to send.
 *
 * The `origins` property holds the _original_ transforms that produced each
 * step. This can be useful for looking up timestamps and other
 * metadata for the steps, but note that the steps may have been
 * rebased, whereas the origin transforms are still the old,
 * unchanged objects.
 *
 * @param state - The current editor state with the collab plugin enabled.
 * @returns An object containing sendable steps data, or null if there's nothing to send.
 */
export function sendableSteps(state: PmEditorState): SendableSteps | null {
    const collabState = collabPluginKey.getState(state) as CollabState | undefined;
    if (!collabState) {
        throw new Error('Collab plugin not found. Make sure to install it via EditorState.create({plugins: [collab()]})');
    }
    if (collabState.unconfirmed.length === 0) {
        return null;
    }

    return {
        version: collabState.version,
        steps: collabState.unconfirmed.map(s => s.step),
        clientID: getClientID(state),
        get origins() {
            return (this as SendableSteps & { _origins?: ReadonlyArray<Transform> })._origins ??
                ((this as SendableSteps & { _origins?: ReadonlyArray<Transform> })._origins =
                    collabState.unconfirmed.map(s => s.origin));
        }
    };
}

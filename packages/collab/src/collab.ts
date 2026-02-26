import {Plugin, type Transaction} from '@type-editor/state';
import type {Transform} from '@type-editor/transform';

import {CollabState} from './CollabState';
import {collabPluginKey} from './plugin-key';
import {Rebaseable} from './Rebaseable';
import type {CollabConfig} from './types/CollabConfig';


/**
 * Creates a plugin that enables the collaborative editing framework for the editor.
 *
 * This plugin tracks document versions and unconfirmed local changes,
 * enabling synchronization with a central authority for collaborative editing.
 *
 * @param config - Configuration options for the plugin.
 * @param config.version - The starting version number. Defaults to 0.
 * @param config.clientID - This client's unique identifier. Defaults to a random 32-bit number.
 * @returns A ProseMirror plugin that enables collaborative editing.
 */
export function collab(config: CollabConfig = {}): Plugin {
    const conf: Required<CollabConfig> = {
        version: config.version ?? 0,
        clientID: config.clientID ?? Math.floor(Math.random() * 0xFFFFFFFF)
    };

    return new Plugin({
        key: collabPluginKey,

        state: {
            init: (): CollabState => new CollabState(conf.version, []),
            apply(transaction: Transaction, collab: CollabState): CollabState {
                const newState = transaction.getMeta(collabPluginKey) as CollabState | undefined;
                if (newState) {
                    return newState;
                }

                if (transaction.docChanged) {
                    return new CollabState(collab.version, collab.unconfirmed.concat(unconfirmedFrom(transaction)));
                }

                return collab;
            }
        },

        config: conf,

        /**
         * This is used to notify the history plugin to not merge steps,
         * so that the history can be rebased.
         */
        historyPreserveItems: true
    });
}

/**
 * Creates an array of Rebaseable steps from a transform's steps.
 *
 * Each step in the transform is wrapped with its inverted counterpart
 * to allow for rebasing operations.
 *
 * @param transform - The transform containing the steps to wrap.
 * @returns An array of Rebaseable objects representing the steps.
 */
function unconfirmedFrom(transform: Transform): Array<Rebaseable> {
    return transform.steps.map((step, index) =>
        new Rebaseable(step, step.invert(transform.docs[index]), transform)
    );
}

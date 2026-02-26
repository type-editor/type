import type {Transaction} from '@type-editor/state';


/**
 * Internal state stored in the input rules plugin to track the last applied rule
 * for undo functionality.
 */
export type PluginState = {
    transform: Transaction;
    from: number;
    to: number;
    text: string;
} | null;

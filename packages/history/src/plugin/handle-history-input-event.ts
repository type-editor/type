import type {PmEditorView, PmTransaction} from '@type-editor/editor-types';
import type {Command} from '@type-editor/editor-types';

import {redo} from '../commands/redo';
import {undo} from '../commands/undo';


/**
 * Handles browser history input events (undo/redo).
 *
 * @param view - The editor view
 * @param event - The input event from the browser
 * @returns True if the event was handled, false otherwise
 */
export function handleHistoryInputEvent(view: PmEditorView, event: InputEvent): boolean {
    const inputType: string = event.inputType;

    if (inputType !== 'historyUndo' && inputType !== 'historyRedo') {
        return false;
    }

    if (!view.editable) {
        return false;
    }

    const command: Command = inputType === 'historyUndo' ? undo : redo;
    event.preventDefault();
    return command(view.state, (transaction: PmTransaction): void => { view.dispatch(transaction); });
}

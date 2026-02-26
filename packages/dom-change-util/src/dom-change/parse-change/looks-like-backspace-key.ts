import {BACKSPACE_KEY_CODE} from '@type-editor/commons';
import type {PmEditorView} from '@type-editor/editor-types';
import type {Node, ResolvedPos} from '@type-editor/model';

import type {DocumentChange} from '../types/dom-change/DocumentChange';
import {keyEvent} from '../util/key-event';
import {looksLikeBackspace} from './looks-like-backspace';


/**
 * Checks if the change looks like the effect of pressing the Backspace key.
 *
 * Similar to Enter detection, some backspace operations (especially block joins)
 * are better handled through the Backspace key handler. This function detects
 * if a change looks like a backspace operation by checking:
 *
 * - The selection anchor is after the change start (backspacing backwards)
 * - The change matches the backspace pattern (see looksLikeBackspace)
 * - A handleKeyDown plugin accepts the Backspace key event
 *
 * The detailed backspace detection logic is in the looksLikeBackspace function.
 *
 * @param view - The editor view containing selection state and plugin handlers
 * @param doc - The current document (before the change)
 * @param change - The detected document change
 * @param $from - Start position in the parsed (new) document (resolved)
 * @param $to - End position in the parsed (new) document (resolved)
 * @returns True if the change looks like Backspace and a key handler accepted it,
 *          false if the change should be processed as a normal DOM change
 *
 * @see {@link looksLikeBackspace} for detailed backspace detection logic
 */
export function looksLikeBackspaceKey(view: PmEditorView,
                                      doc: Node,
                                      change: DocumentChange,
                                      $from: ResolvedPos,
                                      $to: ResolvedPos): boolean {
    return !!(view.state.selection.anchor > change.start
        && looksLikeBackspace(doc, change.start, change.endA, $from, $to)
        && view.someProp('handleKeyDown', callbackFunc => callbackFunc(view, keyEvent(BACKSPACE_KEY_CODE, 'Backspace'))));
}

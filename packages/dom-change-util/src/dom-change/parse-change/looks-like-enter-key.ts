import {ENTER_KEY_CODE} from '@type-editor/commons';
import type {PmEditorView} from '@type-editor/editor-types';
import type {ResolvedPos} from '@type-editor/model';

import {looksLikesEnterKeyiOS} from '../browser-hacks/looks-likes-enter-key-ios';
import type {ParseBetweenResult} from '../types/dom-change/ParseBetweenResult';
import {keyEvent} from '../util/key-event';


/**
 * Checks if the change looks like the effect of pressing the Enter key.
 *
 * Sometimes it's better to handle block creation through the Enter key handler
 * rather than as a DOM change. This function detects those cases using two
 * different strategies:
 *
 * **iOS Enter Detection:**
 * iOS specifically tracks Enter key presses. If a recent Enter was detected
 * and either the change is not inline or block elements (DIV/P) were added,
 * treat it as an Enter key press.
 *
 * **Generic Block Enter Detection:**
 * For other platforms, detect Enter by checking if:
 * - Change is not inline (block-level)
 * - Positions are within document bounds
 * - Positions are in different parents or not in inline content
 * - Content between positions is whitespace-only (empty paragraph)
 *
 * If detected, the change is delegated to the handleKeyDown plugin system
 * with an Enter key event.
 *
 * @param view - The editor view containing input state and plugin handlers
 * @param parse - Parsed document information from the DOM
 * @param $from - Start position in the parsed document (resolved)
 * @param $to - End position in the parsed document (resolved)
 * @param inlineChange - Whether the change is within inline content (vs block-level)
 * @param addedNodes - Array of DOM nodes that were added during the mutation
 * @returns True if the change looks like Enter and a key handler accepted it,
 *          false if the change should be processed as a normal DOM change
 */
export function looksLikeEnterKey(view: PmEditorView,
                                  parse: ParseBetweenResult,
                                  $from: ResolvedPos,
                                  $to: ResolvedPos,
                                  inlineChange: boolean,
                                  addedNodes: ReadonlyArray<DOMNode>): boolean {
    // iOS Enter key detection
    const isIOSEnter: boolean = looksLikesEnterKeyiOS(view, inlineChange, addedNodes);

    // Generic block-level Enter detection
    const isBlockEnter: boolean = !inlineChange
        && $from.pos < parse.doc.content.size
        && (!$from.sameParent($to) || !$from.parent.inlineContent)
        && $from.pos < $to.pos
        && !/\S/.test(parse.doc.textBetween($from.pos, $to.pos, '', ''));

    return !!((isIOSEnter || isBlockEnter)
        && view.someProp('handleKeyDown', callbackFunc => callbackFunc(view, keyEvent(ENTER_KEY_CODE, 'Enter'))));
}

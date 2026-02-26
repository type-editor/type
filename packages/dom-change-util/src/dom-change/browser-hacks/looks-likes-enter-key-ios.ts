import {browser} from '@type-editor/commons';
import type {PmEditorView} from '@type-editor/editor-types';

import {IOS_ENTER_TIME_THRESHOLD} from '../constants';

/**
 * Checks if the change looks like the effect of pressing the Enter key.
 *
 * Sometimes it's better to handle block creation through the Enter key handler
 * rather than as a DOM change. This function detects those cases for iOS:
 *
 * **iOS Enter Detection:**
 * iOS specifically tracks Enter key presses. If a recent Enter was detected
 * and either the change is not inline or block elements (DIV/P) were added,
 * treat it as an Enter key press.
 *
 * @param view - The editor view containing input state and plugin handlers
 * @param inlineChange - Whether the change is within inline content (vs block-level)
 * @param addedNodes - Array of DOM nodes that were added during the mutation
 * @returns True if the change looks like Enter and a key handler accepted it,
 *          false if the change should be processed as a normal DOM change
 */
export function looksLikesEnterKeyiOS(view: PmEditorView,
                                      inlineChange: boolean,
                                      addedNodes: ReadonlyArray<DOMNode>): boolean {
    // iOS Enter key detection
    return browser.ios
        && view.input.lastIOSEnter > Date.now() - IOS_ENTER_TIME_THRESHOLD
        && (!inlineChange || addedNodes.some((node: DOMNode): boolean => node.nodeName === 'DIV' || node.nodeName === 'P'));
}

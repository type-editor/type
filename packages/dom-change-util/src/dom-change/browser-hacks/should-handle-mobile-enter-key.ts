import {browser,ELEMENT_NODE, ENTER_KEY_CODE} from '@type-editor/commons';
import type {PmEditorView} from '@type-editor/editor-types';

import {IOS_ENTER_TIME_THRESHOLD} from '../constants';
import type {DocumentChange} from '../types/dom-change/DocumentChange';
import {keyEvent} from '../util/key-event';


/**
 * Regular expression matching inline HTML element names.
 * Used to distinguish between inline and block-level elements when
 * detecting Enter key presses on mobile devices.
 */
const INLINE_ELEMENTS_REGEX = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;


/**
 * Checks if a mobile Enter key should be handled instead of processing the DOM change.
 *
 * Mobile browsers (iOS and Android) sometimes handle Enter key presses in ways that
 * are better processed through the key handler than as DOM changes. This function
 * detects such cases by checking:
 *
 * 1. The platform is iOS (with recent Enter) or Android
 * 2. Block-level nodes (DIV, P, etc.) were added to the DOM
 * 3. No content change was detected, or content was deleted
 *
 * When all conditions are met, the Enter key is dispatched through the handleKeyDown
 * plugin system instead of processing the DOM change directly.
 *
 * @param view - The editor view containing input state and plugin handlers
 * @param addedNodes - Nodes that were added to the DOM during the mutation.
 *                     Used to detect if block-level elements were created.
 * @param change - The detected document change, if any. Null if no change detected.
 * @returns True if the Enter key handler was invoked and the event should be
 *          handled that way, false if the DOM change should be processed normally
 *
 * @remarks Uses a regex to detect inline vs block-level HTML elements
 */
export function shouldHandleMobileEnterKey(view: PmEditorView,
                                           addedNodes: ReadonlyArray<DOMNode>,
                                           change: DocumentChange | null): boolean {
    const isMobile = browser.ios && view.input.lastIOSEnter > Date.now() - IOS_ENTER_TIME_THRESHOLD
        || browser.android;

    const hasBlockLevelNodes = addedNodes.some((node: Node) => {
        return node.nodeType === ELEMENT_NODE && !INLINE_ELEMENTS_REGEX.test(node.nodeName);
    });
    const isNoChangeOrDeletion = !change || change.endA >= change.endB;

    return !!(isMobile
        && hasBlockLevelNodes
        && isNoChangeOrDeletion
        && view.someProp('handleKeyDown', callbackFunc => callbackFunc(view, keyEvent(ENTER_KEY_CODE, 'Enter'))));
}

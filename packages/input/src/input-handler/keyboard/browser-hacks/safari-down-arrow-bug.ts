import {browser, ELEMENT_NODE} from '@type-editor/commons';
import type {DOMSelectionRange, PmEditorView} from '@type-editor/editor-types';

/**
 * Workaround for Safari down arrow bug.
 *
 * Issue #867, #1090 / https://bugs.chromium.org/p/chromium/issues/detail?id=903821
 * Safari does incorrect things when down arrow is pressed with cursor at the start
 * of a textblock that has an uneditable node after it. This temporarily makes the
 * node editable to work around the issue.
 *
 * @param view - The EditorView instance
 * @returns Always returns false (doesn't prevent default)
 */
// TODO: Does this issue still exist in latest Safari versions?
export function safariDownArrowBug(view: PmEditorView): boolean {
    if (!browser.safari || view.state.selection.$head.parentOffset > 0) {
        return false;
    }

    const selectionRange: DOMSelectionRange = view.domSelectionRange();
    if (!selectionRange) {
        return false;
    }

    const { focusNode, focusOffset } = selectionRange;

    const firstChild: ChildNode = focusNode?.firstChild;

    if (focusNode?.nodeType === ELEMENT_NODE
        && focusOffset === 0
        && firstChild?.nodeType === ELEMENT_NODE
        && (firstChild as HTMLElement).contentEditable === 'false') {

        const child = firstChild as HTMLElement;
        const WORKAROUND_DELAY = 20; // milliseconds

        toggleContentEditable(view, child, 'true');
        setTimeout(() => {
            toggleContentEditable(view, child, 'false');
        }, WORKAROUND_DELAY);
    }

    return false;
}

/**
 * Safely toggles the contentEditable attribute while pausing the DOM observer.
 *
 * @param view - The EditorView instance
 * @param node - The HTML element to modify
 * @param state - The contentEditable value to set ('true' or 'false')
 */
function toggleContentEditable(view: PmEditorView, node: HTMLElement, state: string): void {
    view.domObserver.stop();
    node.contentEditable = state;
    view.domObserver.start();
}

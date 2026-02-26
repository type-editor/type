import {isEquivalentPosition} from '@type-editor/dom-util';
import type {DOMSelectionRange} from '@type-editor/editor-types';

import type {EditorView} from '../EditorView';


/**
 * Workaround for Safari Selection/shadow DOM bug.
 * Safari (at least in 2018-2022) doesn't provide regular access to the selection
 * inside a shadowRoot, so we use execCommand to trigger a beforeInput event
 * that gives us access to the selection range.
 *
 * Based on https://github.com/codemirror/dev/issues/414 fix.
 *
 * @param view - The editor view
 * @param selection - The native DOM selection object
 * @returns A DOMSelectionRange or null if the selection couldn't be determined
 */
export function safariShadowSelectionRange(view: EditorView, selection: Selection): DOMSelectionRange | null {
    // Try the modern getComposedRanges API first (if available)
    if ('getComposedRanges' in Selection.prototype) {
        const ranges: Array<StaticRange> = selection.getComposedRanges({ shadowRoots: [ view.root as ShadowRoot ] });
        // Check that ranges exists and has at least one element
        if (ranges && ranges.length > 0) {
            const range: StaticRange = ranges[0];
            if (range) {
                return rangeToSelectionRange(view, range);
            }
        }
    }

    // Fall back to the execCommand hack for older Safari versions
    // This is a workaround because Safari doesn't expose shadow DOM selections normally
    let found: StaticRange | undefined;

    function read(event: InputEvent): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        // Capture the target range from the beforeInput event
        found = event.getTargetRanges()[0];
    }

    // Listen for the beforeInput event that execCommand will trigger
    view.dom.addEventListener('beforeinput', read, true);
    // Note: execCommand is deprecated but still necessary for Safari compatibility
    // The 'indent' command is arbitrary - we just need to trigger a beforeInput event
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    document.execCommand('indent');
    view.dom.removeEventListener('beforeinput', read, true);

    return found ? rangeToSelectionRange(view, found) : null;
}


/**
 * Converts a StaticRange to a DOMSelectionRange, applying heuristics to determine
 * the correct anchor and focus positions.
 * @param view - The editor view
 * @param range - The static range to convert
 * @returns A DOMSelectionRange with properly oriented anchor and focus
 */
function rangeToSelectionRange(view: EditorView, range: StaticRange): DOMSelectionRange {
    let anchorNode: Node = range.startContainer;
    let anchorOffset: number = range.startOffset;
    let focusNode: Node = range.endContainer;
    let focusOffset: number = range.endOffset;

    const currentAnchor: { node: Node; offset: number } = view.domAtPos(view.state.selection.anchor);

    // Since such a range doesn't distinguish between anchor and head,
    // use a heuristic that flips it around if its end matches the current anchor.
    if (isEquivalentPosition(currentAnchor.node, currentAnchor.offset, focusNode, focusOffset)) {
        [anchorNode, anchorOffset, focusNode, focusOffset] = [focusNode, focusOffset, anchorNode, anchorOffset];
    }

    return {
        anchorNode,
        anchorOffset,
        focusNode,
        focusOffset
    };
}

import {browser, KEY_BACKSPACE} from '@type-editor/commons';
import type {PmEditorView, PmViewDesc} from '@type-editor/editor-types';


/**
 * Adjusts the toOffset to work around Chrome's backspace bug where it sometimes
 * replaces deleted content with a random BR node (issues #799, #831).
 *
 * Chrome has a quirk where after a backspace operation, it sometimes inserts
 * a stray BR element in the DOM. This function scans backwards from the end
 * of the range looking for such BR nodes that don't have an associated view
 * descriptor (indicating they're not part of the ProseMirror document structure).
 *
 * The function also checks for empty view descriptors (size 0) and stops scanning
 * if it encounters a view descriptor with actual size, as that indicates real content.
 *
 * This workaround is only applied on Chrome and only when the last key pressed
 * was Backspace.
 *
 * @param view - The editor view containing the input state
 * @param parent - The parent DOM node containing the range being parsed
 * @param fromOffset - Start offset (child index) in the parent node
 * @param toOffset - End offset (child index) in the parent node to potentially adjust
 * @returns The adjusted toOffset, which may be reduced if a stray BR was found,
 *          or the original toOffset if no adjustment is needed
 *
 * @see https://github.com/ProseMirror/prosemirror/issues/799
 * @see https://github.com/ProseMirror/prosemirror/issues/831
 */
export function adjustForChromeBackspaceBug(view: PmEditorView,
                                            parent: DOMNode,
                                            fromOffset: number,
                                            toOffset: number): number {
    if(!browser.chrome || view.input.lastKey !== KEY_BACKSPACE) {
        return toOffset;
    }

    // Cache childNodes to avoid repeated NodeList access
    const childNodes = parent.childNodes;

    for (let off = toOffset; off > fromOffset; off--) {
        const childNode: ChildNode = childNodes[off - 1];
        const viewDesc: PmViewDesc = childNode.pmViewDesc;

        if (childNode.nodeName === 'BR' && !viewDesc) {
            return off;
        }

        if (!viewDesc || viewDesc.size) {
            break;
        }
    }

    return toOffset;
}

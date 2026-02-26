import {Fragment, type Node, Slice} from '@type-editor/model';


/**
 * Close a slice's openStart/openEnd to a target start/end.
 *
 * @param slice - The slice to close
 * @param openStart - Target openStart value
 * @param openEnd - Target openEnd value
 * @returns A new slice with the specified open values
 */
export function closeSlice(slice: Slice,
                    openStart: number,
                    openEnd: number): Slice {
    if (openStart < slice.openStart) {
        const fragment: Fragment = closeRange(slice.content, -1, openStart, slice.openStart, 0, slice.openEnd);
        slice = new Slice(fragment, openStart, slice.openEnd);
    }

    if (openEnd < slice.openEnd) {
        const fragment: Fragment = closeRange(slice.content, 1, openEnd, slice.openEnd, 0, 0);
        slice = new Slice(fragment, slice.openStart, openEnd);
    }

    return slice;
}


/**
 * Close a nested range inside a fragment. Used by closeSlice to fill
 * nodes so they become valid according to their content expressions.
 *
 * @param fragment - The fragment to process
 * @param side - Direction indicator: negative for start, positive for end
 * @param from - Starting depth to close from
 * @param to - Ending depth to close to
 * @param depth - Current depth in the recursion
 * @param openEnd - How open the end of the range is
 * @returns A new fragment with the range closed
 */
function closeRange(fragment: Fragment,
                    side: number,
                    from: number,
                    to: number,
                    depth: number,
                    openEnd: number): Fragment {
    const node: Node = side < 0 ? fragment.firstChild : fragment.lastChild;
    if (!node) {return fragment;}

    let inner: Fragment = node.content;

    if (fragment.childCount > 1) {openEnd = 0;}
    if (depth < to - 1) {inner = closeRange(inner, side, from, to, depth + 1, openEnd);}
    if (depth >= from) {
        inner = side < 0
            ? node.contentMatchAt(0).fillBefore(inner, openEnd <= depth).append(inner)
            : inner.append(node.contentMatchAt(node.childCount).fillBefore(Fragment.empty, true));
    }
    return fragment.replaceChild(side < 0 ? 0 : fragment.childCount - 1, node.copy(inner));
}

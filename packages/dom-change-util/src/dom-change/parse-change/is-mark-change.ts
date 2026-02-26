import {Fragment, type Mark, type Node} from '@type-editor/model';

import type {MarkChangeInfo} from '../types/dom-change/MarkChangeInfo';


/**
 * Determines whether one fragment could be created from another by adding or removing
 * a single mark type. Used to optimize mark changes.
 *
 * This is an optimization for detecting when a change is just adding or removing
 * formatting (like bold or italic) without changing the actual text content. When
 * detected, the change can be applied as a mark operation instead of a full content
 * replacement, which is more efficient and maintains better edit history.
 *
 * The detection process:
 * 1. Compares marks on the first child of each fragment
 * 2. Calculates which marks were added and which were removed
 * 3. If exactly one mark was added OR one was removed, it's a mark change
 * 4. Applies the mark operation to all children and verifies it recreates the current fragment
 *
 * Returns null if:
 * - Either fragment is empty
 * - More than one mark changed
 * - Both marks were added and removed
 * - Applying the mark change doesn't recreate the current fragment
 *
 * @param cur - The current (new) fragment after the change
 * @param prev - The previous (old) fragment before the change
 * @returns Mark change information containing the mark and operation type,
 *          or null if this isn't a simple mark change
 *
 * @see {@link MarkChangeInfo} for return type structure
 */
export function isMarkChange(cur: Fragment, prev: Fragment): MarkChangeInfo | null {
    // Guard against empty fragments
    if (cur.childCount === 0 || prev.childCount === 0) {
        return null;
    }

    const curMarks: ReadonlyArray<Mark> = cur.firstChild.marks;
    const prevMarks: ReadonlyArray<Mark> = prev.firstChild.marks;

    // Calculate marks that were added and removed
    let added: ReadonlyArray<Mark> = curMarks;
    let removed: ReadonlyArray<Mark> = prevMarks;

    for (const mark of prevMarks) {
        added = mark.removeFromSet(added);
    }

    for (const mark of curMarks) {
        removed = mark.removeFromSet(removed);
    }

    // Check if exactly one mark was added or removed
    let mark: Mark;
    let type: 'add' | 'remove';
    let update: (node: Node) => Node;

    if (added.length === 1 && removed.length === 0) {
        mark = added[0];
        type = 'add';
        update = (node: Node): Node => node.mark(mark.addToSet(node.marks));
    } else if (added.length === 0 && removed.length === 1) {
        mark = removed[0];
        type = 'remove';
        update = (node: Node): Node => node.mark(mark.removeFromSet(node.marks));
    } else {
        return null;
    }

    // Verify that applying the mark change recreates the current fragment
    const updated: Array<Node> = [];
    for (let i = 0; i < prev.childCount; i++) {
        updated.push(update(prev.child(i)));
    }

    if (Fragment.from(updated).eq(cur)) {
        return { mark, type };
    }

    return null;
}

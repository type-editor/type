import type {PmNode, ResolvedPos} from '@type-editor/model';

import {joinable} from './util';

/**
 * Test whether the blocks before and after a given position can be joined.
 *
 * @param doc The document to check.
 * @param pos The position to check for joining.
 * @returns True if the blocks can be joined, false otherwise.
 */
export function canJoin(doc: PmNode, pos: number): boolean {
    const $pos: ResolvedPos = doc.resolve(pos);
    const index: number = $pos.index();

    // Both nodes must be joinable and the parent must allow the replacement
    return joinable($pos.nodeBefore, $pos.nodeAfter) &&
        $pos.parent.canReplace(index, index + 1);
}

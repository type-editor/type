import { PmNode, ResolvedPos } from '@type-editor/model';

/**
 * Result of a parent node search operation.
 */
export interface FindParentResult {
    /** The resolved position of the found parent node. */
    position: ResolvedPos;
    /** The parent node that was found. */
    node: PmNode;
}

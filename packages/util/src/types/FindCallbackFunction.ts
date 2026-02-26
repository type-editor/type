import { PmNode } from '@type-editor/model';

/**
 * A callback function used to find nodes in the document tree.
 *
 * @param node - The node to evaluate.
 * @returns `true` if the node matches the search criteria, `false` otherwise.
 */
export type FindCallbackFunction = (node: PmNode) => boolean;

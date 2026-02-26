import type {TransformDocument} from '@type-editor/editor-types';
import {
    type ContentMatch,
    Fragment,
    type NodeSpec,
    type NodeType,
    type PmNode,
    type ResolvedPos,
    Slice
} from '@type-editor/model';

import {ReplaceStep} from '../change-steps/ReplaceStep';
import {coveredDepths, fitsTrivially} from './util';

/**
 * Replace a range in a transform with a slice, trying to find the best way to fit it.
 *
 * @param transform - The transform to apply the replacement to
 * @param from - Start position
 * @param to - End position
 * @param slice - The slice to insert
 * @returns The modified transform
 */
export function replaceRange(transform: TransformDocument,
                             from: number,
                             to: number,
                             slice: Slice): TransformDocument {
    if (!slice.size) {
        return transform.deleteRange(from, to);
    }

    const $from: ResolvedPos = transform.doc.resolve(from);
    const $to: ResolvedPos = transform.doc.resolve(to);

    if (fitsTrivially($from, $to, slice)) {
        return transform.step(new ReplaceStep(from, to, slice));
    }

    const {targetDepths, preferredTarget} = computeTargetDepths($from, $to);
    const preferredTargetIndex: number = targetDepths.indexOf(preferredTarget);

    const leftNodes: Array<PmNode> = collectLeftNodes(slice);
    const preferredDepth: number = adjustPreferredDepth(slice, leftNodes, $from, preferredTarget);

    // Try to fit the slice at different depths
    const result: TransformDocument = tryFitSliceAtDepths(transform, $from, $to, to, slice, leftNodes, preferredDepth, targetDepths, preferredTargetIndex);
    if (result) {
        return result;
    }

    // Fall back to expanding the range if direct fitting failed
    return fallbackReplace(transform, $from, $to, from, to, slice, targetDepths);
}

/**
 * Compute possible target depths for replacement.
 *
 * @param $from - Resolved start position
 * @param $to - Resolved end position
 * @returns Object containing target depths array and preferred target
 */
function computeTargetDepths($from: ResolvedPos, $to: ResolvedPos): {
    targetDepths: Array<number>,
    preferredTarget: number
} {
    const targetDepths: Array<number> = coveredDepths($from, $to);

    // Can't replace the whole document, so remove 0 if it's present
    if (targetDepths[targetDepths.length - 1] === 0) {
        targetDepths.pop();
    }

    // Negative numbers represent not expansion over the whole node at
    // that depth, but replacing from $from.before(-D) to $to.pos.
    let preferredTarget: number = -($from.depth + 1);
    targetDepths.unshift(preferredTarget);

    // Pick a preferred target depth and add negative depths for any depth
    // that has $from at its start and does not cross a defining node.
    for (let depth = $from.depth, pos = $from.pos - 1; depth > 0; depth--, pos--) {
        const spec: NodeSpec = $from.node(depth).type.spec;
        if (spec.defining || spec.definingAsContext || spec.isolating) {
            break;
        }

        if (targetDepths.includes(depth)) {
            preferredTarget = depth;
        } else if ($from.before(depth) === pos) {
            targetDepths.splice(1, 0, -depth);
        }
    }

    return {targetDepths, preferredTarget};
}

/**
 * Collect all nodes on the left side of the slice's open start.
 *
 * @param slice - The slice to collect nodes from
 * @returns Array of nodes on the left spine
 */
function collectLeftNodes(slice: Slice): Array<PmNode> {
    const leftNodes: Array<PmNode> = [];
    let content: Fragment = slice.content;

    for (let i = 0; ; i++) {
        const node: PmNode = content.firstChild;
        leftNodes.push(node);
        if (i === slice.openStart) {
            break;
        }
        content = node.content;
    }

    return leftNodes;
}

/**
 * Adjust the preferred depth to cover defining textblocks.
 *
 * @param slice - The slice being inserted
 * @param leftNodes - Nodes on the left spine of the slice
 * @param $from - Resolved start position
 * @param preferredTarget - The current preferred target depth
 * @returns The adjusted preferred depth
 */
function adjustPreferredDepth(slice: Slice,
                              leftNodes: Array<PmNode>,
                              $from: ResolvedPos,
                              preferredTarget: number): number {
    let preferredDepth: number = slice.openStart;

    // Back up preferredDepth to cover defining textblocks directly
    // above it, possibly skipping a non-defining textblock.
    for (let depth = preferredDepth - 1; depth >= 0; depth--) {
        const leftNode: PmNode = leftNodes[depth];
        const isDefining: boolean = definesContent(leftNode.type);

        if (isDefining && !leftNode.sameMarkup($from.node(Math.abs(preferredTarget) - 1))) {
            preferredDepth = depth;
        } else if (isDefining || !leftNode.type.isTextblock) {
            break;
        }
    }

    return preferredDepth;
}

/**
 * Try to fit the slice at various depths and target positions.
 *
 * @param transform - The transform to apply to
 * @param $from - Resolved start position
 * @param $to - Resolved end position
 * @param to - End position number
 * @param slice - The slice to fit
 * @param leftNodes - Nodes on the left spine
 * @param preferredDepth - Preferred depth for fitting
 * @param targetDepths - Array of possible target depths
 * @param preferredTargetIndex - Index of preferred target in the array
 * @returns The modified transform, or null if fitting failed
 */
function tryFitSliceAtDepths(transform: TransformDocument,
                             $from: ResolvedPos,
                             $to: ResolvedPos,
                             to: number,
                             slice: Slice,
                             leftNodes: Array<PmNode>,
                             preferredDepth: number,
                             targetDepths: Array<number>,
                             preferredTargetIndex: number): TransformDocument | null {
    for (let j = slice.openStart; j >= 0; j--) {
        const openDepth: number = (j + preferredDepth + 1) % (slice.openStart + 1);
        const insert: PmNode = leftNodes[openDepth];

        if (!insert) {
            continue;
        }

        const replacement: TransformDocument = tryInsertAtTargetDepths(
            transform, $from, $to, to, slice, insert, openDepth, targetDepths, preferredTargetIndex
        );

        if (replacement) {
            return replacement;
        }
    }

    return null;
}

/**
 * Try to insert the node at different target depths.
 *
 * @param transform - The transform to apply to
 * @param $from - Resolved start position
 * @param $to - Resolved end position
 * @param to - End position number
 * @param slice - The slice being inserted
 * @param insert - The node to insert
 * @param openDepth - The open depth for the insertion
 * @param targetDepths - Array of possible target depths
 * @param preferredTargetIndex - Index of preferred target
 * @returns The modified transform, or null if insertion failed
 */
function tryInsertAtTargetDepths(transform: TransformDocument,
                                 $from: ResolvedPos,
                                 $to: ResolvedPos,
                                 to: number,
                                 slice: Slice,
                                 insert: PmNode,
                                 openDepth: number,
                                 targetDepths: Array<number>,
                                 preferredTargetIndex: number): TransformDocument | null {
    for (let i = 0; i < targetDepths.length; i++) {
        // Loop over possible expansion levels, starting with the preferred one
        let targetDepth: number = targetDepths[(i + preferredTargetIndex) % targetDepths.length];
        let shouldExpand = true;

        if (targetDepth < 0) {
            shouldExpand = false;
            targetDepth = -targetDepth;
        }

        const parent: PmNode = $from.node(targetDepth - 1);
        const index: number = $from.index(targetDepth - 1);

        if (parent.canReplaceWith(index, index, insert.type, insert.marks)) {
            const closingFragment: Fragment = closeFragment(slice.content, 0, slice.openStart, openDepth);
            const newSlice: Slice = new Slice(closingFragment, openDepth, slice.openEnd);
            const replaceFrom: number = $from.before(targetDepth);
            const replaceTo: number = shouldExpand ? $to.after(targetDepth) : to;
            return transform.replace(replaceFrom, replaceTo, newSlice);
        }
    }

    return null;
}

/**
 * Check if a node type defines content structure.
 *
 * @param type - The node type to check
 * @returns True if the type is defining or definingForContent
 */
function definesContent(type: NodeType): boolean {
    return type.spec.defining || type.spec.definingForContent;
}

/**
 * Fall back to trying replacement with expanded ranges.
 *
 * @param transform - The transform to apply to
 * @param $from - Resolved start position
 * @param $to - Resolved end position
 * @param from - Start position number
 * @param to - End position number
 * @param slice - The slice to insert
 * @param targetDepths - Array of possible target depths
 * @returns The modified transform
 */
function fallbackReplace(transform: TransformDocument,
                         $from: ResolvedPos,
                         $to: ResolvedPos,
                         from: number,
                         to: number,
                         slice: Slice,
                         targetDepths: Array<number>): TransformDocument {
    const startSteps: number = transform.steps.length;

    for (let i = targetDepths.length - 1; i >= 0; i--) {
        transform.replace(from, to, slice);

        if (transform.steps.length > startSteps) {
            break;
        }

        const depth: number = targetDepths[i];
        if (depth < 0) {
            continue;
        }

        from = $from.before(depth);
        to = $to.after(depth);
    }

    return transform;
}

/**
 * Close a fragment by recursively processing open nodes and filling required content.
 *
 * @param fragment - The fragment to close
 * @param depth - Current depth in the recursion
 * @param oldOpen - Original open depth
 * @param newOpen - Target open depth
 * @param parent - Parent node (used when closing at depth > newOpen)
 * @returns The closed fragment
 */
function closeFragment(fragment: Fragment,
                       depth: number,
                       oldOpen: number,
                       newOpen: number,
                       parent?: PmNode): Fragment {
    // Recursively close deeper open nodes
    if (depth < oldOpen) {
        const firstChild: PmNode = fragment.firstChild;
        const closedChildContent: Fragment = closeFragment(firstChild.content, depth + 1, oldOpen, newOpen, firstChild);
        const closedChild: PmNode = firstChild.copy(closedChildContent);
        return fragment.replaceChild(0, closedChild);
    }

    // Fill required content when closing nodes beyond the new open depth
    if (depth > newOpen && parent) {
        const contentMatch: ContentMatch = parent.contentMatchAt(0);
        const withPrefix: Fragment = contentMatch.fillBefore(fragment).append(fragment);
        const matchedContent: ContentMatch = contentMatch.matchFragment(withPrefix);
        return withPrefix.append(matchedContent.fillBefore(Fragment.empty, true));
    }

    return fragment;
}

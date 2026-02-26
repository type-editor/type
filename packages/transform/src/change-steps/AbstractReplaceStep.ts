import {isUndefinedOrNull} from '@type-editor/commons';
import {type PmNode, type ResolvedPos} from '@type-editor/model';

import {Step} from './Step';


/**
 * Base class for replace steps, providing common functionality
 * for checking content structure between positions.
 */
export abstract class AbstractReplaceStep extends Step {

    /**
     * Check if there is content between two positions in the document
     * that would interfere with a structure-preserving replace operation.
     *
     * @param doc The document node to check.
     * @param from The start position.
     * @param to The end position.
     * @returns True if there is interfering content, false otherwise.
     */
    protected contentBetween(doc: PmNode, from: number, to: number): boolean {
        const $from: ResolvedPos = doc.resolve(from);
        let dist: number = to - from;
        let depth: number = $from.depth;

        while (dist > 0 && depth > 0 && $from.indexAfter(depth) === $from.node(depth).childCount) {
            depth--;
            dist--;
        }

        if (dist > 0) {
            let next: PmNode | null = $from.node(depth).maybeChild($from.indexAfter(depth));
            while (dist > 0) {
                if (isUndefinedOrNull(next) || next.isLeaf) {
                    return true;
                }
                next = next.firstChild;
                dist--;
                // If next became null/undefined after accessing firstChild, it will be caught in the next iteration
                // or the loop will exit if dist reaches 0
            }
        }
        return false;
    }

}

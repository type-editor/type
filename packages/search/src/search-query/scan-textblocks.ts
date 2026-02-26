import {isUndefinedOrNull} from '@type-editor/commons';
import { type PmNode } from '@type-editor/model';

/**
 * Scans through text blocks in a document tree, calling a callback for each text block
 * that intersects with the given range.
 *
 * Supports both forward scanning (from < to) and backward scanning (from > to).
 *
 * @param node - The node to scan
 * @param from - The start position of the range
 * @param to - The end position of the range
 * @param callback - Function called for each text block, should return a result or null to continue
 * @param nodeStart - The starting position of the current node in the document
 * @returns The first non-null result from the callback, or null if none found
 */
export function scanTextblocks<T>(node: PmNode,
                                  from: number,
                                  to: number,
                                  callback: (node: PmNode, startPos: number) => T | null,
                                  nodeStart = 0): T | null {
    // If this node contains inline content, process it directly
    if (node.inlineContent) {
        return callback(node, nodeStart);
    }

    // If this is a non-leaf block node, recurse into children
    if (!node.isLeaf) {
        // Backward scan (from > to)
        if (from > to) {
            let position = nodeStart + node.content.size;

            for (let i = node.childCount - 1; i >= 0 && position > to; i--) {
                const child: PmNode = node.child(i);
                position -= child.nodeSize;

                if (position < from) {
                    const result: T | null = scanTextblocks(child, from, to, callback, position + 1);

                    if (!isUndefinedOrNull(result)) {
                        return result;
                    }
                }
            }
        }
        // Forward scan (from <= to)
        else {
            let position = nodeStart;

            for (let i = 0; i < node.childCount && position < to; i++) {
                const child: PmNode = node.child(i);
                const childStart: number = position;
                position += child.nodeSize;

                if (position > from) {
                    const result: T | null = scanTextblocks(child, from, to, callback, childStart + 1);

                    if (!isUndefinedOrNull(result)) {
                        return result;
                    }
                }
            }
        }
    }

    return null;
}

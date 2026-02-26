import {isUndefinedOrNull} from '@type-editor/commons';
import { type PmNode } from '@type-editor/model';

export class AbstractQueryImpl {

    /**
     * Unicode Object Replacement Character used to represent non-text leaf nodes.
     */
    private static readonly OBJECT_REPLACEMENT_CHAR = '\ufffc';

    /**
     * Cache for text content extraction. Uses WeakMap to allow garbage collection.
     */
    private static readonly TEXT_CONTENT_CACHE = new WeakMap<PmNode, string>();

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
    protected scanTextblocks<T>(node: PmNode,
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
                        const result: T | null = this.scanTextblocks(child, from, to, callback, position + 1);

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
                        const result: T | null = this.scanTextblocks(child, from, to, callback, childStart + 1);

                        if (!isUndefinedOrNull(result)) {
                            return result;
                        }
                    }
                }
            }
        }

        return null;
    }

    /**
     * Extracts the text content from a node, with caching for performance.
     * - Text nodes contribute their text
     * - Leaf nodes (like images) are represented by the Object Replacement Character (U+FFFC)
     * - Block nodes have their content extracted recursively with spaces around them
     *
     * @param node - The node to extract text content from
     * @returns The text content of the node
     */
    protected textContent(node: PmNode): string {
        // Check cache first
        const cached: string | undefined = AbstractQueryImpl.TEXT_CONTENT_CACHE.get(node);
        if (cached !== undefined) {
            return cached;
        }

        let content = '';

        for (let i = 0; i < node.childCount; i++) {
            const child: PmNode = node.child(i);

            if (child.isText) {
                // Text node: add its text
                content += child.text;
            } else if (child.isLeaf) {
                // Leaf node (image, hr, etc.): represent with Object Replacement Character
                content += AbstractQueryImpl.OBJECT_REPLACEMENT_CHAR;
            } else {
                // Block node: recurse with spaces around content
                content += ` ${this.textContent(child)} `;
            }
        }

        // Cache the result
        AbstractQueryImpl.TEXT_CONTENT_CACHE.set(node, content);
        return content;
    }
}

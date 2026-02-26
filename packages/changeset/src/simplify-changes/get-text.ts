import type {Fragment, Node} from '@type-editor/model';


/**
 * Extracts text content from a document fragment range.
 *
 * Converts a range of document nodes into a string representation for
 * character-level analysis. Non-text elements (images, widgets, etc.) are
 * represented as spaces to prevent them from being considered part of words.
 *
 * @param fragment - The document fragment to extract text from.
 * @param start - The start position of the range (inclusive).
 * @param end - The end position of the range (exclusive).
 * @returns The text content with non-text nodes replaced by spaces.
 */
export function getText(fragment: Fragment, start: number, end: number): string {
    const resultParts: Array<string> = [];

    /**
     * Recursively extracts text from a fragment, handling different node types.
     *
     * @param frag - The fragment to process.
     * @param rangeStart - The start position relative to the fragment.
     * @param rangeEnd - The end position relative to the fragment.
     */
    function extractText(frag: Fragment, rangeStart: number, rangeEnd: number): void {
        let offset = 0;

        for (let i = 0; i < frag.childCount; i++) {
            const child: Node = frag.child(i);
            const childEnd: number = offset + child.nodeSize;
            const overlapStart: number = Math.max(offset, rangeStart);
            const overlapEnd: number = Math.min(childEnd, rangeEnd);

            // Only process nodes that overlap with our range
            if (overlapStart < overlapEnd) {
                if (child.isText) {
                    // Extract the relevant portion of text content
                    const textStart: number = Math.max(0, rangeStart - offset);
                    const textEnd: number = Math.min(child.text.length, rangeEnd - offset);
                    resultParts.push(child.text.slice(textStart, textEnd));
                } else if (child.isLeaf) {
                    // Leaf nodes (like images) are represented as spaces
                    resultParts.push(' ');
                } else {
                    // Non-leaf block nodes: add space before if at start
                    if (overlapStart === offset) {
                        resultParts.push(' ');
                    }

                    // Recursively process the node's content
                    const contentStart: number = Math.max(0, overlapStart - offset - 1);
                    const contentEnd: number = Math.min(child.content.size, overlapEnd - offset);
                    extractText(child.content, contentStart, contentEnd);

                    // Add space after if at end
                    if (overlapEnd === childEnd) {
                        resultParts.push(' ');
                    }
                }
            }

            offset = childEnd;
        }
    }

    extractText(fragment, start, end);
    return resultParts.join('');
}

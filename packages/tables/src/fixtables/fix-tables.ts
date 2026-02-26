import type {PmEditorState, PmTransaction} from '@type-editor/editor-types';
import type {PmNode} from '@type-editor/model';

import {fixTable} from './fix-table';

/**
 * Maximum number of positions to scan ahead when looking for unchanged nodes
 * in the changed descendants algorithm.
 */
const MAX_SCAN_AHEAD = 3;


/**
 * Inspects all tables in the given state's document and returns a
 * transaction that fixes any structural issues, if necessary.
 *
 * When a previous known-good state is provided, only the changed parts
 * of the document are scanned, which improves performance for large documents.
 *
 * @param state - The current editor state to inspect for table issues
 * @param oldState - Optional previous state used to optimize by only
 *                   scanning changed document regions
 * @returns A transaction with the fixes applied, or undefined if no fixes
 *          were needed
 */
export function fixTables(state: PmEditorState,
                          oldState?: PmEditorState): PmTransaction | undefined {
    let transaction: PmTransaction | undefined;

    const checkAndFixTable = (node: PmNode, pos: number): void => {
        if (node.type.spec.tableRole === 'table') {
            transaction = fixTable(state, node, pos, transaction);
        }
    };

    if (!oldState) {
        state.doc.descendants(checkAndFixTable);
    } else if (oldState.doc !== state.doc) {
        changedDescendants(oldState.doc, state.doc, 0, checkAndFixTable);
    }

    return transaction;
}

/**
 * Iterates through nodes in the current document that have changed compared to
 * a previous document. This optimization avoids duplicate work on each transaction
 * by only processing nodes that have actually been modified.
 *
 * The algorithm works by comparing children of both documents and using a
 * heuristic scan to quickly identify unchanged nodes (by reference equality).
 * When a changed node is found, the callback is invoked and the algorithm
 * recursively descends into the node's children.
 *
 * @param previousNode - The previous version of the parent node
 * @param currentNode - The current version of the parent node
 * @param currentOffset - The document position offset of the current node
 * @param onNodeChanged - Callback function invoked for each changed node with
 *                        the node and its absolute position as arguments
 */
function changedDescendants(previousNode: PmNode,
                            currentNode: PmNode,
                            currentOffset: number,
                            onNodeChanged: (node: PmNode, pos: number) => void): void {
    const previousChildCount: number = previousNode.childCount;
    const currentChildCount: number = currentNode.childCount;

    let previousIndex = 0;

    for (let currentIndex = 0; currentIndex < currentChildCount; currentIndex++) {
        const currentChild: PmNode = currentNode.child(currentIndex);

        // Scan ahead a few positions to find if this child exists unchanged in the previous document
        let foundUnchanged = false;
        const scanEnd: number = Math.min(previousChildCount, currentIndex + MAX_SCAN_AHEAD);
        for (let scanIndex = previousIndex; scanIndex < scanEnd; scanIndex++) {
            if (previousNode.child(scanIndex) === currentChild) {
                // Found unchanged node - skip it
                previousIndex = scanIndex + 1;
                currentOffset += currentChild.nodeSize;
                foundUnchanged = true;
                break;
            }
        }

        if (foundUnchanged) {
            continue;
        }

        // Node has changed - invoke callback
        onNodeChanged(currentChild, currentOffset);

        // Recursively process children if the previous node at this position has compatible markup
        if (previousIndex < previousChildCount && previousNode.child(previousIndex).sameMarkup(currentChild)) {
            changedDescendants(previousNode.child(previousIndex), currentChild, currentOffset + 1, onNodeChanged);
            previousIndex++;
        } else {
            // Markup differs - process all descendants
            currentChild.nodesBetween(0, currentChild.content.size, onNodeChanged, currentOffset + 1);
        }

        currentOffset += currentChild.nodeSize;
    }
}

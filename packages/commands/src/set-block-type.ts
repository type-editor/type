import type { Command, DispatchFunction, PmEditorState, PmTransaction } from '@type-editor/editor-types';
import type { Attrs, NodeType, PmNode, ResolvedPos } from '@type-editor/model';
import { Fragment, Slice } from '@type-editor/model';
import { TextSelection } from '@type-editor/state';

// Threshold for number of blocks above which we use the fast path
const FAST_PATH_THRESHOLD = 50;

/**
 * Creates a command that converts selected textblocks to a given node type.
 *
 * This command factory function returns a command that attempts to change the type
 * of all textblocks within the selection to the specified node type with the given
 * attributes. This is commonly used for:
 *
 * - Converting paragraphs to headings
 * - Changing heading levels
 * - Converting blocks to code blocks
 * - Setting or removing block-level formatting
 *
 * The command will check each textblock in the selection and only proceed if at least
 * one block can be converted. Blocks that already have the target type and attributes
 * are skipped. The command respects schema constraints and will only convert blocks
 * where the parent node allows the new type.
 *
 * @param nodeType - The node type to convert textblocks to
 * @param attrs - Optional attributes to set on the converted blocks (defaults to null)
 * @returns A command that performs the block type conversion
 *
 * @example
 * ```typescript
 * // Create commands for different heading levels
 * const makeH1 = setBlockType(schema.nodes.heading, { level: 1 });
 * const makeH2 = setBlockType(schema.nodes.heading, { level: 2 });
 * const makeParagraph = setBlockType(schema.nodes.paragraph);
 *
 * // Use in a keymap
 * const keymap = {
 *   'Mod-Alt-1': makeH1,
 *   'Mod-Alt-2': makeH2,
 *   'Mod-Alt-0': makeParagraph
 * };
 *
 * // Use in a menu
 * const menuItem = {
 *   label: 'Convert to Heading 1',
 *   run: setBlockType(schema.nodes.heading, { level: 1 }),
 *   enable: (state) => setBlockType(schema.nodes.heading, { level: 1 })(state)
 * };
 * ```
 */
export function setBlockType(nodeType: NodeType,
                             attrs: Attrs | null = null): Command {
    return (state: PmEditorState, dispatch?: DispatchFunction): boolean => {
        // Fast path for just checking if command is enabled (no dispatch)
        // We only need to find ONE convertible block to return true
        if (!dispatch) {
            return hasAnyConvertibleBlock(state, nodeType, attrs);
        }

        // When dispatching, we need more information to decide the strategy
        const convertibleInfo = getConvertibleBlocksInfo(state, nodeType, attrs);

        if (!convertibleInfo.hasConvertible) {
            return false;
        }

        const { from, to } = state.selection;
        const transaction: PmTransaction = state.transaction;

        // If we have many blocks, use fast path with single-pass transformation
        if (convertibleInfo.count >= FAST_PATH_THRESHOLD && !convertibleInfo.needsComplexHandling) {
            applyFastBlockTypeChange(state, transaction, nodeType, attrs, from, to);
        } else {
            // Use the standard transform method for small numbers or complex cases
            for (const range of state.selection.ranges) {
                transaction.setBlockType(range.$from.pos, range.$to.pos, nodeType, attrs);
            }
        }

        dispatch(transaction.scrollIntoView());
        console.log(transaction.getUpdated());
        return transaction.getUpdated() > 0;
    };
}

/**
 * Quick check if there's at least one convertible block in the selection.
 * Stops immediately after finding one - used for enablement checks.
 */
function hasAnyConvertibleBlock(state: PmEditorState, nodeType: NodeType, attrs: Attrs | null): boolean {
    for (const range of state.selection.ranges) {
        const { $from: { pos: from }, $to: { pos: to } } = range;
        let found = false;

        state.doc.nodesBetween(from, to, (node, pos) => {
            if (found) {
                return false;
            }

            if (canConvertBlock(node, nodeType, attrs, state, pos)) {
                found = true;
                return false;
            }
            return true;
        });

        if (found) {
            return true;
        }
    }
    return false;
}

/**
 * Apply block type changes using a fast single-pass document transformation.
 * This creates only one new document instead of N documents for N blocks.
 */
function applyFastBlockTypeChange(state: PmEditorState,
                                  transaction: PmTransaction,
                                  nodeType: NodeType,
                                  attrs: Attrs | null,
                                  from: number,
                                  to: number): boolean {
    // Collect all positions that need conversion
    const positionsToConvert = new Map<number, { attrs: Attrs | null; marks: ReadonlyArray<import('@type-editor/model').Mark> }>();

    state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.isTextblock && !node.hasMarkup(nodeType, attrs) && canConvertBlock(node, nodeType, attrs, state, pos)) {
            positionsToConvert.set(pos, { attrs, marks: node.marks });
            return false;
        }
        return true;
    });

    if (positionsToConvert.size === 0) {
        return false;
    }

    // Transform the document content in a single pass
    const transformedContent: Fragment = transformFragmentBlockType(
        state.doc.content,
        nodeType,
        positionsToConvert,
        0
    );

    if (transformedContent !== state.doc.content) {
        // Replace the entire document content
        transaction.replace(0, state.doc.content.size, new Slice(transformedContent, 0, 0));

        // Restore selection (positions should be the same since we only changed node types)
        const newFrom = Math.min(from, transaction.doc.content.size);
        const newTo = Math.min(to, transaction.doc.content.size);

        try {
            transaction.setSelection(TextSelection.create(transaction.doc, newFrom, newTo));
        } catch (_e) {
            // If the selection is invalid, keep the default
        }

        return true;
    }

    return false;
}

/**
 * Transform a fragment, changing block types on textblocks at specified positions.
 */
function transformFragmentBlockType(fragment: Fragment,
                                    type: NodeType,
                                    positionsToConvert: Map<number, { attrs: Attrs | null; marks: ReadonlyArray<import('@type-editor/model').Mark> }>,
                                    basePos: number): Fragment {
    let changed = false;
    const newChildren: Array<PmNode> = [];
    let pos = basePos;

    for (let i = 0; i < fragment.childCount; i++) {
        const child: PmNode = fragment.child(i);
        const childStart: number = pos;

        const conversionInfo = positionsToConvert.get(childStart);

        if (conversionInfo) {
            // Convert this textblock to the new type
            const newNode: PmNode = type.create(conversionInfo.attrs, child.content, conversionInfo.marks);
            newChildren.push(newNode);
            changed = true;
        } else if (child.content.size > 0 && !child.isTextblock) {
            // Recursively transform children of non-textblock nodes
            const transformedContent: Fragment = transformFragmentBlockType(
                child.content,
                type,
                positionsToConvert,
                pos + 1
            );

            if (transformedContent !== child.content) {
                newChildren.push(child.copy(transformedContent));
                changed = true;
            } else {
                newChildren.push(child);
            }
        } else {
            newChildren.push(child);
        }

        pos += child.nodeSize;
    }

    return changed ? Fragment.from(newChildren) : fragment;
}


/**
 * Checks if a block can be converted to the given node type.
 *
 * @param node - The node to check
 * @param nodeType - The target node type
 * @param attrs - The target attributes
 * @param state - The current editor state
 * @param pos - The position of the node
 * @returns `true` if the block can be converted, `false` otherwise
 */
function canConvertBlock(node: PmNode,
                         nodeType: NodeType,
                         attrs: Attrs | null,
                         state: PmEditorState,
                         pos: number): boolean {
    // Skip non-textblocks
    if (!node.isTextblock) {
        return false;
    }

    // Skip blocks that already have the target type and attributes
    if (node.hasMarkup(nodeType, attrs)) {
        return false;
    }

    // If it's the same type, it's convertible (just attribute change)
    if (node.type === nodeType) {
        return true;
    }

    // Check if the parent allows replacing with the new type
    const $pos: ResolvedPos = state.doc.resolve(pos);
    const index: number = $pos.index();
    return $pos.parent.canReplaceWith(index, index + 1, nodeType);
}

/**
 * Gets information about convertible blocks in the selection.
 * Optimized to stop early once we have enough information.
 */
function getConvertibleBlocksInfo(state: PmEditorState,
                                  nodeType: NodeType,
                                  attrs: Attrs | null): { hasConvertible: boolean; count: number; needsComplexHandling: boolean } {
    let count = 0;
    let hasConvertible = false;
    let needsComplexHandling = false;
    let shouldStop = false;

    for (const range of state.selection.ranges) {
        if (shouldStop) {
            break;
        }

        const { $from: { pos: from }, $to: { pos: to } } = range;

        state.doc.nodesBetween(from, to, (node, pos) => {
            // Stop early if we've gathered enough information
            if (shouldStop) {
                return false;
            }

            if (canConvertBlock(node, nodeType, attrs, state, pos)) {
                hasConvertible = true;
                count++;

                // Only check for special handling on first few blocks to avoid overhead
                if (count <= 10 && !needsComplexHandling) {
                    if (needsSpecialHandling(node, nodeType)) {
                        needsComplexHandling = true;
                    }
                }

                // Once we've found enough blocks for the fast path threshold,
                // we can stop counting (we just need to know it's >= threshold)
                if (count >= FAST_PATH_THRESHOLD && !needsComplexHandling) {
                    shouldStop = true;
                    return false;
                }
            }
            return true;
        });
    }

    return { hasConvertible, count, needsComplexHandling };
}

/**
 * Check if a block conversion needs special handling (marks, content, newlines).
 */
function needsSpecialHandling(node: PmNode, targetType: NodeType): boolean {
    // Check for incompatible marks
    let hasIncompatibleMarks = false;
    node.forEach((child: PmNode) => {
        for (const mark of child.marks) {
            if (!targetType.allowsMarkType(mark.type)) {
                hasIncompatibleMarks = true;
            }
        }
    });

    if (hasIncompatibleMarks) {
        return true;
    }

    // Check for incompatible content
    if (!targetType.validContent(node.content)) {
        return true;
    }

    // Check for newlines that need clearing (pre -> non-pre)
    if (targetType.whitespace !== 'pre') {
        let hasNewlines = false;
        node.forEach((child: PmNode) => {
            if (child.isText && child.text && /[\r\n]/.test(child.text)) {
                hasNewlines = true;
            }
        });
        if (hasNewlines) {
            return true;
        }
    }

    return false;
}

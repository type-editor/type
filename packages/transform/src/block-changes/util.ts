import type {TransformDocument} from '@type-editor/editor-types';
import {type ContentMatch, Fragment, type NodeType, type PmNode, Slice} from '@type-editor/model';

import {RemoveMarkStep} from '../change-steps/RemoveMarkStep';
import {ReplaceStep} from '../change-steps/ReplaceStep';
import type {Step} from '../change-steps/Step';

/**
 * Replace all newline characters in text nodes with linebreak replacement nodes.
 * This is used when joining blocks that should preserve line breaks as nodes.
 *
 * @param transform The transform to apply replacements to.
 * @param node The node to process.
 * @param pos The position of the node.
 * @param mapFrom The starting point for mapping positions.
 */
export function replaceNewlines(transform: TransformDocument,
                                node: PmNode,
                                pos: number,
                                mapFrom: number): void {
    // Collect all newline positions first to avoid issues with changing document
    const replacements: Array<number> = [];

    node.forEach((child: PmNode, offset: number): void => {
        if (child.isText) {
            const newline = /\r?\n|\r/g;
            let newLineMatch: RegExpExecArray | null;

            while ((newLineMatch = newline.exec(child.text)) !== null) {
                replacements.push(pos + 1 + offset + newLineMatch.index);
            }
        }
    });

    // Apply replacements in reverse order to maintain position validity
    for (let i = replacements.length - 1; i >= 0; i--) {
        const start = transform.mapping.slice(mapFrom).map(replacements[i]);
        transform.replaceWith(start, start + 1, node.type.schema.linebreakReplacement.create());
    }
}

/**
 * Replace all linebreak replacement nodes with newline characters.
 * This is used when joining blocks that should collapse line breaks to text.
 *
 * @param transform The transform to apply replacements to.
 * @param node The node to process.
 * @param pos The position of the node.
 * @param mapFrom The starting point for mapping positions.
 */
export function replaceLinebreaks(transform: TransformDocument,
                                  node: PmNode,
                                  pos: number,
                                  mapFrom: number): void {
    node.forEach((child: PmNode, offset: number): void => {
        // Check if this child is a linebreak replacement node
        if (child.type === child.type.schema.linebreakReplacement) {
            const childPos: number = transform.mapping.slice(mapFrom).map(pos + 1 + offset);
            const newlineNode: PmNode = node.type.schema.text('\n');
            transform.replaceWith(childPos, childPos + 1, newlineNode);
        }
    });
}

/**
 * Remove marks from a child node that aren't allowed by the parent type.
 *
 * Iterates through all marks on the child node and creates RemoveMarkStep operations
 * for any marks that the parent node type doesn't allow. This ensures schema compliance
 * when content is moved or when parent node types change.
 *
 * @param transform - The transform to add steps to.
 * @param child - The child node to check for incompatible marks.
 * @param start - Start position of the child node in the document.
 * @param end - End position of the child node in the document.
 * @param parentType - The parent node type whose mark restrictions to enforce.
 */
function removeIncompatibleMarks(transform: TransformDocument,
                                 child: PmNode,
                                 start: number,
                                 end: number,
                                 parentType: NodeType): void {
    for (const mark of child.marks) {
        if (!parentType.allowsMarkType(mark.type)) {
            transform.step(new RemoveMarkStep(start, end, mark));
        }
    }
}

/**
 * Check if newlines should be cleared from a text node.
 *
 * Newlines should be replaced with spaces when the node is a text node and the
 * parent's whitespace handling is not 'pre' (preformatted). This ensures proper
 * text rendering in non-preformatted contexts.
 *
 * @param node - The node to check (must be a text node to return true).
 * @param parentType - The parent node type whose whitespace handling to check.
 * @returns True if the node is a text node and newlines should be replaced with spaces.
 */
function shouldClearNewlines(node: PmNode, parentType: NodeType): boolean {
    return node.isText && parentType.whitespace !== 'pre';
}

/**
 * Ensure the content ends in a valid state by filling required content if needed.
 *
 * After processing all child nodes, the content match may not be in a valid end state
 * (e.g., required nodes are missing). This function adds any required content to satisfy
 * the parent node's content expression, ensuring the document remains schema-compliant.
 *
 * @param transform - The transform to add steps to.
 * @param contentMatch - The current content match state after processing all children.
 * @param position - The position at the end of the parent node's content.
 */
function ensureValidContentEnd(transform: TransformDocument,
                               contentMatch: ContentMatch,
                               position: number): void {
    if (!contentMatch.validEnd) {
        const fill: Fragment = contentMatch.fillBefore(Fragment.empty, true);
        transform.replace(position, position, new Slice(fill, 0, 0));
    }
}

/**
 * Collect replacement steps for all newlines in a text node.
 *
 * Finds all newline characters (LF, CR, or CRLF) in the text node and creates
 * ReplaceStep operations to replace them with spaces. The replacement slice is
 * created once and reused for all newlines for efficiency. All marks from the
 * original text are preserved on the replacement spaces (where allowed by the parent).
 *
 * @param textNode - The text node to process (must have text content).
 * @param nodeStart - Start position of the text node in the document.
 * @param parentType - The parent node type (used to create replacement text with allowed marks).
 * @param steps - Array to accumulate replacement steps (modified in place).
 */
function collectNewlineReplacements(textNode: PmNode,
                                    nodeStart: number,
                                    parentType: NodeType,
                                    steps: Array<Step>): void {
    if (!textNode.text) {
        return;
    }

    const newlinePattern = /\r?\n|\r/g;
    const newLineMatches = Array.from(textNode.text.matchAll(newlinePattern));

    if (newLineMatches.length === 0) {
        return;
    }

    // Create replacement slice once (reused for all newlines)
    const spaceNode: PmNode = parentType.schema.text(' ', parentType.allowedMarks(textNode.marks));
    const replacementSlice = new Slice(Fragment.from(spaceNode), 0, 0);

    // Create replacement step for each newline
    for (const match of newLineMatches) {
        // match.index is always defined for successful matches
        if (match.index === undefined) {
            continue;
        }
        const matchStart = nodeStart + match.index;
        const matchEnd = matchStart + match[0].length;
        steps.push(new ReplaceStep(matchStart, matchEnd, replacementSlice));
    }
}

/**
 * Apply an array of steps in reverse order to maintain correct positions.
 *
 * When multiple replacement steps are collected, they must be applied in reverse order
 * to maintain position correctness. Applying from the end backward ensures that earlier
 * positions remain valid as later positions are modified. This is critical for operations
 * like removing nodes or replacing text, where position changes would invalidate subsequent steps.
 *
 * @param transform - The transform to apply steps to.
 * @param steps - Array of steps to apply in reverse order (last to first).
 */
function applyStepsInReverse(transform: TransformDocument, steps: Array<Step>): void {
    for (let i = steps.length - 1; i >= 0; i--) {
        transform.step(steps[i]);
    }
}

/**
 * Remove nodes and marks that are incompatible with the given parent node type.
 *
 * Used to clean up content when changing a node's type to ensure schema compliance.
 * This is particularly useful when converting between node types (e.g., paragraph to
 * heading) where the allowed content or marks may differ.
 *
 * This function performs the following operations:
 * 1. Removes child nodes that don't fit in the parent's content model
 * 2. Removes marks that aren't allowed on child nodes
 * 3. Optionally replaces newlines with spaces in text nodes (for non-pre whitespace)
 * 4. Fills any required content at the end if needed (to satisfy content expressions)
 *
 * @param transform - The transform to add steps to.
 * @param position - The position of the parent node whose content should be cleaned.
 * @param parentType - The node type to validate content against.
 * @param match - Optional content match to start from. If not provided, uses parentType.contentMatch.
 * @param clearNewlines - Whether to replace newlines with spaces in text nodes (default: true).
 * @throws {RangeError} When position is negative or no node exists at the position.
 *
 * @example
 * ```typescript
 * // Clean up content when converting a paragraph to a heading
 * clearIncompatible(tr, paragraphPos, schema.nodes.heading);
 * ```
 */
export function clearIncompatible(transform: TransformDocument,
                                  position: number,
                                  parentType: NodeType,
                                  match?: ContentMatch,
                                  clearNewlines = true): void {
    if (position < 0) {
        throw new RangeError(`Invalid position: ${position} cannot be negative`);
    }

    const parentNode: PmNode | null = transform.doc.nodeAt(position);

    if (!parentNode) {
        throw new RangeError(`No node at position ${position}`);
    }

    let contentMatch: ContentMatch = match || parentType.contentMatch;
    const replacementSteps: Array<Step> = [];
    let currentPos: number = position + 1;

    // Process each child node
    for (let i = 0; i < parentNode.childCount; i++) {
        const child: PmNode = parentNode.child(i);
        const childEnd: number = currentPos + child.nodeSize;

        const isChildAllowed: ContentMatch | null = contentMatch.matchType(child.type);

        if (!isChildAllowed) {
            // Child node doesn't fit in content model - remove it
            replacementSteps.push(new ReplaceStep(currentPos, childEnd, Slice.empty));
        } else {
            contentMatch = isChildAllowed;

            // Remove incompatible marks from the child
            removeIncompatibleMarks(transform, child, currentPos, childEnd, parentType);

            // Handle newlines in text nodes
            if (clearNewlines && shouldClearNewlines(child, parentType)) {
                collectNewlineReplacements(child, currentPos, parentType, replacementSteps);
            }
        }

        currentPos = childEnd;
    }

    // Ensure content ends validly
    ensureValidContentEnd(transform, contentMatch, currentPos);

    // Apply replacement steps in reverse order to maintain correct positions
    applyStepsInReverse(transform, replacementSteps);
}

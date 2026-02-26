import {isUndefinedOrNull} from '@type-editor/commons';
import type {PmMapping, TransformDocument} from '@type-editor/editor-types';
import {type Attrs, Fragment, type NodeType, type PmNode, type ResolvedPos, Slice} from '@type-editor/model';

import {ReplaceAroundStep} from '../change-steps/ReplaceAroundStep';
import {clearIncompatible, replaceLinebreaks, replaceNewlines} from './util';

/**
 * Information about a block that needs to be converted
 */
interface BlockToConvert {
    pos: number;
    node: PmNode;
    attrs: Attrs | null;
    needsLinebreakConversion: boolean | null;
    needsComplexHandling: boolean;
}

/**
 * Change the type of all textblocks in a range to a different type.
 *
 * @param transform The transform to apply the changes to.
 * @param from Start of the range.
 * @param to End of the range.
 * @param type The new node type.
 * @param attrs Attributes for the new type (can be a function that computes attrs from old node).
 */
export function setBlockType(transform: TransformDocument,
                             from: number,
                             to: number,
                             type: NodeType,
                             attrs: Attrs | null | ((oldNode: PmNode) => Attrs)): void {
    if (!type.isTextblock) {
        throw new RangeError('Type given to setBlockType should be a textblock');
    }

    // Collect all blocks that need to be converted
    const blocksToConvert: Array<BlockToConvert> = [];
    let hasComplexConversions = false;

    transform.doc.nodesBetween(from, to, (node: PmNode, pos: number): boolean => {
        let attrsHere: Attrs | null;
        if (typeof attrs === 'function') {
            attrsHere = attrs(node) as Attrs | null;
        } else {
            attrsHere = attrs;
        }

        if (node.isTextblock
            && !node.hasMarkup(type, attrsHere)
            && canChangeType(transform.doc, pos, type)) {

            let convertNewlines: boolean | null = null;

            if (type.schema.linebreakReplacement) {
                const isPre: boolean = type.whitespace === 'pre';
                const supportsLinebreak = !isUndefinedOrNull(type.contentMatch.matchType(type.schema.linebreakReplacement));

                if (isPre && !supportsLinebreak) {
                    convertNewlines = false;
                } else if (!isPre && supportsLinebreak) {
                    convertNewlines = true;
                }
            }

            // Check if this conversion needs special handling (linebreak conversion, mark clearing, content incompatibility,
            // or newlines that need to be cleared)
            const needsMarkClearing = hasIncompatibleMarks(node, type);
            const contentIsIncompatible = !type.validContent(node.content);
            // If target type is not 'pre' and source has newlines, we need complex handling to clear them
            const needsNewlineClearing = type.whitespace !== 'pre' && hasNewlines(node);
            const needsComplexHandling = convertNewlines !== null || needsMarkClearing || contentIsIncompatible || needsNewlineClearing;

            if (needsComplexHandling) {
                hasComplexConversions = true;
            }

            blocksToConvert.push({
                pos,
                node,
                attrs: attrsHere,
                needsLinebreakConversion: convertNewlines,
                needsComplexHandling
            });

            return false;
        }
        return true;
    });

    // If no blocks to convert, we're done
    if (blocksToConvert.length === 0) {
        return;
    }

    // If there are complex conversions (linebreaks, mark clearing), use the slower path
    if (hasComplexConversions) {
        applyComplexConversions(transform, blocksToConvert, type);
        return;
    }

    // Fast path: use single-pass document transformation
    applySinglePassTransformation(transform, blocksToConvert, type, from, to);
}

// Threshold for when to use chunked processing vs direct processing
// const CHUNK_SIZE = 100;

/**
 * Apply block type changes using ReplaceAroundStep for each block.
 * Processes in reverse order to avoid position mapping between steps.
 * For large numbers of blocks, yields control periodically to avoid freezing.
 */
function applySinglePassTransformation(transform: TransformDocument,
                                       blocksToConvert: Array<BlockToConvert>,
                                       _type: NodeType,
                                       _from: number,
                                       _to: number): void {
    // Process blocks in reverse order to maintain position validity
    // (later positions aren't affected by earlier replacements)
    for (let i = blocksToConvert.length - 1; i >= 0; i--) {
        const block = blocksToConvert[i];
        const { pos, node, attrs } = block;

        // Use ReplaceAroundStep to preserve positions within the node's content
        transform.step(new ReplaceAroundStep(
            pos,
            pos + node.nodeSize,
            pos + 1,
            pos + node.nodeSize - 1,
            new Slice(Fragment.from(_type.create(attrs, null, node.marks)), 0, 0),
            1,
            true
        ));
    }
}


/**
 * Check if a node contains newline characters in its text content
 */
function hasNewlines(node: PmNode): boolean {
    let found = false;
    node.forEach((child: PmNode): boolean | undefined => {
        if (child.isText && child.text && /[\r\n]/.test(child.text)) {
            found = true;
            return false; // Stop iteration
        }
        if (found) {
            return false;
        }
        return;
    });
    return found;
}

/**
 * Check if a node has marks that are incompatible with the target type
 */
function hasIncompatibleMarks(node: PmNode, type: NodeType): boolean {
    let hasIncompatible = false;
    node.forEach((child: PmNode): boolean | undefined => {
        for (const mark of child.marks) {
            if (!type.allowsMarkType(mark.type)) {
                hasIncompatible = true;
                return false; // Stop iteration
            }
        }
        if (hasIncompatible) {
            return false;
        }
        return;
    });
    return hasIncompatible;
}



/**
 * Apply complex conversions that need linebreak handling or mark clearing
 */
function applyComplexConversions(transform: TransformDocument,
                                 blocksToConvert: Array<BlockToConvert>,
                                 type: NodeType): void {
    const mapFrom: number = transform.steps.length;

    for (const block of blocksToConvert) {
        const {pos, node, attrs: attrsHere, needsLinebreakConversion} = block;

        // Ensure all markup that isn't allowed in the new node type is cleared
        if (!needsLinebreakConversion) {
            replaceLinebreaks(transform, node, pos, mapFrom);
        }

        clearIncompatible(
            transform,
            transform.mapping.slice(mapFrom).map(pos, 1),
            type,
            undefined,
            isUndefinedOrNull(needsLinebreakConversion)
        );

        const mapping: PmMapping = transform.mapping.slice(mapFrom);
        const startPos: number = mapping.map(pos, 1);
        const endPos: number = mapping.map(pos + node.nodeSize, 1);

        transform.step(new ReplaceAroundStep(
            startPos,
            endPos,
            startPos + 1,
            endPos - 1,
            new Slice(Fragment.from(type.create(attrsHere, null, node.marks)), 0, 0),
            1,
            true
        ));

        if (needsLinebreakConversion) {
            replaceNewlines(transform, node, pos, mapFrom);
        }
    }
}

/**
 * Check if a node type can be changed at the given position.
 *
 * @param doc The document.
 * @param pos The position to check.
 * @param type The new node type.
 * @returns True if the type can be changed.
 */
function canChangeType(doc: PmNode, pos: number, type: NodeType): boolean {
    const $pos: ResolvedPos = doc.resolve(pos);
    const index: number = $pos.index();
    return $pos.parent.canReplaceWith(index, index + 1, type);
}


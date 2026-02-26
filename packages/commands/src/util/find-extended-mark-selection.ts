import { isUndefinedOrNull } from '@type-editor/commons';
import type { MarkType, PmNode, ResolvedPos } from '@type-editor/model';

/**
 * Result of attempting to find an extended selection for an empty selection.
 */
export interface ExtendedSelectionResult {
    /** Whether a valid character was found for extension */
    found: boolean;
    /** The start position of the extended selection */
    from: number;
    /** The end position of the extended selection */
    to: number;
    /** The character or text that would be selected */
    char?: string;
    /** Whether the extended range was found via an existing mark */
    fromMark?: boolean;
}


/**
 * Attempts to find an extended selection for an empty selection.
 *
 * If the cursor is within a range that has the specified mark type, extends
 * the selection to cover the entire contiguous marked range. This is useful
 * for toggling marks like links where the user positions the cursor inside
 * the linked text and expects the entire link to be toggled.
 *
 * If not within a marked range, falls back to selecting a single adjacent
 * character (first checking before, then after the cursor).
 *
 * @param doc - The document node
 * @param $cursor - The resolved cursor position
 * @param markType - The mark type to check for range extension
 * @param onlyNumbers - Whether to only select numeric characters
 * @returns Information about the extended selection
 */
export function findExtendedMarkSelection(doc: PmNode, $cursor: ResolvedPos, markType: MarkType, onlyNumbers: boolean): ExtendedSelectionResult {
    // Could be null if selection is a NodeSelection on a non-text node (e.g. image)
    if(isUndefinedOrNull($cursor)) {
        return { found: false, from: -1, to: -1 };
    }

    // First, check if we're inside a range that has the mark type
    const markedRange = findMarkedRange($cursor, markType);
    if (markedRange) {
        const text = doc.textBetween(markedRange.from, markedRange.to, '');
        // Validate with onlyNumbers if needed
        if (onlyNumbers && !isNumericOnly(text)) {
            return { found: false, from: $cursor.pos, to: $cursor.pos };
        }
        return {
            found: true,
            from: markedRange.from,
            to: markedRange.to,
            char: text,
            fromMark: true
        };
    }

    // Fall back to single character behavior
    const characterBefore = doc.textBetween(Math.max(0, $cursor.pos - 1), $cursor.pos, '');
    if(characterBefore && (onlyNumbers ? isNumericOnly(characterBefore) : !isWhitespace(characterBefore))) {
        return {
            found: true,
            from: $cursor.pos - 1,
            to: $cursor.pos,
            char: characterBefore
        };
    }

    const characterAfter = doc.textBetween($cursor.pos, Math.min(doc.content.size, $cursor.pos + 1), '');
    if(characterAfter && (onlyNumbers ? isNumericOnly(characterAfter) : !isWhitespace(characterAfter))) {
        return {
            found: true,
            from: $cursor.pos,
            to: $cursor.pos + 1,
            char: characterAfter
        };
    }

    return { found: false, from: $cursor.pos, to: $cursor.pos };
}

/**
 * Finds the full extent of a contiguous marked range around the cursor position.
 *
 * Scans through the parent node's children to find all adjacent nodes that have
 * the specified mark type, returning the full range if the cursor is within it.
 *
 * @param $cursor - The resolved cursor position
 * @param markType - The mark type to find
 * @returns The from/to positions of the marked range, or null if cursor is not in a marked range
 */
function findMarkedRange($cursor: ResolvedPos, markType: MarkType): { from: number; to: number } | null {
    const parent: PmNode = $cursor.parent;

    // Check if we're in inline content
    if (!parent.isTextblock) {
        return null;
    }

    const cursorStartPos = $cursor.start();
    const parentOffset = $cursor.parentOffset;

    // Scan through parent's children to find contiguous marked ranges
    let currentOffset = 0;
    let rangeStart: number | null = null;
    let rangeEnd: number | null = null;
    let cursorInRange = false;

    for (let i = 0; i < parent.childCount; i++) {
        const child: PmNode = parent.child(i);
        const childStart = currentOffset;
        const childEnd = currentOffset + child.nodeSize;
        const hasMark = markType.isInSet(child.marks) !== undefined;

        if (hasMark) {
            // Start or continue a marked range
            rangeStart ??= cursorStartPos + childStart;
            rangeEnd = cursorStartPos + childEnd;

            // Check if cursor is within this child
            if (parentOffset >= childStart && parentOffset <= childEnd) {
                cursorInRange = true;
            }
        } else {
            // End of a potential marked range
            if (cursorInRange && rangeStart !== null && rangeEnd !== null) {
                return { from: rangeStart, to: rangeEnd };
            }
            // Reset for next potential range
            rangeStart = null;
            rangeEnd = null;
            cursorInRange = false;
        }

        currentOffset = childEnd;
    }

    // Check if cursor was in the final marked range
    if (cursorInRange && rangeStart !== null && rangeEnd !== null) {
        return { from: rangeStart, to: rangeEnd };
    }

    return null;
}

/**
 * Regex patterns for whitespace detection (defined at module level for performance)
 */
const WHITESPACE_PATTERN = /\s+$/;

/**
 * Regex pattern for numeric-only validation
 */
const NUMERIC_ONLY_PATTERN = /^\d+$/;

/**
 * Checks if the given text contains only numeric characters.
 *
 * @param text - The text to check
 * @returns `true` if the text contains only digits, `false` otherwise
 */
function isNumericOnly(text: string): boolean {
    return NUMERIC_ONLY_PATTERN.test(text);
}

/**
 * Checks if the given character is a whitespace character.
 *
 * @param character - The character to check
 * @returns `true` if the character is whitespace, `false` otherwise
 */
function isWhitespace(character: string): boolean {
    return WHITESPACE_PATTERN.test(character);
}

